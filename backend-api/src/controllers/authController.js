const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const Otp = require('../models/OtpCode');
const { sendOtpEmail } = require('../utils/email');

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const BCRYPT_ROUNDS = 10;
const JWT_EXPIRES_IN = '30d';

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function normEmail(email) {
  return typeof email === 'string' ? email.trim().toLowerCase() : '';
}

function validEmail(email) {
  return EMAIL_RE.test(email) && email.length <= 255;
}

function validPassword(pw) {
  return typeof pw === 'string' && pw.length >= 8;
}

// Crypto-random, uniformly distributed 6-digit numeric string.
function generateOtp() {
  return String(crypto.randomInt(0, 1000000)).padStart(6, '0');
}

function signToken(userId) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    const err = new Error('Auth is not configured');
    err.noSecret = true;
    throw err;
  }
  return jwt.sign({ sub: String(userId) }, secret, { expiresIn: JWT_EXPIRES_IN });
}

// Reuse a still-valid OTP if one exists; otherwise mint + store a new one.
// Returns the code to email.
async function getOrCreateOtp(email, purpose) {
  const existing = await Otp.findValid(email, purpose);
  if (existing) return existing.code;
  const code = generateOtp();
  await Otp.create(email, code, purpose);
  return code;
}

// Send the OTP email but never let a delivery failure break the request —
// the OTP row is already persisted, so we just log a clear line and move on.
async function sendOtpSafely(email, code, purpose) {
  try {
    await sendOtpEmail(email, code, purpose);
  } catch (err) {
    console.error(`OTP EMAIL FAILED for ${email}: ${err.message}`);
  }
}

function fail(res, status, error) {
  return res.status(status).json({ error });
}

function serverError(res, err) {
  if (err && err.noSecret) return fail(res, 500, 'Auth is not configured');
  console.error('[auth] error:', err);
  return fail(res, 500, 'Internal server error');
}

/* ------------------------------------------------------------------ */
/* Handlers                                                           */
/* ------------------------------------------------------------------ */

