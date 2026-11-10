/* dashboard-core.js - FILE LÕI DÙNG CHUNG */


/* -------- 1. HÀM DÙNG CHUNG (GLOBAL) -------- */


/* --- Helper: Toast (styled) --- */
// (Hàm này tự chạy và gán 'window.showNotification')
(function(){
  function ensureContainer(){
    let c = document.querySelector('.toast-container');
    if (!c) {
      c = document.createElement('div');
      c.className = 'toast-container';
      c.setAttribute('aria-live','polite');
      c.setAttribute('aria-atomic','true');
      document.body.appendChild(c);
    }
    return c;
  }
  window.showNotification = function(payload, type='success', duration=4200) {
    // ... (Toàn bộ code của hàm showNotification ... y hệt file cũ) ...
    const container = ensureContainer();
    let title = (type === 'success') ? 'Thành công' : 'Lỗi';
    let message = '';
    if (typeof payload === 'string') {
      message = payload;
    } else if (typeof payload === 'object' && payload !== null) {
      if (payload.title) title = payload.title;
      message = payload.message || '';
    }
    const card = document.createElement('div');
    card.className = `notify-card notify-${type}`;
    const check = document.createElement('div');
    check.className = 'notify-check';
    if (type === 'success') {
      check.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M20 6L9 17L4 12" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    } else {
      check.innerHTML = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }
    const textWrap = document.createElement('div');
    textWrap.className = 'notify-text';
    const t = document.createElement('div'); t.className = 'notify-title'; t.textContent = title;
    const m = document.createElement('div'); m.className = 'notify-message'; m.textContent = message;
    textWrap.appendChild(t); textWrap.appendChild(m);
    const closeBtn = document.createElement('button');
    closeBtn.className = 'notify-close';
    closeBtn.setAttribute('aria-label','Close notification');
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', () => hide(card));
    card.appendChild(check);
    card.appendChild(textWrap);
    card.appendChild(closeBtn);
    container.appendChild(card);
    function hide(el){
      if (!el) return;
      el.classList.add('notify-hide');
      setTimeout(()=> { if (el && el.parentNode) el.parentNode.removeChild(el); }, 260);
    }
    if (duration && duration > 0) {
      setTimeout(() => hide(card), duration);
    }
  };
})();


/* --- Helper: Định nghĩa các hàm dùng chung (sẽ được gọi bởi các module) --- */
// (Chúng ta sẽ định nghĩa chúng bên trong DOMContentLoaded để đảm bảo an toàn)


