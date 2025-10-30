// utils/logger.js - Simple console logger
const getTimestamp = () => new Date().toISOString();

const logger = {
  info: (message, meta = {}) => {
    console.log(`[${getTimestamp()}] INFO: ${message}`, Object.keys(meta).length ? meta : '');
  },
  error: (message, error = {}) => {
    console.error(`[${getTimestamp()}] ERROR: ${message}`, error);
  },
  warn: (message, meta = {}) => {
    console.warn(`[${getTimestamp()}] WARN: ${message}`, Object.keys(meta).length ? meta : '');
  },
  debug: (message, meta = {}) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[${getTimestamp()}] DEBUG: ${message}`, Object.keys(meta).length ? meta : '');
    }
  }
};

const stream = {
  write: (message) => {
    logger.info(message.trim());
  }
};

const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('HTTP Request', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip
    });
  });
  
  next();
};

const logError = (error, context = {}) => {
  logger.error('Application Error', {
    error: error.message,
    stack: error.stack,
    ...context
  });
};

export { 
  logger, 
  stream, 
  requestLogger, 
  logError 
};

export default logger;