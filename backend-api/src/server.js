require('dotenv').config();
const app = require('./app');
const { initializeDatabase } = require('./config/initializeDatabase');

const PORT = Number(process.env.PORT) || 5000;

(async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`[server] listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('[server] failed to start:', err);
    process.exit(1);
  }
})();
