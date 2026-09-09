const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const env = require('./config/env');
const logger = require('./utils/logger');
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');

const menuRoutes = require('./routes/menu.routes');
const reservationRoutes = require('./routes/reservation.routes');
const contactRoutes = require('./routes/contact.routes');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const healthRoutes = require('./routes/health.routes');

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(helmet());
app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser(env.cookieSecret));

app.use(
  morgan(env.isProduction ? 'combined' : 'dev', {
    stream: { write: (msg) => logger.info(msg.trim()) },
  })
);

app.use('/api', healthRoutes);
app.use('/api', menuRoutes);
app.use('/api', reservationRoutes);
app.use('/api', contactRoutes);
app.use('/api', authRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

if (require.main === module) {
  app.listen(env.port, () => {
    logger.info(`BRASA API rodando na porta ${env.port} [${env.nodeEnv}]`);
  });
}

module.exports = app;