/* -------- 2. LOGIC KHỞI TẠO (CHẠY TRÊN MỌI TRANG) -------- */
document.addEventListener('DOMContentLoaded', function() {


  /* --- (CORE) hamburger / overlay --- */
  // (Luôn chạy)
  (function initHamburger() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    if (hamburgerBtn && sidebar && overlay) {
      hamburgerBtn.addEventListener('click', () => { sidebar.classList.add('show'); overlay.classList.add('show'); document.body.style.overflow='hidden'; });
      overlay.addEventListener('click', () => { sidebar.classList.remove('show'); overlay.classList.remove('show'); document.body.style.overflow=''; });
    }
  })();


  /* --- (CORE) Fee toggle (Dùng cho T/T và L/C) --- */
  // (Chạy nếu tìm thấy)
  (function feeToggle() {
    const toggles = document.querySelectorAll('.fee-toggle');
    toggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            const clickedBtn = e.target.closest('.fee-btn');
            if (!clickedBtn) return;
            toggle.querySelectorAll('.fee-btn').forEach(b => b.classList.remove('active'));
            clickedBtn.classList.add('active');
        });
    });
  })();


  /* --- (CORE) File upload (Dùng cho T/T và L/C) --- */
  // (Chạy nếu tìm thấy)
  (function fileUpload() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const list = document.getElementById('file-list');
    if (!dropZone || !fileInput || !list) return;
   
    let files = [];
    // ... (Toàn bộ code của hàm fileUpload ... y hệt file cũ) ...
    function update() {
      list.innerHTML = '';
      files.forEach((f,i)=> {
        const div = document.createElement('div'); div.className='file-item';
        const sp = document.createElement('span'); sp.textContent = f.name; sp.style.marginRight='8px';
        const btn = document.createElement('button'); btn.type='button'; btn.className='remove-file-btn'; btn.textContent='×';
        btn.addEventListener('click', ()=> { files.splice(i,1); update(); });
        div.appendChild(sp); div.appendChild(btn); list.appendChild(div);
      });
      const prompt = dropZone.querySelector('.drop-zone-prompt'); // (Check for prompt)
      if (prompt) prompt.style.display = files.length > 0 ? 'none' : 'block';
    }
    function handleFiles(selected) {
      for (let i=0;i<selected.length;i++){
        const f = selected[i];
        if (!files.some(x => x.name===f.name && x.size===f.size)) files.push(f);
      }
      update();
    }
    dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('dragover'); });
    dropZone.addEventListener('dragleave', ()=> dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', e => { e.preventDefault(); dropZone.classList.remove('dragover'); handleFiles(e.dataTransfer.files); });
    dropZone.addEventListener('click', (e)=> { if (!e.target.classList.contains('remove-file-btn')) fileInput.click(); });
    fileInput.addEventListener('change', e => { handleFiles(e.target.files); e.target.value=null; });
  })();


  /* --- (CORE) Tabs (Dùng cho Documents) --- */
  // (Chạy nếu tìm thấy)
  (function tabs() {
    const tabsContainer = document.querySelector('.tabs');
    if (!tabsContainer) return;
    // ... (Toàn bộ code của hàm tabs ... y hệt file cũ) ...
    const tabButtons = tabsContainer.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-content .tab-pane');
    tabButtons.forEach(btn => btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      tabButtons.forEach(b=>b.classList.remove('active'));
      tabPanes.forEach(p=>p.classList.remove('active'));
      btn.classList.add('active');
      const pane = document.getElementById(target);
      if (pane) pane.classList.add('active');
    }));
  })();
 
  /* --- (CORE) Save draft (Dùng cho T/T và L/C) --- */
  // (Chạy nếu tìm thấy)
  (function saveDraft() {
    const btn = document.getElementById('save-draft-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      // (Dùng lại hàm toast global)
      window.showNotification({
        title: 'Bản nháp đã được lưu',
        message: 'Yêu cầu đã được gửi thành công. Giao dịch của bạn đang chờ xử lý.'
      }, 'success', 3000);
      setTimeout(()=> window.location.href = 'dashboard.html', 900);
    });
  })();




  /* --- (CORE) ĐỊNH NGHĨA CÁC HÀM HELPER VÀ HÀM TÙY CHỈNH --- */
  // (Các module khác sẽ gọi các hàm này)


  /* --- (Helper) inline error --- */
  window.showInlineError = function(id, msg) {
    const el = document.getElementById(id);
    if (el) { el.textContent = msg; el.style.display = 'block'; }
  };
  window.clearInlineErrors = function() {
    document.querySelectorAll('.error-message').forEach(d => { d.textContent=''; d.style.display='none'; });
  };


  /* --- (Helper) custom select widget --- */
  window.createCustomSelect = function(selectEl) {
    if (!selectEl) return;
    if (selectEl.dataset.customized === '1') return;
    selectEl.dataset.customized = '1';
   
    // ... (Toàn bộ code của hàm createCustomSelect ... y hệt file cũ) ...
    selectEl.classList.add('custom-hidden-select');
    const wrap = document.createElement('div');
    wrap.className = 'custom-select-wrap';
    const visible = document.createElement('div');
    visible.className = 'custom-select';
    const selText = document.createElement('div');
    selText.className = 'selected-text';
    const caret = document.createElement('div');
    caret.className = 'caret';
    caret.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9l6 6 6-6" stroke="rgba(234,246,255,0.9)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    visible.appendChild(selText);
    visible.appendChild(caret);
    const list = document.createElement('div');
    list.className = 'custom-select-list';
    list.style.display = 'none';
    Array.from(selectEl.options).forEach((opt, idx) => {
      const item = document.createElement('div');
      item.className = 'custom-select-item';
      item.textContent = opt.textContent;
      item.dataset.value = opt.value;
      if (opt.disabled) { item.style.opacity = '0.5'; item.style.pointerEvents = 'none'; }
      if (opt.selected) item.classList.add('active');
      item.addEventListener('click', () => {
        list.querySelectorAll('.custom-select-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        selText.textContent = item.textContent;
        try { selectEl.value = item.dataset.value; } catch(e){}
        const ev = new Event('change', { bubbles: true });
        selectEl.dispatchEvent(ev);
        closeList();
      });
      list.appendChild(item);
    });
    const selectedOption = selectEl.options[selectEl.selectedIndex];
    selText.textContent = selectedOption ? selectedOption.text : (selectEl.options[0] ? selectEl.options[0].text : '');
    wrap.appendChild(visible);
    wrap.appendChild(list);
    selectEl.parentNode.insertBefore(wrap, selectEl.nextSibling);
    function openList() {
      list.style.display = 'block';
      const active = list.querySelector('.custom-select-item.active');
      if (active) active.scrollIntoView({ block:'nearest' });
      document.addEventListener('click', outsideListener);
    }
    function closeList() {
      list.style.display = 'none';
      document.removeEventListener('click', outsideListener);
    }
    function toggleList(e) {
      e.stopPropagation();
      if (list.style.display === 'block') closeList(); else openList();
    }
    function outsideListener(e) {
      if (!wrap.contains(e.target)) closeList();
    }
    visible.addEventListener('click', toggleList);
    visible.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (list.style.display !== 'block') openList();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        toggleList(e);
      } else if (e.key === 'Escape') {
        closeList();
      }
    });
    return wrap;
  };


}); // end DOMContentLoaded





