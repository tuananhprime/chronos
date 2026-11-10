(() => {
  const clearSession = () => {
    localStorage.removeItem('authToken');
    ['profileId', 'selectedTransaction', 'ttReviewData', 'lcReviewData'].forEach(key => sessionStorage.removeItem(key));
    localStorage.removeItem('selectedTransaction');
  };
  const entryUrl = new URL(location.href);
  if (entryUrl.searchParams.get('guest') === '1') {
    clearSession();
    entryUrl.searchParams.delete('guest');
    history.replaceState(null, '', entryUrl.pathname + entryUrl.search + entryUrl.hash);
  }
  const sampleTransactions = [
    { transactionId: 1001, type: 'TT', status: 'Pending', amount: 12500, currency: 'USD', createdAt: new Date().toISOString() },
    { transactionId: 1002, type: 'LC', status: 'Completed', amount: 68000, currency: 'USD', createdAt: new Date().toISOString() },
    { transactionId: 1003, type: 'TT', status: 'Rejected', amount: 4000, currency: 'USD', createdAt: new Date().toISOString() }
  ];
  const hasSession = () => {
    const token = localStorage.getItem('authToken');
    if (!token) return false;
    try {
      const part = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(part));
      if (!payload.exp || payload.exp * 1000 <= Date.now()) throw new Error('Expired');
      return true;
    } catch (_) {
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('profileId');
      return false;
    }
  };
  const detailPages = new Set(['review_tt.html', 'review_lc.html', 'approvaldetail.html', 'processingdetail.html', 'compliancereview.html']);
  const page = location.pathname.split('/').pop();
  const login = (returnTo = location.pathname + location.search) => {
    location.assign('/login.html?next=' + encodeURIComponent(returnTo));
  };
  window.ChronosAccess = {
    isGuest: () => !hasSession(),
    transactions: sampleTransactions,
    requireLogin() { if (hasSession()) return true; login(); return false; },
    returnAfterLogin(fallback) {
      const next = new URLSearchParams(location.search).get('next');
      if (next) {
        const url = new URL(next, location.origin);
        if (url.origin === location.origin && /^\/[a-z_]+\.html$/.test(url.pathname)
            && !['/login.html', '/register.html', '/forgot.html', '/reset.html'].includes(url.pathname)) {
          return url.pathname + url.search;
        }
      }
      return fallback;
    }
  };
  if (detailPages.has(page) && !hasSession()) {
    login();
    return;
  }

  // Existing page scripts get credentials without exposing tokens in URLs.
  const originalFetch = window.fetch.bind(window);
  window.fetch = (input, init = {}) => {
    const url = new URL(typeof input === 'string' ? input : input.url, location.origin);
    if (url.origin === location.origin && url.pathname.startsWith('/api/')) {
      const headers = new Headers(init.headers || (input instanceof Request ? input.headers : undefined));
      const token = localStorage.getItem('authToken');
      if (hasSession() && !headers.has('Authorization')) headers.set('Authorization', 'Bearer ' + token);
      init = { ...init, headers };
    }
    return originalFetch(input, init);
  };

  const protectedForms = '#tt-order-form, #lc-application-form, #profile-form';
  const protectedButtons = '#save-draft-btn, #submit-order-btn, #submit-lc-btn, .view-btn, .review-btn, .btn-icon[title="View"], .btn-icon[title="Download"], .lc-card-footer .btn-primary, [id^="btn-approval-"], [id^="btn-compliance-"], [id^="btn-processing-"]';
  const stopForLogin = event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    login();
  };
  document.addEventListener('click', event => {
    const logoutLink = event.target.closest('.sidebar-logout a');
    if (logoutLink) clearSession();
    if (hasSession()) return;
    const target = event.target.closest('a, button, input[type="file"]');
    if (!target) return;
    if (target.matches(protectedButtons) || target.matches('input[type="file"]')
        || (target.matches('button[type="submit"]') && target.closest(protectedForms))) {
      stopForLogin(event);
      return;
    }
    if (target.tagName === 'A') {
      const url = new URL(target.href, location.origin);
      if (url.origin === location.origin && (detailPages.has(url.pathname.split('/').pop()) || ['tt.html', 'lc.html'].includes(url.pathname.split('/').pop()))) {
        event.preventDefault();
        event.stopImmediatePropagation();
        login(url.pathname + url.search);
      }
    }
  }, true);
  document.addEventListener('submit', event => {
    if (!hasSession() && event.target.matches(protectedForms)) stopForLogin(event);
  }, true);
  document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('.main-content');
    if (!hasSession() && main) {
      // Lock both initial controls and buttons rendered asynchronously by page scripts.
      const lockControls = () => {
        if (hasSession()) return;
        main.querySelectorAll('form').forEach(form => { form.inert = true; });
        main.querySelectorAll('input, select, textarea, button').forEach(control => {
          if (control.matches('.tab-btn, #hamburger-btn, #customer-btn, #bank-btn')) return;
          control.disabled = true;
          control.title = 'Đăng nhập để sử dụng chức năng này';
        });
        main.querySelectorAll('[contenteditable]').forEach(control => { control.contentEditable = 'false'; });
      };
      lockControls();
      new MutationObserver(lockControls).observe(main, { childList: true, subtree: true });
      ['drop', 'dragover', 'change', 'input'].forEach(type => {
        main.addEventListener(type, event => {
          if (!hasSession()) { event.preventDefault(); event.stopImmediatePropagation(); }
        }, true);
      });

      document.querySelectorAll('.sidebar-logout a').forEach(link => {
        link.href = '/login.html';
        const label = link.querySelector('span');
        if (label) label.textContent = 'Đăng nhập';
      });
    }
  });
})();
