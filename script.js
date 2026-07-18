'use strict';

/* =====================================================
   Lumen — Login Page Script
   Vanilla JS: validation, password visibility toggle,
   ripple effect, and the loading/success button sequence.
   No external libraries, no backend — the login flow and
   social buttons are simulated for demo purposes.
   ===================================================== */

/* ---------- Validation helpers (pure, reusable) ---------- */

function isValidEmail(value) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(value);
}

function showFieldError(inputEl, errorEl, message) {
  inputEl.classList.add('is-invalid');
  errorEl.textContent = message;
  errorEl.classList.add('show');

  // Restart the shake animation even if the same field errors twice in a row
  inputEl.style.animation = 'none';
  void inputEl.offsetWidth; // force a reflow so the animation replays
  inputEl.style.animation = '';
}

function clearFieldError(inputEl, errorEl) {
  inputEl.classList.remove('is-invalid');
  errorEl.textContent = '';
  errorEl.classList.remove('show');
}

function validateIdentifier(inputEl, errorEl) {
  const value = inputEl.value.trim();

  if (value === '') {
    showFieldError(inputEl, errorEl, 'Enter your username, email or phone');
    return false;
  }
  // Only enforce email formatting if the input actually looks like an email attempt
  if (value.includes('@') && !isValidEmail(value)) {
    showFieldError(inputEl, errorEl, 'Enter a valid email address');
    return false;
  }
  if (value.length < 3) {
    showFieldError(inputEl, errorEl, 'Enter at least 3 characters');
    return false;
  }

  clearFieldError(inputEl, errorEl);
  return true;
}

function validatePassword(inputEl, errorEl) {
  const value = inputEl.value;

  if (value === '') {
    showFieldError(inputEl, errorEl, 'Enter your password');
    return false;
  }
  if (value.length < 6) {
    showFieldError(inputEl, errorEl, 'Use at least 6 characters');
    return false;
  }

  clearFieldError(inputEl, errorEl);
  return true;
}

/* ---------- Ripple effect — reusable on any .btn ---------- */

function createRipple(event, button) {
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const ripple = document.createElement('span');

  ripple.className = 'ripple';
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${event.clientY - rect.top - size / 2}px`;

  button.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
}

/* ---------- Toast notifications ---------- */

let toastTimer = null;

function showToast(toastEl, message, type) {
  toastEl.textContent = message;
  toastEl.className = 'toast show' + (type ? ' toast-' + type : '');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3000);
}

/* =====================================================
   Bootstrap — runs once the DOM is ready
   ===================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const identifierInput = document.getElementById('identifier');
  const passwordInput = document.getElementById('password');
  const identifierError = document.getElementById('identifierError');
  const passwordError = document.getElementById('passwordError');
  const toggleBtn = document.getElementById('togglePassword');
  const loginBtn = document.getElementById('loginBtn');
  const googleBtn = document.getElementById('googleBtn');
  const facebookBtn = document.getElementById('facebookBtn');
  const toast = document.getElementById('toast');

  /* Password show / hide */
  toggleBtn.addEventListener('click', () => {
    const revealing = passwordInput.type === 'password';
    passwordInput.type = revealing ? 'text' : 'password';
    toggleBtn.classList.toggle('is-active', revealing);
    toggleBtn.setAttribute('aria-label', revealing ? 'Hide password' : 'Show password');
    passwordInput.focus();
  });

  /* Clear a field's error as soon as the user starts correcting it */
  identifierInput.addEventListener('input', () => clearFieldError(identifierInput, identifierError));
  passwordInput.addEventListener('input', () => clearFieldError(passwordInput, passwordError));

  /* Ripple feedback on every button */
  [loginBtn, googleBtn, facebookBtn].forEach((btn) => {
    btn.addEventListener('click', (event) => createRipple(event, btn));
  });

  /* Validate, then simulate a login request */
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const identifierValid = validateIdentifier(identifierInput, identifierError);
    const passwordValid = validatePassword(passwordInput, passwordError);

    if (!identifierValid || !passwordValid) {
      showToast(toast, 'Check the highlighted fields', 'error');
      return;
    }

    runLoginSequence();
  });

  function runLoginSequence() {
    loginBtn.classList.add('is-loading');
    loginBtn.disabled = true;

    // Simulated network delay — replace with a real fetch() call once a backend is wired up
    setTimeout(() => {
      loginBtn.classList.remove('is-loading');
      loginBtn.classList.add('is-success');
      showToast(toast, 'Welcome back!', 'success');

      setTimeout(() => {
        loginBtn.classList.remove('is-success');
        loginBtn.disabled = false;
        form.reset();
        identifierInput.blur();
        passwordInput.blur();
      }, 1800);
    }, 1600);
  }

  /* Social sign-in — placeholders until real OAuth is connected */
  googleBtn.addEventListener('click', () => showToast(toast, 'Google sign-in coming soon'));
  facebookBtn.addEventListener('click', () => showToast(toast, 'Facebook sign-in coming soon'));
});
