const asyncHandler = require('../utils/asyncHandler');
const { checkConnection } = require('../config/db');

const check = asyncHandler(async (req, res) => {
  const dbOk = await checkConnection();
  res.status(dbOk ? 200 : 503).json({
    status: dbOk ? 'ok' : 'degraded',
    database: dbOk ? 'connected' : 'unavailable',
    timestamp: new Date().toISOString(),
  });
});

module.exports = { check };
