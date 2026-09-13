import winston from "winston";

const { combine, timestamp, json, printf, colorize } = winston.format;

const devFormat = printf(({ level, message, timestamp, service, ...meta }) => {
  const metaString = Object.keys(meta).length ? JSON.stringify(meta) : "";
  return `[${timestamp}] [${level}] [${service || "App"}]: ${message} ${metaString}`;
});

export const createServiceLogger = (serviceName: string) => {
  return winston.createLogger({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    defaultMeta: { service: serviceName },
    format: combine(
      timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      process.env.NODE_ENV === "production"
        ? json()
        : combine(colorize(), devFormat),
    ),
    transports: [new winston.transports.Console()],
  });
};

export const logger = createServiceLogger("task-orchestrator-web");
