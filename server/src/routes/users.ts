import express from "express";
import {
  handleCreateUser,
  handleFindUser,
  handleDeleteUser,
} from "../controllers/user";

const router = express.Router();

/**
 * Handle post user route.
 */
router.post("/", handleCreateUser);

/**
 * Handle get user route.
 */
router.get("/:id", handleFindUser);

/**
 * Handle delete user route.
 */
router.delete("/:id", handleDeleteUser);

export default router;
