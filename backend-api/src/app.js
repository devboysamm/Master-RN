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
const errorHandler = require('./middlewares/errorHandler');

const app = express();

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:4173',
  'https://admin.masterreactnative.dev',
  'https://masterreactnative.dev',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS: origin ${origin} not allowed`));
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

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/modules', modulesRoutes);
app.use('/api', lessonsRoutes);
app.use('/api/app-content', appContentRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/legal', legalRoutes);
app.use('/api/chat', chatRoutes);
// /api/upload (POST single image) lives on uploadsRoutes.upload,
// /api/uploads (GET list, DELETE /:filename) on uploadsRoutes.list.
app.use('/api', uploadsRoutes.upload);
app.use('/api/uploads', uploadsRoutes.list);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Not found' });
});

app.use(errorHandler);

module.exports = app;
