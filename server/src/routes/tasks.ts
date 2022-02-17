import express from "express";
import {
  handleCreateTask,
  handleFindAllTasks,
  handleUpdateTask,
  handleDeleteTask,
} from "../controllers/task";

const router = express.Router({ mergeParams: true });

/**
 * Handle post task route.
 */
router.post("/", handleCreateTask);

/**
 * Handle get tasks route.
 */
router.get("/", handleFindAllTasks);

/**
 * handle update task route.
 */
router.put("/:uuid", handleUpdateTask);

/**
 * Handle delete task route.
 */
router.delete("/:uuid", handleDeleteTask);

export default router;
