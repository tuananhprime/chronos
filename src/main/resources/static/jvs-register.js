document.addEventListener('DOMContentLoaded', function() {

  const form = document.getElementById("signupForm");

  form.addEventListener("submit", async function(e) {
    e.preventDefault();

    // Clear error messages
    document.querySelectorAll('.error-message').forEach(el => {
      el.textContent = '';
      el.style.display = 'none';
    });

    // --- Collect form data ---
    const data = {
      username: document.getElementById("username").value.trim(),
      email: document.getElementById("email").value.trim(),
      password: document.getElementById("password").value.trim(),
      role: "Customer", // hoặc lấy từ input hidden nếu có
      businessName: document.getElementById("business").value.trim(),
      taxId: document.getElementById("taxid").value.trim()
    };

    // --- Basic frontend validation ---
    let isValid = true;
    function showError(id, msg) { 
      document.getElementById(id).textContent = msg; 
      document.getElementById(id).style.display = 'block';
      isValid = false;
    }

    if (!data.email) showError("emailError", "Email is required.");
    else if (!/^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(data.email)) showError("emailError", "Invalid email.");
    if (!data.username) showError("usernameError", "Username is required.");
    if (!data.password) showError("passwordError", "Password is required.");
    else if (data.password.length < 6) showError("passwordError", "Password must be at least 6 characters.");
    if (!data.businessName) showError("businessError", "Business name is required.");

    if (!isValid) return;

    // --- Call backend API ---
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await response.text(); // AuthController trả String

      if (response.ok) {
        alert("Đăng ký thành công");
        form.reset();
        // === Thêm phần chuyển hướng sau khi đăng ký thành công ===
        window.location.href = "login.html";
      } else {
        alert("Error: " + result);
      }

    } catch (err) {
      console.error(err);
      alert("Cannot connect to server.");
    }
  });
});
