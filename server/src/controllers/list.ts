import { Request, Response, NextFunction } from "express";
import {
  createList,
  findAllLists,
  updateList,
  deleteList,
} from "../models/list";
import { send } from "../utils/misc/send";

/**
 * Creates a bind to the createList function.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The Express next function.
 */
export const handleCreateList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await createList(
      req.body.id,
      req.body?.uuid,
      req.body?.name
    );
    send(res, result);
  } catch (error) {
    next(error);
  }
};

/**
 * Creates a bind to the findAllLists function.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The Express next function.
 */
export const handleFindAllLists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await findAllLists(req.body.id);
    send(res, result);
  } catch (error) {
    next(error);
  }
};

/**
 * Creates a bind to the updateList function.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The Express next function.
 */
export const handleUpdateList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await updateList(
      req.body.id,
      req.params.uuid,
      req.body?.name
    );
    send(res, result);
  } catch (error) {
    next(error);
  }
};

/**
 * Creates a bind to the deleteList function.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The Express next function.
 */
export const handleDeleteList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await deleteList(req.body.id, req.params.uuid);
    send(res, result);
  } catch (error) {
    next(error);
  }
};
