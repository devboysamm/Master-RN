const express = require('express');
const cors = require('cors');
const path = require('path');

const modulesRoutes = require('./routes/modules');
const lessonsRoutes = require('./routes/lessons');
const appContentRoutes = require('./routes/appContent');
const categoriesRoutes = require('./routes/categories');
const uploadsRoutes = require('./routes/uploads');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const legalRoutes = require('./routes/legal');
const chatRoutes = require('./routes/chat');
const problemReportsRoutes = require('./routes/problemReports');
const notificationsRoutes = require('./routes/notifications');
const adminRoutes = require('./routes/admin');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:4173',
  'https://admin.masterreactnative.dev',
  'https://masterreactnative.dev',
];

// Allow localhost / 127.0.0.1 on any port so local admin-panel dev works.
function isLocalhostOrigin(origin) {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Requests with no Origin header (server-to-server, curl, the import
      // script, the mobile app) are always allowed.
      if (!origin) return callback(null, true);

      const allowed = ALLOWED_ORIGINS.includes(origin) || isLocalhostOrigin(origin);
      // IMPORTANT: never throw and never pass an Error here. A disallowed
      // origin is a clean rejection (false): the browser blocks the response
      // and the process stays alive. Passing an Error (or throwing) surfaces
      // as an uncaught exception that crashes Node and crash-loops PM2.
      return callback(null, allowed);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '2mb' }));

// Static SVG icons served at /icons/*.svg
app.use(
  '/icons',
  express.static(path.join(__dirname, '..', 'public', 'icons'), {
    maxAge: '1d',
    setHeaders: (res) => res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8'),
  })
);

// User-uploaded images served at /uploads/<filename>
app.use(
  '/uploads',
  express.static(path.join(__dirname, '..', 'public', 'uploads'), {
    maxAge: '7d',
  })
);

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'API is running' });
});

app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/modules', modulesRoutes);
app.use('/api', lessonsRoutes);
app.use('/api/app-content', appContentRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/legal', legalRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/problem-reports', problemReportsRoutes);
app.use('/api/notifications', notificationsRoutes);
// /api/upload (POST single image) lives on uploadsRoutes.upload,
// /api/uploads (GET list, DELETE /:filename) on uploadsRoutes.list.
app.use('/api', uploadsRoutes.upload);
app.use('/api/uploads', uploadsRoutes.list);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Not found' });
});

app.use(errorHandler);

module.exports = app;
