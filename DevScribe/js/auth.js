/**
 * DevScribe by Kanak - Auth Logic (auth.js)
 * Strict Email & Password Validation, Avatar/DP Selection, 6-Digit OTP Verification,
 * and Zero-Crash Offline Local Simulation with clear diagnostic error reporting.
 */

let pendingRegistration = null;
let currentSelectedAvatar = null;
let resendTimerInterval = null;

document.addEventListener("DOMContentLoaded", () => {
  setupPasswordToggles();
  setupPasswordStrengthMeter();
  setupAvatarPicker();
  setupRegisterForm();
  setupOtpInputs();
  setupLoginForm();
});

// ============================================================================
// 1. Password Visibility Toggle
// ============================================================================
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

// Strict Email Regex: user@domain.com
function isValidEmail(email) {
  if (!email) return false;
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email.trim());
}

// ============================================================================
// 2. Strict Password Validation & Live Checklist
// ============================================================================
function setupPasswordStrengthMeter() {
  const pwdInput = document.getElementById("reg-password");
  if (!pwdInput) return;

  pwdInput.addEventListener("input", () => {
    const val = pwdInput.value;

    const hasLen = val.length >= 8;
    const hasUpper = /[A-Z]/.test(val);
    const hasLower = /[a-z]/.test(val);
    const hasNum = /[0-9]/.test(val);
    const hasSym = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?~`]/.test(val);

    updateReqItem("req-length", hasLen);
    updateReqItem("req-upper", hasUpper);
    updateReqItem("req-lower", hasLower);
    updateReqItem("req-number", hasNum);
    updateReqItem("req-symbol", hasSym);

    // Calculate score (0-4)
    let score = 0;
    if (val.length >= 6) score++;
    if (hasLen && (hasUpper || hasLower)) score++;
    if (hasNum && (hasUpper && hasLower)) score++;
    if (hasLen && hasUpper && hasLower && hasNum && hasSym) score++;

    updateStrengthSegments(score, val.length > 0);
  });
}

function updateReqItem(id, satisfied) {
  const el = document.getElementById(id);
  if (!el) return;
  if (satisfied) {
    el.classList.add("satisfied");
    el.querySelector(".check-icon").innerHTML = "&#10003;"; // checkmark
  } else {
    el.classList.remove("satisfied");
    el.querySelector(".check-icon").innerHTML = "&#9675;"; // circle
  }
}

function updateStrengthSegments(score, hasInput) {
  const segs = [
    document.getElementById("strength-seg-1"),
    document.getElementById("strength-seg-2"),
    document.getElementById("strength-seg-3"),
    document.getElementById("strength-seg-4")
  ];
  const label = document.getElementById("strength-label");

  segs.forEach((s) => {
    if (s) s.className = "strength-segment";
  });

  if (!hasInput) {
    if (label) label.textContent = "Enter password";
    return;
  }

  const classes = ["active-weak", "active-fair", "active-good", "active-strong"];
  const texts = ["Weak", "Fair", "Good", "Strong & Secure ✓"];

  for (let i = 0; i < score; i++) {
    if (segs[i]) segs[i].classList.add(classes[score - 1]);
  }

  if (label) label.textContent = texts[Math.max(0, score - 1)];
}

// ============================================================================
// 3. Profile DP Picker (Custom Upload or Initials Preview)
// ============================================================================
function setupAvatarPicker() {
  const fileInput = document.getElementById("reg-avatar-file");
  const previewImg = document.getElementById("avatar-preview-img");
  const placeholder = document.getElementById("avatar-preview-placeholder");
  const filenameLabel = document.getElementById("avatar-filename-label");
  const nameInput = document.getElementById("reg-name");

  if (fileInput) {
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        showToast("Please choose an image file (PNG, JPG, WebP).", "error");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        showToast("Please select an image smaller than 5MB.", "error");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        currentSelectedAvatar = event.target.result;
        if (previewImg) {
          previewImg.src = currentSelectedAvatar;
          previewImg.style.display = "block";
        }
        if (placeholder) placeholder.style.display = "none";
        if (filenameLabel) filenameLabel.textContent = `Selected: ${file.name}`;
        showToast("Profile photo loaded! ✓", "success");
      };
      reader.readAsDataURL(file);
    });
  }

  // If user hasn't selected an image, show initials as they type name
  if (nameInput) {
    nameInput.addEventListener("input", () => {
      if (!currentSelectedAvatar && placeholder) {
        const initials = nameInput.value
          .trim()
          .split(" ")
          .filter(Boolean)
          .map((p) => p[0].toUpperCase())
          .slice(0, 2)
          .join("");
        placeholder.textContent = initials || "👤";
      }
    });
  }
}

// ============================================================================
// 4. Step 1: User Registration Form (Requests 6-Digit OTP)
// ============================================================================
function setupRegisterForm() {
  const form = document.getElementById("register-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("reg-name").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const pwd = document.getElementById("reg-password").value;
    const confirm = document.getElementById("reg-confirm-password").value;

    let hasError = false;

    // 1. Name Check
    if (name.length < 2) {
      showError("reg-name-group", "Please enter your full name (at least 2 characters).");
      hasError = true;
    } else {
      clearError("reg-name-group");
    }

    // 2. Strict Email Check
    if (!isValidEmail(email)) {
      showError("reg-email-group", "Invalid email format. Please use format: name@domain.com");
      hasError = true;
    } else {
      clearError("reg-email-group");
    }

    // 3. Strict Password Requirements
    const hasLen = pwd.length >= 8;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNum = /[0-9]/.test(pwd);
    const hasSym = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?~`]/.test(pwd);

    if (!hasLen || !hasUpper || !hasLower || !hasNum || !hasSym) {
      showError("reg-password-group", "Password must satisfy all 5 requirements listed below.");
      hasError = true;
    } else {
      clearError("reg-password-group");
    }

    // 4. Confirm Password Check
    if (pwd !== confirm) {
      showError("reg-confirm-group", "Passwords do not match.");
      hasError = true;
    } else {
      clearError("reg-confirm-group");
    }

    if (hasError) return;

    const btn = document.getElementById("btn-request-otp");
    btn.disabled = true;
    btn.innerHTML = `<span>Connecting to Server...</span>`;

    try {
      // 1. Attempt sending OTP via Node.js Express Backend
      const result = await Api.sendOtp(name, email, pwd);

      if (result.success) {
        pendingRegistration = {
          name,
          email,
          password: pwd,
          avatar: currentSelectedAvatar,
          isLocal: false
        };

        switchToOtpStep(email, result.otp, false);
      }
    } catch (err) {
      console.warn("Backend API request status:", err.message);

      // Check if server is offline (Failed to fetch)
      if (err.isOffline || err.message.includes("not reach") || err.message.includes("Failed to fetch") || err.message.includes("offline")) {
        // Fallback gracefully to Local Simulation Mode:
        // Generate random 6-digit OTP locally so user is NEVER blocked!
        const localOtp = Math.floor(100000 + Math.random() * 900000).toString();

        pendingRegistration = {
          name,
          email,
          password: pwd,
          avatar: currentSelectedAvatar,
          localOtp: localOtp,
          isLocal: true
        };

        switchToOtpStep(email, localOtp, true);

        showToast(
          "ℹ️ Node server is offline. Switched to Local Simulation Mode so you can register & test smoothly!",
          "info",
          5000
        );
      } else {
        // Actual server error (e.g. duplicate email)
        showError("reg-email-group", err.message);
        showToast(err.message, "error", 4000);
      }
    } finally {
      btn.disabled = false;
      btn.innerHTML = `<span>Send OTP Verification Code &rarr;</span>`;
    }
  });
}

