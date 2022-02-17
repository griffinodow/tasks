import { Request, Response, NextFunction } from "express";
import {
  createTask,
  findAllTasks,
  updateTask,
  deleteTask,
} from "../models/task";
import { send } from "../utils/misc/send";

/**
 * implements proper params from super route.
 */
export interface TaskRequest {
  params: {
    listUuid: string;
  };
  body: {
    id: string;
    uuid: string;
    name: string;
    complete: boolean;
  };
}

/**
 * Creates a bind to the createTask function.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The Express next function.
 */
export const handleCreateTask = async (
  req: TaskRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await createTask(
      req.params.listUuid,
      req.body.uuid,
      req.body.name,
      req.body.complete
    );
    send(res, result);
  } catch (error) {
    next(error);
  }
};

/**
 * Creates a bind to the findAllTasks function.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The Express next function.
 */
export const handleFindAllTasks = async (
  req: TaskRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await findAllTasks(req.body.id, req.params.listUuid);
    send(res, result);
  } catch (error) {
    next(error);
  }
};

/**
 * Creates a bind to the updateTask function.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The Express next function.
 */
export const handleUpdateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await updateTask(
      req.body.id,
      req.params.uuid,
      req.body?.name,
      req.body?.complete
    );
    send(res, result);
  } catch (error) {
    next(error);
  }
};

/**
 * Creates a bind to the deleteTask function.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The Express next function.
 */
export const handleDeleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await deleteTask(req.body.id, req.params.uuid);
    send(res, result);
  } catch (error) {
    next(error);
  }
};
