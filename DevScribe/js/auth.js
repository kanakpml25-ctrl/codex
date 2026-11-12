/**
 * Kanak's DevChronicle - Auth Logic (auth.js)
 * Author Authentication, Dynamic Password Strength Meter, and Session Persistence.
 */

document.addEventListener("DOMContentLoaded", () => {
  setupPasswordToggles();
  setupLoginForm();
  setupRegisterForm();
  setupPasswordStrengthMeter();
});

function setupPasswordToggles() {
  document.querySelectorAll(".toggle-password-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      const input = document.getElementById(targetId);
      if (!input) return;

      if (input.type === "password") {
        input.type = "text";
        btn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
          </svg>`;
      } else {
        input.type = "password";
        btn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>`;
      }
    });
  });
}

function fillKanakCredentials() {
  const email = document.getElementById("login-email");
  const pwd = document.getElementById("login-password");
  if (email && pwd) {
    email.value = "kanak@devchronicle.io";
    pwd.value = "password123";
    showToast("Filled Kanak's author credentials! Click 'Sign In'.", "info");
  }
}

function setupLoginForm() {
  const form = document.getElementById("login-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const pwd = document.getElementById("login-password").value;

    if (!isValidEmail(email)) {
      showError("login-email-group", "Please enter a valid email address.");
      return;
    } else {
      clearError("login-email-group");
    }

    if (pwd.length < 6) {
      showError("login-password-group", "Password must be at least 6 characters.");
      return;
    } else {
      clearError("login-password-group");
    }

    const user = Storage.getUser();
    showToast(`Welcome back, ${user.name}! Accessing DevChronicle...`, "success");
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 700);
  });
}

function setupRegisterForm() {
  const form = document.getElementById("register-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("reg-name").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const pwd = document.getElementById("reg-password").value;
    const confirm = document.getElementById("reg-confirm-password").value;

    let hasError = false;

    if (name.length < 2) {
      showError("reg-name-group", "Please enter your full name.");
      hasError = true;
    } else {
      clearError("reg-name-group");
    }

    if (!isValidEmail(email)) {
      showError("reg-email-group", "Please enter a valid email.");
      hasError = true;
    } else {
      clearError("reg-email-group");
    }

    if (pwd.length < 6) {
      showError("reg-password-group", "Password must be at least 6 characters.");
      hasError = true;
    } else {
      clearError("reg-password-group");
    }

    if (pwd !== confirm) {
      showError("reg-confirm-group", "Passwords do not match.");
      hasError = true;
    } else {
      clearError("reg-confirm-group");
    }

    if (hasError) return;

    const newUser = {
      ...KANAK_USER,
      name: name,
      email: email,
      handle: "@" + name.toLowerCase().replace(/\s+/g, "_")
    };

    Storage.saveUser(newUser);
    showToast(`Account created for ${name}! Welcome to the journal.`, "success");
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 750);
  });
}

function setupPasswordStrengthMeter() {
  const pwdInput = document.getElementById("reg-password");
  if (!pwdInput) return;

  const seg1 = document.getElementById("strength-seg-1");
  const seg2 = document.getElementById("strength-seg-2");
  const seg3 = document.getElementById("strength-seg-3");
  const seg4 = document.getElementById("strength-seg-4");
  const label = document.getElementById("strength-label");

  pwdInput.addEventListener("input", () => {
    const val = pwdInput.value;
    let score = 0;
    if (val.length >= 6) score++;
    if (val.length >= 10) score++;
    if (/[0-9]/.test(val) && /[a-zA-Z]/.test(val)) score++;
    if (/[^a-zA-Z0-9]/.test(val)) score++;

    [seg1, seg2, seg3, seg4].forEach((s) => {
      if (s) s.className = "strength-segment";
    });

    if (!val) {
      if (label) label.textContent = "Enter password";
      return;
    }

    if (score === 1 && seg1) {
      seg1.classList.add("active-weak");
      if (label) label.textContent = "Weak password";
    } else if (score === 2) {
      if (seg1) seg1.classList.add("active-fair");
      if (seg2) seg2.classList.add("active-fair");
      if (label) label.textContent = "Fair security";
    } else if (score === 3) {
      if (seg1) seg1.classList.add("active-good");
      if (seg2) seg2.classList.add("active-good");
      if (seg3) seg3.classList.add("active-good");
      if (label) label.textContent = "Good security";
    } else if (score >= 4) {
      if (seg1) seg1.classList.add("active-strong");
      if (seg2) seg2.classList.add("active-strong");
      if (seg3) seg3.classList.add("active-strong");
      if (seg4) seg4.classList.add("active-strong");
      if (label) label.textContent = "Excellent security";
    }
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(groupId, msg) {
  const el = document.getElementById(groupId);
  if (!el) return;
  el.classList.add("has-error");
  const err = el.querySelector(".form-error");
  if (err) {
    err.textContent = msg;
    err.style.display = "block";
  }
}

function clearError(groupId) {
  const el = document.getElementById(groupId);
  if (!el) return;
  el.classList.remove("has-error");
  const err = el.querySelector(".form-error");
  if (err) {
    err.textContent = "";
    err.style.display = "none";
  }
}
