const { createLogger, transports, format } = require("winston")

// CUD(xR) logs

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({
      format: "DD-MM-YYYY HH:mm:ss A",
      tz: "Asia/Kolkata",
    }),
    format.simple(),
    format.splat()
  ),

  transports: [
    new transports.File({
      filename: "access.log",
    }),
  ],
})

module.exports = logger
