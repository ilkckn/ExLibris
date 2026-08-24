import asyncHandler from "../utils/asyncHandler.js";
import { CustomError } from "../utils/errorHandler.js";
import Author from "../schemas/authorSchema.js";
import Book from "../schemas/bookSchema.js";

export const getAllAuthors = asyncHandler(async (req, res) => {
  const authors = await Author.find().sort({ name: 1 });
  res.status(200).json({ authors, message: "Authors retrieved successfully" });
});

export const getAuthorById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const author = await Author.findById(id);
  if (!author) {
    throw new CustomError("Author not found", 404);
  }

  const books = await Book.find({ author: id });

  res.status(200).json({ author, books, message: "Author retrieved successfully" });
});

export const createAuthor = asyncHandler(async (req, res) => {
  const { name, bio, photo, birthYear, nationality } = req.body;

  const existingAuthor = await Author.findOne({ name });
  if (existingAuthor) {
    throw new CustomError("This author already exists", 400);
  }

  const author = await Author.create({ name, bio, photo, birthYear, nationality });

  res.status(201).json({ author, message: "Author created successfully" });
});

export const updateAuthor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, bio, photo, birthYear, nationality } = req.body;

  const author = await Author.findByIdAndUpdate(
    id,
    { name, bio, photo, birthYear, nationality },
    { new: true }
  );

  if (!author) {
    throw new CustomError("Author not found", 404);
  }

  res.status(200).json({ author, message: "Author updated successfully" });
});

export const deleteAuthor = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const hasBooks = await Book.exists({ author: id });
  if (hasBooks) {
    throw new CustomError("Cannot delete an author who has existing books", 400);
  }

  const author = await Author.findByIdAndDelete(id);
  if (!author) {
    throw new CustomError("Author not found", 404);
  }

  res.status(200).json({ message: "Author deleted successfully" });
});