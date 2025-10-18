import winston from "winston";

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info", // This will show info + errors
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    // File transports for persistent logging
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
    // Console transport - this is what Fly.io captures for live logs
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          const metaStr = Object.keys(meta).length
            ? ` ${JSON.stringify(meta)}`
            : "";
          return `${timestamp} [${level.toUpperCase()}]: ${message}${metaStr}`;
        })
      ),
    }),
  ],
});

export { logger };
