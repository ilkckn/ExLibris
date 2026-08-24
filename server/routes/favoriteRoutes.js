import { Router } from "express";
import { auth, admin } from "../middlewares/authMiddleware.js";
import {
  addFavorite,
  removeFavorite,
  getMyFavorites,
  getMostFavoritedBooks,
} from "../controller/favoriteController.js";

const router = Router();

router.post("/:bookId", auth, addFavorite);
router.delete("/:bookId", auth, removeFavorite);
router.get("/my-favorites", auth, getMyFavorites);
router.get("/most-favorited", getMostFavoritedBooks); // herkese açık, login gerekmez

export default router;