/* -------- 3. DASHBOARD LOGIC (CHÍNH GIỮ NGUYÊN) -------- */

// ======= Token Storage =======
const TokenStorage = {
  key: 'authToken',
  set(token) { localStorage.setItem(this.key, token); },
  get() { return localStorage.getItem(this.key); },
  remove() { localStorage.removeItem(this.key); }
};

// ======= Login Function =======
async function fetchKPI() {
  console.log('fetchKPI called');
  const token = TokenStorage.get();
  console.log('Token:', token);

  if (!token) {
    showNotification('Chưa có token đăng nhập', 'error');
    return;
  }

  try {
    const url = window.location.origin + '/api/bank/kpi';
    console.log('Fetch URL:', url);

    const res = await fetch(url, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    console.log('Fetch response:', res);

    if (!res.ok) throw new Error('HTTP error ' + res.status);
    const data = await res.json();
    console.log('Data:', data);

    // Gán dữ liệu vào 3 KPI card trong dashboard
    document.getElementById('kpi-compliance-wait').textContent = data.waitingComplianceReview || 0;
    document.getElementById('kpi-approval-wait').textContent = data.waitingApproval || 0;
    document.getElementById('kpi-ops-wait').textContent = data.waitingProcessing || 0;

  } catch (err) {
    console.error('Không tải được KPI:', err);
    showNotification({ title: 'Lỗi', message: 'Không tải được KPI' }, 'error');
  }
}

// ======= DOM Ready (KPI) =======
document.addEventListener('DOMContentLoaded', function() {
  // Kiểm tra phần tử tồn tại trước khi fetch
  if (document.getElementById('kpi-compliance-wait')) {
    fetchKPI();
  }
});
