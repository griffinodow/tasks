import express from "express";
import { authRequired } from "../utils/middleware/auth";
import tasks from "./tasks";
import {
  handleCreateList,
  handleFindAllLists,
  handleUpdateList,
  handleDeleteList,
} from "../controllers/list";

const router = express.Router();

router.use(authRequired);

/**
 * Handle post list route.
 */
router.post("/", handleCreateList);

/**
 * Handle get lists route.
 */
router.get("/", handleFindAllLists);

/**
 * Handle update list route.
 */
router.put("/:uuid", handleUpdateList);

/**
 * Handle delete list route.
 */
router.delete("/:uuid", handleDeleteList);

/**
 * Handle tasks route.
 */
router.use("/:listUuid/tasks", tasks);

export default router;
