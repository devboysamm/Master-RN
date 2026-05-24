const DeviceToken = require('../models/DeviceToken');
const Notification = require('../models/Notification');

// Expo's push service. We never hold any secret for this — Expo accepts the
// push tokens directly.
const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';
const CHUNK_SIZE = 100; // Expo recommends ≤100 messages per request.

// POST /api/notifications/register-token — AUTHENTICATED user.
// Upsert the logged-in user's Expo push token (unique → no duplicate rows).
async function registerToken(req, res, next) {
  try {
    const token = typeof req.body.token === 'string' ? req.body.token.trim() : '';
    if (!token) {
      return res.status(400).json({ success: false, message: 'A push token is required' });
    }
    const platform =
      typeof req.body.platform === 'string' ? req.body.platform.trim().slice(0, 20) : null;
    await DeviceToken.upsert({ userId: req.user.id, token: token.slice(0, 255), platform });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

// GET /api/notifications — AUTHENTICATED user. Recent notifications for the
// app's bell list, newest first.
async function list(req, res, next) {
  try {
    const data = await Notification.findRecent(50);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/notifications/:id — ADMIN ONLY. Removes the history entry only;
// it does not unsend anything already delivered to devices.
async function remove(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid notification id' });
    }
    const affected = await Notification.remove(id);
    if (!affected) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.json({ success: true, data: { id } });
  } catch (err) {
    next(err);
  }
}

// POST /api/notifications/send — ADMIN ONLY. Persist the notification, then
// broadcast it to every registered device via Expo. Never crashes — the row
// is saved first, and delivery failures are summarised, not thrown.
async function send(req, res, next) {
  try {
    const title = typeof req.body.title === 'string' ? req.body.title.trim() : '';
    const body = typeof req.body.body === 'string' ? req.body.body.trim() : '';
    if (!title) {
      return res.status(400).json({ success: false, message: 'A title is required' });
    }

    const notification = await Notification.create({
      title: title.slice(0, 255),
      body: body.slice(0, 5000),
    });

    const tokens = await DeviceToken.allTokens();
    const { sent, failed } = await pushToExpo(tokens, title, body);

    res.json({
      success: true,
      data: { notification, recipients: tokens.length, sent, failed },
    });
  } catch (err) {
    next(err);
  }
}

// Deliver to Expo in chunks of CHUNK_SIZE. Returns { sent, failed }. All
// errors are logged and swallowed so a delivery hiccup never 500s the request.
async function pushToExpo(tokens, title, body) {
  let sent = 0;
  let failed = 0;

  for (let i = 0; i < tokens.length; i += CHUNK_SIZE) {
    const chunk = tokens.slice(i, i + CHUNK_SIZE);
    const messages = chunk.map((to) => ({ to, sound: 'default', title, body }));
    try {
      const resp = await fetch(EXPO_PUSH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate',
        },
        body: JSON.stringify(messages),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        console.error('[notifications] Expo push HTTP error', resp.status, JSON.stringify(data));
        failed += chunk.length;
        continue;
      }
      // Expo replies with { data: [ { status: 'ok' | 'error', message? } ] }.
      const tickets = Array.isArray(data && data.data) ? data.data : [];
      for (let j = 0; j < chunk.length; j++) {
        const ticket = tickets[j];
        if (ticket && ticket.status === 'ok') {
          sent += 1;
        } else {
          failed += 1;
          if (ticket && ticket.message) {
            console.error('[notifications] Expo ticket error:', ticket.message);
          }
        }
      }
    } catch (e) {
      console.error('[notifications] Expo push request failed:', e);
      failed += chunk.length;
    }
  }

  return { sent, failed };
}

module.exports = { registerToken, list, send, remove };
