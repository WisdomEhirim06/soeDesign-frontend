// Handles login form and token storage and small helper to show admin UI
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        try {
          const data = await API.login({ username, password });
          if (data && data.access_token) {
            localStorage.setItem("sb_token", data.access_token);
            window.location.href = "announcements.html";
          } else {
            document.getElementById("loginMsg").textContent = "Login failed.";
          }
        } catch (err) {
          document.getElementById("loginMsg").textContent = err.message;
        }
      });
    }
  
    // Toggle login link to logout if token present
    const loginLink = document.getElementById("loginLink");
    if (loginLink) {
      const token = localStorage.getItem("sb_token");
      if (token) {
        loginLink.textContent = "Logout";
        loginLink.href = "#";
        loginLink.addEventListener("click", (e) => {
          e.preventDefault();
          localStorage.removeItem("sb_token");
          window.location.reload();
        });
      }
    }
  });
  