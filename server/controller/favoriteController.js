import asyncHandler from "../utils/asyncHandler.js";
import { CustomError } from "../utils/errorHandler.js";
import Favorite from "../schemas/favoriteSchema.js";
import Book from "../schemas/bookSchema.js";

export const addFavorite = asyncHandler(async (req, res) => {
  const { bookId } = req.params;

  const book = await Book.findById(bookId);
  if (!book) {
    throw new CustomError("Book not found", 404);
  }

  const existing = await Favorite.findOne({ user: req.user.id, book: bookId });
  if (existing) {
    throw new CustomError("This book is already in your favorites", 400);
  }

  const favorite = await Favorite.create({ user: req.user.id, book: bookId });

  res.status(201).json({ favorite, message: "Book added to favorites" });
});

export const removeFavorite = asyncHandler(async (req, res) => {
  const { bookId } = req.params;

  const favorite = await Favorite.findOneAndDelete({
    user: req.user.id,
    book: bookId,
  });

  if (!favorite) {
    throw new CustomError("Favorite not found", 404);
  }

  res.status(200).json({ message: "Book removed from favorites" });
});

export const getMyFavorites = asyncHandler(async (req, res) => {
  const favorites = await Favorite.find({ user: req.user.id })
    .populate("book", "title author coverImage averageRating price")
    .sort({ createdAt: -1 });

  res.status(200).json({ favorites, message: "Favorites retrieved successfully" });
});

export const getMostFavoritedBooks = asyncHandler(async (req, res) => {
  const results = await Favorite.aggregate([
    { $group: { _id: "$book", favoriteCount: { $sum: 1 } } },
    { $sort: { favoriteCount: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "books",
        localField: "_id",
        foreignField: "_id",
        as: "book",
      },
    },
    { $unwind: "$book" },
  ]);

  res.status(200).json({ results, message: "Most favorited books retrieved" });
});