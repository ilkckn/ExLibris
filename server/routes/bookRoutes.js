import { Router } from "express";
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  updateStock,
  deleteBook,
} from "../controller/bookController.js";
import { admin, auth } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", getAllBooks);
router.get("/:id", getBookById);
router.post("/add", auth, admin, createBook);
router.put("/:id", auth, admin, updateBook);
router.put("/:id/stock", auth, admin, updateStock);
router.delete("/:id", auth, admin, deleteBook);

export default router;