function switchToOtpStep(email, otpCode, isLocalMode) {
  document.getElementById("step-1-panel").style.display = "none";
  const otpPanel = document.getElementById("step-2-otp");
  otpPanel.classList.add("active");

  document.getElementById("otp-display-email").textContent = email;

  const devBadge = document.getElementById("dev-otp-code");
  const badgeWrap = document.getElementById("otp-dev-badge");

  if (devBadge && otpCode) {
    devBadge.textContent = otpCode;
  }

  if (isLocalMode && badgeWrap) {
    badgeWrap.title = "Local Mode Active (Node server not started). Click to fill code.";
  }

  // Auto-focus first digit
  setTimeout(() => {
    const digit1 = document.getElementById("otp-digit-1");
    if (digit1) digit1.focus();
  }, 100);

  startResendTimer(60);
}

// ============================================================================
// 5. Step 2: 6-Digit OTP Verification Inputs & Submission
// ============================================================================
function setupOtpInputs() {
  const digits = [1, 2, 3, 4, 5, 6].map((i) => document.getElementById(`otp-digit-${i}`));
  if (!digits[0]) return;

  digits.forEach((input, index) => {
    input.addEventListener("input", (e) => {
      const val = e.target.value.replace(/[^0-9]/g, "");
      e.target.value = val ? val[val.length - 1] : "";

      if (e.target.value && index < 5) {
        digits[index + 1].focus();
      }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !input.value && index > 0) {
        digits[index - 1].focus();
      }
    });

    // Paste support
    input.addEventListener("paste", (e) => {
      e.preventDefault();
      const paste = (e.clipboardData || window.clipboardData).getData("text").replace(/[^0-9]/g, "");
      if (paste.length >= 6) {
        for (let i = 0; i < 6; i++) {
          digits[i].value = paste[i];
        }
        digits[5].focus();
      }
    });
  });

  const otpForm = document.getElementById("otp-form");
  if (!otpForm) return;

  otpForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!pendingRegistration) {
      showToast("Registration session expired. Please start over.", "error");
      returnToStep1();
      return;
    }

    const otpCode = digits.map((d) => d.value).join("");

    if (otpCode.length !== 6) {
      showError("otp-group", "Please enter all 6 digits of the verification code.");
      return;
    } else {
      clearError("otp-group");
    }

    const verifyBtn = document.getElementById("btn-verify-otp");
    verifyBtn.disabled = true;
    verifyBtn.innerHTML = `<span>Verifying Code...</span>`;

    try {
      if (pendingRegistration.isLocal) {
        // Local mode verification:
        if (otpCode !== pendingRegistration.localOtp) {
          showError("otp-group", "Incorrect verification code. Please enter the code shown above.");
          showToast("Incorrect OTP code. Try again.", "error");
          verifyBtn.disabled = false;
          verifyBtn.innerHTML = `<span>Verify OTP &amp; Create Profile &rarr;</span>`;
          return;
        }

        // Generate clean initials avatar if no photo uploaded
        const initials = pendingRegistration.name
          .trim()
          .split(" ")
          .filter(Boolean)
          .map((p) => p[0].toUpperCase())
          .slice(0, 2)
        const svgRaw = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#059669"/><stop offset="100%" stop-color="#10b981"/></linearGradient></defs><rect width="100" height="100" rx="50" fill="url(#g)"/><text x="50" y="58" font-family="sans-serif" font-size="38" font-weight="700" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">${initials || "DS"}</text></svg>`;
        const defaultAvatar = `data:image/svg+xml;utf8,${encodeURIComponent(svgRaw)}`;

        const registeredUser = {
          id: "user-" + Date.now(),
          name: pendingRegistration.name,
          email: pendingRegistration.email,
          handle: "@" + pendingRegistration.name.toLowerCase().replace(/[^a-z0-9]/g, "_"),
          bio: "Author on DevScribe.",
          avatar: pendingRegistration.avatar || defaultAvatar,
          role: "Author",
          isVerified: true
        };

        Storage.saveUser(registeredUser);
        showToast(`Email verified! Welcome to DevScribe, ${registeredUser.name}! 🎉`, "success", 2500);

        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 900);
      } else {
        // Live Backend API verification:
        const result = await Api.verifyOtp({
          name: pendingRegistration.name,
          email: pendingRegistration.email,
          password: pendingRegistration.password,
          avatar: pendingRegistration.avatar,
          otp: otpCode
        });

        if (result.success) {
          Storage.saveUser(result.user);
          showToast(`Email verified via Express API! Welcome, ${result.user.name}! 🎉`, "success", 2500);

          setTimeout(() => {
            window.location.href = "dashboard.html";
          }, 900);
        }
      }
    } catch (err) {
      console.warn("OTP Verification Failed:", err.message);
      showError("otp-group", err.message || "Invalid or expired verification code.");
      showToast(err.message || "Invalid OTP code.", "error");
      verifyBtn.disabled = false;
      verifyBtn.innerHTML = `<span>Verify OTP &amp; Create Profile &rarr;</span>`;
    }
  });
}

