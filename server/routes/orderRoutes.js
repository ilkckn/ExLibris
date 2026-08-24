import { Router } from "express";
import {
  getAllOrders,
  getOrderById,
  getMyOrders,
  createOrder,
  updateOrderStatus,
} from "../controller/orderController.js";
import { auth, admin } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", auth, admin, getAllOrders);
router.get("/my-orders", auth, getMyOrders);
router.get("/:id", auth, getOrderById);
router.post("/", auth, createOrder);
router.put("/:id/status", auth, admin, updateOrderStatus);

export default router;