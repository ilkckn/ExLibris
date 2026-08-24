import User from "../schemas/userSchema.js";
import Book from "../schemas/bookSchema.js";
import Review from "../schemas/reviewSchema.js";
import asyncHandler from "../utils/asyncHandler.js";
import { CustomError } from "../utils/errorHandler.js";

export const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find()
    .populate("user", "firstName lastName email username")
    .populate("book", "title author");
  res.status(200).json({ reviews, message: "Reviews retrieved successfully" });
});

export const createReview = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  const { rating, comment } = req.body;

  const book = await Book.findById(bookId);
  if (!book) {
    throw new CustomError("Book not found", 404);
  }
  const existingReview = await Review.findOne({
    user: req.user.id,
    book: bookId,
  });
  if (existingReview) {
    throw new CustomError("You have already reviewed this book", 400);
  }
  const review = await Review.create({
    user: req.user.id,
    book: bookId,
    rating,
    comment,
  });
  await updateBookRatingStats(bookId);
  res.status(201).json({ review, message: "Review created successfully" });
});

export const updateReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const review = await Review.findById(id);
  if (!review) {
    throw new CustomError("Review not found", 404);
  }
  if (review.user.toString() !== req.user.id) {
    throw new CustomError("You are not authorized to update this review", 403);
  }
  if (rating) review.rating = rating;
  if (comment !== undefined) review.comment = comment;
  await review.save();
  await updateBookRatingStats(review.book);

  res.status(200).json({ review, message: "Review updated successfully" });
});

export const updateBookRatingStats = async (bookId) => {
  const stats = await Review.aggregate([
    { $match: { book: bookId } },
    {
      $group: {
        _id: "$book",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  await Book.findByIdAndUpdate(bookId, {
    averageRating: stats[0]?.avgRating || 0,
    reviewCount: stats[0]?.count || 0,
  });
};

export const getBookReviews = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  const book = await Book.findById(bookId);
  if (!book) {
    throw new CustomError("Book not found", 404);
  }
  const reviews = await Review.find({ book: bookId })
    .populate("user", "name email username")
    .sort({ createdAt: -1 });
  res
    .status(200)
    .json({ reviews, message: "Book reviews fetched successfully" });
});

export const deleteReview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const review = await Review.findById(id);
  if (!review) {
    throw new CustomError("Review not found", 404);
  }

  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    throw new CustomError("You can only delete your own review", 403);
  }

  const bookId = review.book;
  await Review.findByIdAndDelete(id);
  await updateBookRatingStats(bookId);

  res.status(200).json({ message: "Review deleted successfully" });
});
