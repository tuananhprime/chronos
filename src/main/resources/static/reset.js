// reset.js
document.addEventListener('DOMContentLoaded', function() {
  const errorDiv = document.getElementById('error');
  const successDiv = document.getElementById('success');
  const form = document.getElementById('resetForm');
  const pwd = document.getElementById('password');
  const confirmPwd = document.getElementById('confirmPassword');
  const resetBtn = document.getElementById('resetBtn');


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


  // Retrieve username & email from query (if needed)
  const params = new URLSearchParams(window.location.search);
  const username = params.get('username') || '';
  const email = params.get('email') || '';


  // Optional: you can use username/email to prefill or show small hint (not required)
  // Example (commented): document.querySelector('.small-note')?.textContent = `Resetting for ${username}`;


  [pwd, confirmPwd].forEach(i => i.addEventListener('input', () => {
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';
  }));


  form.addEventListener('submit', function(e) {
    e.preventDefault();


    const password = pwd.value.trim();
    const confirm = confirmPwd.value.trim();


    if (!password || !confirm) { showError('Please fill out both fields.'); return; }
    if (password !== confirm) { showError('Passwords do not match.'); return; }
    if (password.length < 8) { showError('Password must be at least 8 characters.'); return; }


    resetBtn.disabled = true;
    resetBtn.textContent = 'Processing...';


    // No backend call by your request — client-side success & redirect to main login
    showSuccess('Password changed successfully. Redirecting to login...');


    setTimeout(() => {
      window.location.href = 'login.html';
    }, 800);
  });
});

