import { initPostgres } from "./utils/frameworks/postgresql";
import { initExpress } from "./utils/frameworks/express";
import { logger } from "./utils/frameworks/logger";

/**
 * Initializes the server.
 */
(async () => {
  await initPostgres();
  await initExpress();
  logger.info("Tasks Server Initialized");
})();
