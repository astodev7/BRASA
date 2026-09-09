require('dotenv').config();

function required(name, fallback = undefined) {
  const value = process.env[name] ?? fallback;
  return value;
}

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  databaseUrl: required('DATABASE_URL'),
  jwtSecret: required('JWT_SECRET', 'dev-secret-change-me'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  cookieSecret: required('COOKIE_SECRET', 'dev-cookie-secret-change-me'),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    from: process.env.SMTP_FROM || 'BRASA <no-reply@brasa.example>',
  },
  restaurantNotificationEmail: process.env.RESTAURANT_NOTIFICATION_EMAIL,
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxLogin: parseInt(process.env.RATE_LIMIT_MAX_LOGIN || '10', 10),
    maxPublic: parseInt(process.env.RATE_LIMIT_MAX_PUBLIC || '60', 10),
  },
  isProduction: (process.env.NODE_ENV || 'development') === 'production',
};

if (env.isProduction && (!env.databaseUrl || env.jwtSecret === 'dev-secret-change-me')) {
  // eslint-disable-next-line no-console
  console.error('[config] Variaveis de ambiente obrigatorias ausentes em producao (DATABASE_URL / JWT_SECRET).');
  process.exit(1);
}

module.exports = env;
