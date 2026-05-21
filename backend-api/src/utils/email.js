const { Resend } = require('resend');

const FROM = 'Master RN <noreply@masterreactnative.dev>';
const SUBJECT = 'Your Master RN verification code';

// Lazily construct the client so a missing key never crashes module load.
let resend = null;
function getClient() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!resend) resend = new Resend(key);
  return resend;
}

function otpHtml(code, purpose) {
  const intro =
    purpose === 'reset'
      ? 'Use this code to reset your Master RN password.'
      : 'Use this code to verify your email and finish signing up.';
  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#F5EFE6;font-family:-apple-system,Segoe UI,Roboto,sans-serif;">
    <div style="max-width:480px;margin:0 auto;padding:40px 24px;">
      <div style="background:#FBF6EE;border:1px solid rgba(22,19,17,0.08);border-radius:20px;padding:32px;text-align:center;">
        <p style="margin:0 0 8px;font-size:13px;font-weight:700;letter-spacing:1.4px;color:#D9532F;text-transform:uppercase;">Master RN</p>
        <p style="margin:0 0 24px;font-size:15px;color:#3B342F;">${intro}</p>
        <p style="margin:0;font-size:40px;font-weight:800;letter-spacing:8px;color:#161311;">${code}</p>
        <p style="margin:20px 0 0;font-size:13px;color:#8C8378;">This code expires in 10 minutes.</p>
      </div>
      <p style="margin:18px 0 0;text-align:center;font-size:12px;color:#8C8378;">
        Didn't request this? You can safely ignore this email.
      </p>
    </div>
  </body>
</html>`;
}

/**
 * Send a 6-digit OTP email. No-ops (with a warning) when RESEND_API_KEY is
 * not configured so local dev never crashes — the OTP still lands in the DB,
 * and you can read it from the otp_codes table while testing.
 */
async function sendOtpEmail(toEmail, code, purpose) {
  const client = getClient();
  if (!client) {
    console.warn('[email] RESEND_API_KEY not set — skipping OTP email to', toEmail);
    return { skipped: true };
  }
  const result = await client.emails.send({
    from: FROM,
    to: toEmail,
    subject: SUBJECT,
    html: otpHtml(code, purpose),
  });
  // Resend resolves with { data, error } rather than throwing — surface the
  // full error object (it carries name + message: rate limit, domain not
  // verified, recipient blocked, etc.) and re-throw the real reason.
  if (result?.error) {
    console.error('[email] Resend send failed:', result.error);
    const reason = result.error.message || result.error.name || 'Unknown Resend error';
    throw new Error(reason);
  }
  return result?.data;
}

module.exports = { sendOtpEmail };
