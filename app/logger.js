const { createLogger, format, transports } = require('winston')
const { combine, json, simple, timestamp, label, printf } = format

const logger = createLogger({
  level: 'info',
  transports: [
    new transports.File({
      filename: 'error.log',
      level: ['error', 'fatal'],
      format: combine(
        timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        json(),
      ),
    }),
    new transports.Console({
      format: printf(info => `${info.level}: ${info.message}`),
    }),
  ],
})

module.exports = logger
