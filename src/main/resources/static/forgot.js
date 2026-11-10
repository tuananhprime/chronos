// forgot.js
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('forgotForm');
  const usernameInput = document.getElementById('username');
  const emailInput = document.getElementById('email');
  const errorDiv = document.getElementById('error');
  const successDiv = document.getElementById('success');
  const continueBtn = document.getElementById('continueBtn');


  function showError(msg){
    errorDiv.textContent = msg;
    errorDiv.style.display = 'block';
    successDiv.style.display = 'none';
  }
  function showSuccess(msg){
    successDiv.textContent = msg;
    successDiv.style.display = 'block';
    errorDiv.style.display = 'none';
  }


  [usernameInput, emailInput].forEach(i => i.addEventListener('input', () => {
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';
  }));


  form.addEventListener('submit', function(e) {
    e.preventDefault();


    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();


    if (!username) { showError('Please enter your username.'); return; }
    if (!email) { showError('Please enter your email.'); return; }
    const emailRe = /\S+@\S+\.\S+/;
    if (!emailRe.test(email)) { showError('Invalid email address.'); return; }


    continueBtn.disabled = true;
    continueBtn.textContent = 'Continuing...';


    // === SỬA LỖI Ở ĐÂY ===
    // Thêm dấu backtick (`) để tạo chuỗi query
    const q = `?username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}`;
   
    // small delay so user sees button feedback
    setTimeout(() => {
      // Thêm dấu backtick (`) để nối chuỗi và biến
      window.location.href = `reset.html${q}`;
    }, 300);
    // === KẾT THÚC SỬA LỖI ===
  });
});

