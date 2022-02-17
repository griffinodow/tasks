import { NextFunction, Request, Response } from "express";
import { createUser, findUser, deleteUser } from "../models/user";
import { send } from "../utils/misc/send";

/**
 * Creates a bind to the createUser function.
 * @param _req - The Express request object.
 * @param res - The Express response object.
 * @param next - The Express next function.
 */
export const handleCreateUser = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await createUser();
    send(res, result);
  } catch (error) {
    next(error);
  }
};

/**
 * Creates a bind to the findUser function.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The Express next function.
 */
export const handleFindUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await findUser(req.params.id);
    send(res, result);
  } catch (error) {
    next(error);
  }
};

/**
 * Creates a bind to the deleteUser function.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The Express next function.
 */
export const handleDeleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await deleteUser(req.params.id);
    send(res, result);
  } catch (error) {
    next(error);
  }
};
