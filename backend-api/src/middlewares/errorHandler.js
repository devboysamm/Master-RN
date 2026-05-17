function errorHandler(err, req, res, next) {
  console.error('[error]', err);
  const status = err.status || 500;
  const message = err.expose ? err.message : err.message || 'Internal server error';
  res.status(status).json({ success: false, message });
}

module.exports = errorHandler;
