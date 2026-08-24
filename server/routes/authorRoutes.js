import { Router } from "express";
import {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} from "../controller/authorController.js";
import { auth, admin } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", getAllAuthors);
router.get("/:id", getAuthorById);
router.post("/", auth, admin, createAuthor);
router.put("/:id", auth, admin, updateAuthor);
router.delete("/:id", auth, admin, deleteAuthor);

export default router;