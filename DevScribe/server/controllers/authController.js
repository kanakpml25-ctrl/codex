const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'devscribe_kanak_super_secret_jwt_key_2026_secure';

// Helper to generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Strict Email Validator
const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email.trim());
};

// Strict Password Validator:
// - At least 8 characters
// - At least 1 uppercase letter
// - At least 1 lowercase letter
// - At least 1 digit
// - At least 1 special character
const validatePasswordStrength = (password) => {
  if (!password || typeof password !== 'string') {
    return { valid: false, message: 'Password is required.' };
  }
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter (A-Z).' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter (a-z).' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number (0-9).' };
  }
  if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?~`]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special symbol (!@#$%^&* etc.).' };
  }
  return { valid: true };
};

// Generate modern SVG initials avatar data URI if no photo uploaded
const generateInitialsAvatar = (name) => {
  const initials = (name || 'DS')
    .split(' ')
    .filter(Boolean)
    .map(p => p[0].toUpperCase())
    .slice(0, 2)
    .join('');
  const colors = [
    ['#059669', '#10b981'],
    ['#2563eb', '#38bdf8'],
    ['#7c3aed', '#a855f7'],
    ['#ea580c', '#f59e0b'],
    ['#0d9488', '#14b8a6']
  ];
  const charCode = initials.charCodeAt(0) || 0;
  const [bg1, bg2] = colors[charCode % colors.length];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${bg1}"/><stop offset="100%" stop-color="${bg2}"/></linearGradient></defs><rect width="100" height="100" rx="50" fill="url(#g)"/><text x="50" y="58" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="38" font-weight="700" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">${initials}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

// In-Memory OTP Store: email -> { otp, expiresAt, name, email, avatar }
const otpStore = new Map();

/**
 * @route   POST /api/auth/send-otp
 * @desc    Generate and dispatch a 6-digit OTP verification code for registration
 * @access  Public
 */
const sendOtp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validate Name
    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Full Name must be at least 2 characters long.'
      });
    }

    // 2. Validate Email
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address (e.g. user@example.com).'
      });
    }

    // 3. Validate Password Strength upfront
    const pwdCheck = validatePasswordStrength(password);
    if (!pwdCheck.valid) {
      return res.status(400).json({
        success: false,
        message: pwdCheck.message
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 4. Check if user already exists
    const existing = db.findUserByEmail(cleanEmail);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please sign in instead.'
      });
    }

    // 5. Generate 6-Digit Numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    // Save to OTP cache
    otpStore.set(cleanEmail, {
      otp,
      expiresAt,
      name: name.trim(),
      email: cleanEmail
    });

    console.log(`=======================================================`);
    console.log(`[DevScribe Security] 🔐 OTP Verification Code for: ${cleanEmail}`);
    console.log(`[DevScribe Security] 🔑 Code: ${otp} (Valid for 10 minutes)`);
    console.log(`=======================================================`);

    return res.status(200).json({
      success: true,
      message: `A 6-digit verification code was generated for ${cleanEmail}.`,
      otp: otp, // Returned for dev & local evaluation preview
      expiresInSeconds: 600
    });
  } catch (err) {
    console.error('Send OTP Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate verification code.'
    });
  }
};

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify 6-digit OTP, validate registration, and create user account
 * @access  Public
 */
const verifyOtp = async (req, res) => {
  try {
    const { name, email, password, otp, avatar, bio } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and verification code (OTP) are required.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.toString().trim();

    // 1. Check OTP in store
    const record = otpStore.get(cleanEmail);
    if (!record) {
      return res.status(400).json({
        success: false,
        message: 'No active verification code found for this email. Please request a new code.'
      });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(cleanEmail);
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please request a new code.'
      });
    }

    if (record.otp !== cleanOtp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code. Please check and try again.'
      });
    }

    // 2. Validate Password
    const pwdCheck = validatePasswordStrength(password);
    if (!pwdCheck.valid) {
      return res.status(400).json({
        success: false,
        message: pwdCheck.message
      });
    }

    // 3. Double-check duplicate email
    if (db.findUserByEmail(cleanEmail)) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.'
      });
    }

    // 4. Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const cleanName = (name && name.trim()) || record.name || 'Author';
    
    // 5. Determine Profile DP (Avatar)
    // If user provided custom avatar (uploaded base64 or custom image), use it.
    // Otherwise generate clean initials avatar.
    const userAvatar = (avatar && avatar.trim()) ? avatar.trim() : generateInitialsAvatar(cleanName);

    const newUser = {
      id: 'user-' + Date.now(),
      name: cleanName,
      email: cleanEmail,
      passwordHash: passwordHash,
      handle: '@' + cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      bio: (bio && bio.trim()) || 'Author on DevScribe.',
      avatar: userAvatar,
      isVerified: true,
      role: 'Author',
      createdAt: new Date().toISOString()
    };

    db.createUser(newUser);

    // Delete used OTP
    otpStore.delete(cleanEmail);

    // Generate JWT token
    const token = generateToken(newUser);
    const { passwordHash: _, ...safeUser } = newUser;

    return res.status(201).json({
      success: true,
      message: 'Account successfully verified and created! Welcome to DevScribe.',
      user: safeUser,
      token: token
    });
  } catch (err) {
    console.error('Verify OTP Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during account verification.'
    });
  }
};

/**
 * @route   POST /api/auth/register
 * @desc    Direct registration endpoint (also supports custom DP and strict validations)
 * @access  Public
 */
const register = async (req, res) => {
  try {
    const { name, email, password, avatar, bio } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Full Name must be at least 2 characters long.'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address (e.g. user@example.com).'
      });
    }

    const pwdCheck = validatePasswordStrength(password);
    if (!pwdCheck.valid) {
      return res.status(400).json({
        success: false,
        message: pwdCheck.message
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existingUser = db.findUserByEmail(cleanEmail);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const cleanName = name.trim();
    const userAvatar = (avatar && avatar.trim()) ? avatar.trim() : generateInitialsAvatar(cleanName);

    const newUser = {
      id: 'user-' + Date.now(),
      name: cleanName,
      email: cleanEmail,
      passwordHash: passwordHash,
      handle: '@' + cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      bio: (bio && bio.trim()) || 'Author on DevScribe.',
      avatar: userAvatar,
      isVerified: true,
      role: 'Author',
      createdAt: new Date().toISOString()
    };

    db.createUser(newUser);

    const token = generateToken(newUser);
    const { passwordHash: _, ...safeUser } = newUser;

    return res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      user: safeUser,
      token: token
    });
  } catch (err) {
    console.error('Registration Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during registration.'
    });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user with email and password
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address format.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = db.findUserByEmail(cleanEmail);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'No account found with this email. Please check your email or register.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password. Please try again.'
      });
    }

    const token = generateToken(user);
    const { passwordHash: _, ...safeUser } = user;

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      user: safeUser,
      token: token
    });
  } catch (err) {
    console.error('Login Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during login.'
    });
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get currently authenticated user
 * @access  Private
 */
const getMe = (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user
  });
};

module.exports = {
  sendOtp,
  verifyOtp,
  register,
  login,
  getMe
};
