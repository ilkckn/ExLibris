import { Router } from "express";
import { auth } from "../middlewares/authMiddleware.js";
import {
  addToReadingList,
  getMyReadingList,
  updateReadingListStatus,
  removeFromReadingList,
} from "../controller/readingListController.js";

const router = Router();

router.post("/:bookId", auth, addToReadingList);
router.get("/", auth, getMyReadingList);
router.put("/:id/status", auth, updateReadingListStatus);
router.delete("/:id", auth, removeFromReadingList);

export default router;