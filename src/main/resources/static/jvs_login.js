/* jvs_login.js - Toàn bộ logic cho trang login */

document.addEventListener('DOMContentLoaded', function() {

  // 1. Hàm setActive (CẬP NHẬT: Thêm logic cập nhật input ẩn)
  function setActive(id){
    document.querySelectorAll('.as-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active');

    const roleInput = document.getElementById('loginRole');
    if (id === 'customer-btn') {
      roleInput.value = 'customer';
    } else if (id === 'bank-btn') {
      roleInput.value = 'bank_user';
    }
  }

  // Gắn sự kiện cho 2 nút "Login as"
  document.getElementById('customer-btn').addEventListener('click', function(){ setActive('customer-btn'); });
  document.getElementById('bank-btn').addEventListener('click', function(){ setActive('bank-btn'); });

  // 2. Hàm xử lý responsive
  function adjustCardHeight(){
    const card = document.querySelector('.login-card');
    if(window.innerWidth < 420) card.style.padding = '18px';
    else card.style.padding = '';
  }
  window.addEventListener('resize', adjustCardHeight);
  adjustCardHeight();

  // 3. Hàm hiển thị lỗi
  function showLoginError(message) {
    const errorDiv = document.getElementById('login-error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
  }

  // 4. Ẩn thông báo lỗi khi người dùng gõ phím
  document.querySelectorAll('.input').forEach(input => {
    input.addEventListener('input', () => {
      document.getElementById('login-error').style.display = 'none';
    });
  });

  // 5. Xử lý submit form
  document.getElementById('main-login-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const loginButton = this.querySelector('.login-btn');
    loginButton.disabled = true;
    loginButton.textContent = 'LOGGING IN...';

    const username = this.querySelector('input[type="text"]').value.trim();
    const password = this.querySelector('input[type="password"]').value.trim();
    const role = document.getElementById('loginRole').value;
    const rememberMe = document.getElementById('remember-me').checked;

    // ✅ Chọn endpoint tùy theo role
    const endpoint = role === 'bank_user' 
      ? '/api/bank/auth/login' 
      : '/api/auth/login';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role, remember: rememberMe })
      });

      const result = await response.json();
      console.log('Login response:', result);

      if (!response.ok) {
        showLoginError(result.error || 'Sai tên đăng nhập hoặc mật khẩu.');
        return;
      }

      if (result.token) {
        localStorage.setItem('authToken', result.token);

        if (result.profileId) {
          sessionStorage.setItem('profileId', result.profileId);
        }

        if (window.showNotification) {
          showNotification('Đăng nhập thành công! Chuyển hướng...', 'success');
        } else {
          console.log('Đăng nhập thành công! Chuyển hướng...');
        }

        // --- CHỈNH SỬA PHẦN REDIRECT THEO ROLE ---
        if (role === 'bank_user') {
          window.location.href = ChronosAccess.returnAfterLogin('bankdashboard.html');
        } else {
          window.location.href = ChronosAccess.returnAfterLogin('dashboard.html');
        }

      } else {
        showLoginError('Không nhận được token từ server.');
      }

    } catch (error) {
      console.error('Lỗi kết nối:', error);
      showLoginError('Không thể kết nối đến máy chủ.');
    } finally {
      loginButton.disabled = false;
      loginButton.textContent = 'LOGIN';
    }
  });
});
