require('dotenv').config();

const DEV_JWT_SECRET = 'dev-secret-change-me';
const DEV_COOKIE_SECRET = 'dev-cookie-secret-change-me';
const MIN_SECRET_LENGTH = 32;

function required(name, fallback = undefined) {
  return process.env[name] ?? fallback;
}

function isWeakSecret(value, developmentFallback) {
  return !value || value === developmentFallback || value.length < MIN_SECRET_LENGTH;
}

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

const env = {
  nodeEnv,
  port: parseInt(process.env.PORT || '4000', 10),
  databaseUrl: required('DATABASE_URL'),
  jwtSecret: required('JWT_SECRET', DEV_JWT_SECRET),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  cookieSecret: required('COOKIE_SECRET', DEV_COOKIE_SECRET),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  smtp: {
    host: process.env.SMTP_HOST || null,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || null,
    password: process.env.SMTP_PASSWORD || null,
    from: process.env.SMTP_FROM || null,
  },
  restaurantNotificationEmail: process.env.RESTAURANT_NOTIFICATION_EMAIL || null,
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxLogin: parseInt(process.env.RATE_LIMIT_MAX_LOGIN || '10', 10),
    maxPublic: parseInt(process.env.RATE_LIMIT_MAX_PUBLIC || '60', 10),
  },
  isProduction,
};

if (env.isProduction) {
  const errors = [];

  if (!env.databaseUrl) {
    errors.push('DATABASE_URL e obrigatoria');
  }

  if (isWeakSecret(env.jwtSecret, DEV_JWT_SECRET)) {
    errors.push(`JWT_SECRET deve ter pelo menos ${MIN_SECRET_LENGTH} caracteres e nao pode usar o valor de desenvolvimento`);
  }

  if (isWeakSecret(env.cookieSecret, DEV_COOKIE_SECRET)) {
    errors.push(`COOKIE_SECRET deve ter pelo menos ${MIN_SECRET_LENGTH} caracteres e nao pode usar o valor de desenvolvimento`);
  }

  if (!process.env.CORS_ORIGIN) {
    errors.push('CORS_ORIGIN e obrigatoria em producao');
  }

  if (env.smtp.host) {
    if (!env.smtp.user || !env.smtp.password || !env.smtp.from) {
      errors.push('SMTP_HOST foi configurado, mas SMTP_USER, SMTP_PASSWORD ou SMTP_FROM estao ausentes');
    }
  }

  if (errors.length) {
    // eslint-disable-next-line no-console
    console.error(`[config] Configuracao de producao invalida:\n- ${errors.join('\n- ')}`);
    process.exit(1);
  }
}

module.exports = env;
