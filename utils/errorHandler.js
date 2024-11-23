import winston from "winston";

const logger = winston.createLogger({
  level: "error",
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: "error.log" })],
});

export const handleError = (error, res) => {
  logger.error(error.message);
  res.status(500).json({ status: 500, message: "An error occurred. Check logs for details." });
};