async function signup(req, res) {
  try {
    const email = normEmail(req.body.email);
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : null;
    const password = req.body.password;

    if (!validEmail(email)) return fail(res, 400, 'A valid email is required');
    if (!validPassword(password)) return fail(res, 400, 'Password must be at least 8 characters');

    const existing = await User.findByEmail(email);
    if (existing && existing.email_verified) {
      return fail(res, 409, 'An account with that email already exists');
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    if (existing && !existing.email_verified) {
      // Unverified account re-submitting signup — refresh details + resend.
      await User.updateCredentials(existing.id, { name, passwordHash });
    } else {
      await User.create({ email, name, passwordHash });
    }

    const code = await getOrCreateOtp(email, 'signup');
    await sendOtpSafely(email, code, 'signup');

    return res.json({ message: 'OTP sent' });
  } catch (err) {
    return serverError(res, err);
  }
}

async function verifyOtp(req, res) {
  try {
    const email = normEmail(req.body.email);
    const code = typeof req.body.code === 'string' ? req.body.code.trim() : '';

    if (!validEmail(email)) return fail(res, 400, 'A valid email is required');
    if (!/^\d{6}$/.test(code)) return fail(res, 400, 'A 6-digit code is required');

    const otp = await Otp.findNewestUnconsumed(email, 'signup');
    if (!otp) return fail(res, 400, 'No verification code found — please sign up again');
    if (Otp.isExpired(otp)) return fail(res, 400, 'Code expired — request a new one');
    if (otp.code !== code) return fail(res, 400, 'Incorrect code');

    const user = await User.findByEmail(email);
    if (!user) return fail(res, 404, 'Account not found');

    await Otp.markConsumed(otp.id);
    await User.markVerified(user.id);

    const token = signToken(user.id);
    return res.json({ token, user: User.publicShape(user) });
  } catch (err) {
    return serverError(res, err);
  }
}

async function login(req, res) {
  try {
    const email = normEmail(req.body.email);
    const password = req.body.password;

    if (!validEmail(email)) return fail(res, 400, 'A valid email is required');
    if (typeof password !== 'string' || password.length === 0) {
      return fail(res, 400, 'Password is required');
    }

    const user = await User.findByEmail(email);
    if (!user || !user.password_hash) {
      return fail(res, 401, 'Invalid email or password');
    }
    if (!user.email_verified) {
      return fail(res, 403, 'Please verify your email before signing in');
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return fail(res, 401, 'Invalid email or password');

    const token = signToken(user.id);
    return res.json({ token, user: User.publicShape(user) });
  } catch (err) {
    return serverError(res, err);
  }
}

async function forgotPassword(req, res) {
  // Always returns the same message so we never leak which emails exist.
  const generic = { message: 'If that email exists, a code was sent' };
  try {
    const email = normEmail(req.body.email);
    if (!validEmail(email)) return res.json(generic);

    const user = await User.findByEmail(email);
    if (user) {
      const code = await getOrCreateOtp(email, 'reset');
      await sendOtpSafely(email, code, 'reset');
    }
    return res.json(generic);
  } catch (err) {
    return serverError(res, err);
  }
}

async function resetPassword(req, res) {
  try {
    const email = normEmail(req.body.email);
    const code = typeof req.body.code === 'string' ? req.body.code.trim() : '';
    const newPassword = req.body.newPassword;

    if (!validEmail(email)) return fail(res, 400, 'A valid email is required');
    if (!/^\d{6}$/.test(code)) return fail(res, 400, 'A 6-digit code is required');
    if (!validPassword(newPassword)) return fail(res, 400, 'Password must be at least 8 characters');

    const otp = await Otp.findNewestUnconsumed(email, 'reset');
    if (!otp) return fail(res, 400, 'No reset code found — request a new one');
    if (Otp.isExpired(otp)) return fail(res, 400, 'Code expired — request a new one');
    if (otp.code !== code) return fail(res, 400, 'Incorrect code');

    const user = await User.findByEmail(email);
    if (!user) return fail(res, 404, 'Account not found');

    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    await User.setPasswordHash(user.id, passwordHash);
    await Otp.markConsumed(otp.id);

    return res.json({ message: 'Password updated' });
  } catch (err) {
    return serverError(res, err);
  }
}

async function me(req, res) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return fail(res, 404, 'Account not found');
    return res.json({ user: User.publicShape(user) });
  } catch (err) {
    return serverError(res, err);
  }
}

/* ------------------------------------------------------------------ */
/* GitHub OAuth (backend-handled, because GitHub's registered callback */
/* is a backend URL). Flow: app opens the authorize URL → GitHub       */
/* redirects here with a code → we exchange it, find/create the user,  */
/* sign our JWT → redirect to the app's masterrn:// deep link.         */
/* ------------------------------------------------------------------ */

const GITHUB_APP_REDIRECT = 'masterrn://github-auth';

function githubRedirectUri() {
  return (
    process.env.GITHUB_REDIRECT_URI ||
    'https://api.masterreactnative.dev/api/auth/github/callback'
  );
}

// GET /api/auth/github/start — build the authorize URL server-side so the
// client id never ships in the app. Returns { url, state }.
function githubStart(req, res) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) return fail(res, 500, 'GitHub login is not configured');

  const state = crypto.randomBytes(16).toString('hex');
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: githubRedirectUri(),
    scope: 'read:user user:email',
    state,
    allow_signup: 'true',
  });
  return res.json({ url: `https://github.com/login/oauth/authorize?${params.toString()}`, state });
}

