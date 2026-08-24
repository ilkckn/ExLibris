import asyncHandler from "../utils/asyncHandler.js";
import { CustomError } from "../utils/errorHandler.js";
import ReadingList from "../schemas/readingListSchema.js";
import Book from "../schemas/bookSchema.js";

export const addToReadingList = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  const { status } = req.body;

  const book = await Book.findById(bookId);
  if (!book) {
    throw new CustomError("Book not found", 404);
  }

  const existingEntry = await ReadingList.findOne({
    user: req.user.id,
    book: bookId,
  });

  if (existingEntry) {
    throw new CustomError("This book is already in your reading list", 400);
  }

  const readingListEntry = await ReadingList.create({
    user: req.user.id,
    book: bookId,
    status: status || "want-to-read",
  });

  res.status(201).json({
    readingListEntry,
    message: "Book added to reading list successfully",
  });
});

export const getMyReadingList = asyncHandler(async (req, res) => {
  const { status } = req.query;

  const filter = { user: req.user.id };
  if (status) {
    filter.status = status;
  }

  const list = await ReadingList.find(filter).populate(
    "book",
    "title author coverImage averageRating",
  );

  res
    .status(200)
    .json({ list, message: "Reading list retrieved successfully" });
});

export const updateReadingListStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["want-to-read", "reading", "read"];
  if (!validStatuses.includes(status)) {
    throw new CustomError("Invalid status value", 400);
  }

  const entry = await ReadingList.findById(id);
  if (!entry) {
    throw new CustomError("Reading list entry not found", 404);
  }

  if (entry.user.toString() !== req.user.id) {
    throw new CustomError("You are not authorized to update this entry", 403);
  }

  entry.status = status;
  await entry.save();

  res
    .status(200)
    .json({ entry, message: "Reading list status updated successfully" });
});

export const removeFromReadingList = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const entry = await ReadingList.findById(id);

  if (!entry) {
    throw new CustomError("Reading list entry not found", 404);
  }

  if (entry.user.toString() !== req.user.id) {
    throw new CustomError("You are not authorized to delete this entry", 403);
  }

  await ReadingList.findByIdAndDelete(id);
  res
    .status(200)
    .json({ message: "Book removed from reading list successfully" });
});
