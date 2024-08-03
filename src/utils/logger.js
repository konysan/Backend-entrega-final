const winston = require('winston');

const levels = {
  fatal: 0,
  error: 1,
  warning: 2,
  info: 3,
  http: 4,
  debug: 5
};

const colors = {
  fatal: 'red',
  error: 'orange',
  warning: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white'
};

function createLogger(env) {
  const transports = [
    new winston.transports.Console({
      level: env === 'development' ? 'debug' : 'info',
      colors
    }),
    new winston.transports.File({
      filename: 'logs/errors.log',
      level: 'error'
    })
  ];

  if (env === 'production') {
    transports.push(
      new winston.transports.File({
        filename: 'logs/app.log',
        level: 'info'
      })
    );
  }

  return winston.createLogger({
    levels,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(({ level, message, timestamp }) => {
        return `[${timestamp}] ${level}: ${message}`;
      })
    ),
    transports
  });
}

module.exports = createLogger;