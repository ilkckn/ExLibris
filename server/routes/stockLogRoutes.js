import { Router } from "express";
import { getStockHistory, getAllStockLogs } from "../controller/stockLogController.js";
import { auth, admin } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", auth, admin, getAllStockLogs);
router.get("/:bookId", auth, admin, getStockHistory);

export default router;