// GET /api/auth/github/callback — GitHub redirects here with ?code&state.
// On success → redirect masterrn://github-auth?token=<JWT>&state=…
// On any failure → redirect masterrn://github-auth?error=<message>&state=…
async function githubCallback(req, res) {
  const state = typeof req.query.state === 'string' ? req.query.state : '';
  const redirectApp = (extra) =>
    res.redirect(`${GITHUB_APP_REDIRECT}?${new URLSearchParams({ ...extra, state }).toString()}`);

  try {
    const code = typeof req.query.code === 'string' ? req.query.code : '';
    const denied = typeof req.query.error === 'string' ? req.query.error : '';
    if (denied || !code) {
      return redirectApp({ error: 'GitHub sign-in was cancelled' });
    }

    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      console.error('[auth] GitHub OAuth is not configured (missing client id/secret)');
      return redirectApp({ error: 'GitHub login is not configured' });
    }

    // 1. Exchange the code for a GitHub access token.
    const tokenResp = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: githubRedirectUri(),
      }),
    });
    const tokenJson = await tokenResp.json().catch(() => ({}));
    const accessToken = tokenJson && tokenJson.access_token;
    if (!accessToken) {
      console.error('[auth] GitHub token exchange failed:', tokenJson && tokenJson.error);
      return redirectApp({ error: 'Could not complete GitHub sign-in' });
    }

    const ghHeaders = {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'master-rn-backend', // GitHub requires a User-Agent.
    };

    // 2. Fetch the profile and the email list (for the primary verified email).
    const [profileResp, emailsResp] = await Promise.all([
      fetch('https://api.github.com/user', { headers: ghHeaders }),
      fetch('https://api.github.com/user/emails', { headers: ghHeaders }),
    ]);
    if (!profileResp.ok) {
      console.error('[auth] GitHub profile fetch failed:', profileResp.status);
      return redirectApp({ error: 'Could not read your GitHub profile' });
    }
    const profile = await profileResp.json().catch(() => ({}));
    const emails = emailsResp.ok ? await emailsResp.json().catch(() => []) : [];

    // Prefer the primary verified email; fall back to any verified one.
    let email = '';
    if (Array.isArray(emails)) {
      const primary = emails.find((e) => e && e.primary && e.verified);
      const anyVerified = emails.find((e) => e && e.verified);
      email = normEmail((primary && primary.email) || (anyVerified && anyVerified.email) || '');
    }
    if (!email) {
      return redirectApp({ error: 'No verified email on your GitHub account' });
    }

    const githubId = profile && profile.id;
    const name = (profile && (profile.name || profile.login)) || null;

    // 3. Find-or-create, then link the GitHub id (no duplicate accounts).
    let user = await User.findByEmail(email);
    if (user) {
      if (githubId && !user.github_id) await User.linkGithubId(user.id, githubId);
      // GitHub vouched for this address, so an unverified match is now verified.
      if (!user.email_verified) await User.markVerified(user.id);
    } else {
      user = await User.createGithubUser({ email, name, githubId });
    }

    const token = signToken(user.id);
    return redirectApp({ token });
  } catch (err) {
    console.error('[auth] GitHub callback error:', err);
    return redirectApp({ error: 'GitHub sign-in failed' });
  }
}

async function updateMe(req, res) {
  try {
    const fields = {};

    if (Object.prototype.hasOwnProperty.call(req.body, 'name')) {
      const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
      if (name.length < 1 || name.length > 120) {
        return fail(res, 400, 'Name must be between 1 and 120 characters');
      }
      fields.name = name;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'bio')) {
      const bio = typeof req.body.bio === 'string' ? req.body.bio.trim() : '';
      if (bio.length > 300) {
        return fail(res, 400, 'Bio must be 300 characters or fewer');
      }
      fields.bio = bio.length === 0 ? null : bio;
    }

    if (Object.keys(fields).length === 0) {
      return fail(res, 400, 'Nothing to update');
    }

    const user = await User.updateProfile(req.user.id, fields);
    if (!user) return fail(res, 404, 'Account not found');
    return res.json({ user: User.publicShape(user) });
  } catch (err) {
    return serverError(res, err);
  }
}

module.exports = {
  signup,
  verifyOtp,
  login,
  forgotPassword,
  resetPassword,
  me,
  updateMe,
  githubStart,
  githubCallback,
};