window.autofillDevOtp = function () {
  const badge = document.getElementById("dev-otp-code");
  if (!badge) return;
  const code = badge.textContent.trim();
  if (code && code.length === 6 && /^\d+$/.test(code)) {
    for (let i = 1; i <= 6; i++) {
      const box = document.getElementById(`otp-digit-${i}`);
      if (box) box.value = code[i - 1];
    }
    showToast("Autofilled verification code! Click 'Verify OTP'.", "info");
  }
};

window.returnToStep1 = function () {
  if (resendTimerInterval) clearInterval(resendTimerInterval);
  document.getElementById("step-2-otp").classList.remove("active");
  document.getElementById("step-1-panel").style.display = "block";
};

window.resendOtpCode = async function () {
  if (!pendingRegistration) return;

  if (pendingRegistration.isLocal) {
    const freshOtp = Math.floor(100000 + Math.random() * 900000).toString();
    pendingRegistration.localOtp = freshOtp;
    const devBadge = document.getElementById("dev-otp-code");
    if (devBadge) devBadge.textContent = freshOtp;
    startResendTimer(60);
    showToast("Fresh local verification code generated!", "info");
    return;
  }

  try {
    showToast("Requesting a fresh verification code from server...", "info");
    const result = await Api.sendOtp(
      pendingRegistration.name,
      pendingRegistration.email,
      pendingRegistration.password
    );
    if (result.success) {
      const devBadge = document.getElementById("dev-otp-code");
      if (devBadge && result.otp) devBadge.textContent = result.otp;
      startResendTimer(60);
      showToast("New verification code dispatched to email!", "success");
    }
  } catch (err) {
    showToast(err.message || "Failed to resend code.", "error");
  }
};

