import { createLogger } from "winston";
import LokiTransport from "winston-loki";

/**
 * Logs activity and pushes to log aggregator.
 */
export const logger = createLogger({
  transports: [
    new LokiTransport({
      host: "http://loki:3100",
      json: true,
      labels: { job: "tasks-api" },
    }),
  ],
});
