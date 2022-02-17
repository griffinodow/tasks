import { Request, Response, NextFunction } from "express";
import { transaction } from "../frameworks/postgresql";
import { checkValidId } from "../misc/id";

/**
 * Authentication ID middleware. Reassigns the ID from the authorization header to req.body.id.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The Express next function.
 */
export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.headers.authorization?.split(" ")[1];
  if (id) req.body.id = id;

  if (id) {
    const SELECT_USER = 'SELECT id FROM "user" WHERE id=$1';
    const result = await transaction(SELECT_USER, [id]);
    if (!checkValidId(id)) {
      res.status(400).json({
        status: "fail",
        messages: ["Invalid ID"],
      });
    } else if (result.length === 0) {
      res.status(400).json({
        status: "fail",
        messages: ["Authorization failed"],
      });
    } else {
      next();
    }
  } else {
    next();
  }
};

/**
 * Protects a route and all subroutes by requiring authentication.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The Express next function.
 */
export const authRequired = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.id) {
    res.status(400).json({
      status: "fail",
      messages: ["Authorization required"],
    });
  } else {
    next();
  }
};
