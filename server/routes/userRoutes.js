import { Router } from "express";
import {
  getAllUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  deactivateUser,
  reactivateUser,
} from "../controller/userController.js";
import { auth, admin } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/users", auth, admin, getAllUser);
router.get("/users/:id", auth, getUserById);
router.put("/users/:id", auth, updateUser);
router.put("/users/:id/deactivate", auth, deactivateUser);
router.put("/users/:id/reactivate", auth, admin, reactivateUser);
router.delete("/users/:id", auth, admin, deleteUser);

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/current-user", auth, getCurrentUser);

export default router;