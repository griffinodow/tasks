import { Response } from "express";
import {
  StatusSuccess,
  StatusFail,
  StatusDelete,
} from "../../../../interfaces/responses/statuses";

/**
 * Processes the request that comes from a model.
 * @param res - Express response.
 * @param result - Result from model.
 */
export const send = (
  res: Response,
  result: StatusSuccess<any> | StatusFail | StatusDelete
) => {
  if (result.status === "success") res.status(200).json(result);
  else res.status(400).json(result);
};
