/* Logger simples e centralizado. Em producao pode ser trocado por
   winston/pino sem alterar o restante da aplicacao. */
const levels = ['error', 'warn', 'info', 'debug'];

function log(level, message, meta) {
  if (!levels.includes(level)) level = 'info';
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(meta ? { meta } : {}),
  };
  // eslint-disable-next-line no-console
  const method = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
  console[method](JSON.stringify(entry));
}

module.exports = {
  error: (message, meta) => log('error', message, meta),
  warn: (message, meta) => log('warn', message, meta),
  info: (message, meta) => log('info', message, meta),
  debug: (message, meta) => log('debug', message, meta),
};
