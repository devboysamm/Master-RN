const express = require('express');
const cors = require('cors');

const modulesRoutes = require('./routes/modules');
const lessonsRoutes = require('./routes/lessons');
const appContentRoutes = require('./routes/appContent');
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

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'API is running' });
});

app.use('/api/modules', modulesRoutes);
app.use('/api', lessonsRoutes);
app.use('/api/app-content', appContentRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Not found' });
});

app.use(errorHandler);

module.exports = app;
