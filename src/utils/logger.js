import pino from "pino";

import { config } from "../config/config.js";

export function getTime() {
  const now = new Date();
  const options = { hour: "numeric", minute: "numeric", hour12: true };
  return now.toLocaleTimeString("id-ID", options);
}

export const createLogger = (options = {}) => {
  return pino({
    level: config.logger.level,
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        timestamp: `,"time":"${getTime()}"`,
        ignore: "pid,hostname",
        ...options,
      },
    },
  });
};

export const logger = createLogger();
