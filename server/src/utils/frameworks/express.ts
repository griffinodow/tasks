import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cors from "cors";
import { auth } from "../middleware/auth";
import users from "../../routes/users";
import lists from "../../routes/lists";
import { StatusError } from "../../../../interfaces/responses/statuses";
import { logger } from "./logger";

const app = express();
// Config
app.set("trust proxy", true);
app.use(cors());
app.use(
  morgan(
    ":remote-addr :method :url :status :res[content-length] - :response-time ms",
    {
      stream: {
        write: (message) => {
          logger.info(message.substring(0, message.lastIndexOf("\n")));
        },
      },
    }
  )
);
app.use(express.json());
app.use(auth);

// Routes
app.use("/users", users);
app.use("/lists", lists);

// 404
app.use("*", (_req: Request, res: Response) => {
  res.status(404).json({
    status: "failure",
    data: {
      route: "Route not found",
    },
  });
});

// Errors
app.use((error: any, _req: Request, res: Response, _next: NextFunction) => {
  const resError: StatusError = {
    status: "error",
    message: error.message || "Internal server error",
  };
  logger.error(error);
  console.error(error);
  res
    .status(error.status || 500)
    .json(resError)
    .end();
});

/**
 * Initializes the express server.
 */
export const initExpress = async () => {
  await new Promise<void>((resolve) => {
    const port = process.env.NODE_ENV === "production" ? 80 : 5000;
    app.listen(port, () => resolve());
  });
};

export { app };