function startResendTimer(seconds) {
  if (resendTimerInterval) clearInterval(resendTimerInterval);
  let remaining = seconds;

  const countText = document.getElementById("resend-countdown-text");
  const timerSecs = document.getElementById("resend-timer-seconds");
  const resendBtn = document.getElementById("btn-resend-otp");

  if (countText) countText.style.display = "inline";
  if (resendBtn) resendBtn.style.display = "none";

  resendTimerInterval = setInterval(() => {
    remaining--;
    if (timerSecs) timerSecs.textContent = remaining;

    if (remaining <= 0) {
      clearInterval(resendTimerInterval);
      if (countText) countText.style.display = "none";
      if (resendBtn) resendBtn.style.display = "inline";
    }
  }, 1000);
}

// ============================================================================
// 6. User Login (Strict Email & Password, Connected to POST /api/auth/login)
// ============================================================================
function setupLoginForm() {
  const form = document.getElementById("login-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const pwd = document.getElementById("login-password").value;

    if (!isValidEmail(email)) {
      showError("login-email-group", "Please enter a valid email format (e.g. name@domain.com).");
      return;
    } else {
      clearError("login-email-group");
    }

    if (!pwd || pwd.length < 6) {
      showError("login-password-group", "Please enter your password.");
      return;
    } else {
      clearError("login-password-group");
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Signing In...</span>`;

    try {
      // 1. Call Node.js Backend API
      const result = await Api.login(email, pwd);

      if (result.success) {
        Storage.saveUser(result.user);
        showToast(`Welcome back, ${result.user.name}!`, "success");
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 750);
        return;
      }
    } catch (err) {
      console.warn("Login failed:", err.message);

      // Check if server is offline
      if (err.isOffline || err.message.includes("offline") || err.message.includes("not reach") || err.message.includes("Failed to fetch")) {
        // If server is offline, check if registered locally
        const localUser = Storage.getUser();
        if (localUser && localUser.email.toLowerCase() === email.toLowerCase()) {
          showToast(`Welcome back, ${localUser.name}! (Signed in via Local Session)`, "info");
          setTimeout(() => {
            window.location.href = "dashboard.html";
          }, 750);
          return;
        } else if (email.toLowerCase() === "kanak@devscribe.io" && pwd === "password123") {
          Storage.saveUser(KANAK_USER);
          showToast(`Welcome back, Kanak! (Demo Author Mode)`, "success");
          setTimeout(() => {
            window.location.href = "dashboard.html";
          }, 750);
          return;
        } else {
          showError(
            "login-password-group",
            "Node.js server is offline (http://localhost:5000). Double-click 'start.bat' or run 'npm start' to start the backend server."
          );
          showToast("Backend server is offline. Please run start.bat.", "error", 4000);
          return;
        }
      }

      showError("login-password-group", err.message || "Invalid email or password.");
      showToast(err.message || "Invalid email or password.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>Sign In to Dashboard &rarr;</span>`;
    }
  });
}

window.fillKanakCredentials = function () {
  const email = document.getElementById("login-email");
  const pwd = document.getElementById("login-password");
  if (email && pwd) {
    email.value = "kanak@devscribe.io";
    pwd.value = "password123";
    showToast("Filled Kanak's demo author credentials! Click 'Sign In'.", "info");
  }
};

// Error Display Helpers
function showError(groupId, message) {
  const group = document.getElementById(groupId);
  if (!group) return;
  group.classList.add("has-error");
  const errSpan = group.querySelector(".form-error");
  if (errSpan) errSpan.textContent = message;
}

function clearError(groupId) {
  const group = document.getElementById(groupId);
  if (!group) return;
  group.classList.remove("has-error");
  const errSpan = group.querySelector(".form-error");
  if (errSpan) errSpan.textContent = "";
}
