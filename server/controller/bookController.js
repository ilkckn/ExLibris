import Book from "../schemas/bookSchema.js";
import StockLog from "../schemas/stockLogSchema.js";
import { CustomError } from "../utils/errorHandler.js";
import asyncHandler from "../utils/asyncHandler.js";
import Author from "../schemas/authorSchema.js";

export const getAllBooks = asyncHandler(async (req, res) => {
  const books = await Book.find().populate("author", "name photo nationality").sort({ title: 1 });
  res.status(200).json({ books, message: "Books retrieved successfully" });
});

export const getBookById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const book = await Book.findById(id).populate("author", "name bio photo birthYear deathYear nationality notableWorks");
  if (!book) {
    throw new CustomError("Book not found", 404);
  }
  res.status(200).json({ book, message: "Book retrieved successfully" });
});

export const createBook = asyncHandler(async (req, res) => {
  const {
    title,
    author,
    isbn,
    description,
    coverImage,
    genre,
    language,
    publishedYear,
    publisher,
    pageCount,
    price,
    stock,
    rentalStock,
  } = req.body;

  const existingBook = await Book.findOne({ isbn });
  if (existingBook) {
    throw new CustomError("Book with this ISBN already exists", 400);
  }

  const authorExists = await Author.findById(author);
  if (!authorExists) {
    throw new CustomError("Author not found", 404);
  }

  const book = await Book.create({
    title,
    author,
    isbn,
    description,
    coverImage,
    genre,
    language,
    publishedYear,
    publisher,
    pageCount,
    price,
    stock,
    rentalStock,
    addedBy: req.user.id,
  });

  res.status(201).json({ book, message: "Book created successfully" });
});

export const updateBook = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    title,
    author,
    description,
    coverImage,
    genre,
    language,
    publishedYear,
    publisher,
    pageCount,
    price,
  } = req.body;

  const updateData = {
    title,
    author,
    description,
    coverImage,
    genre,
    language,
    publishedYear,
    publisher,
    pageCount,
    price,
  };

  const book = await Book.findByIdAndUpdate(id, updateData, { new: true });
  if (!book) {
    throw new CustomError("Book not found", 404);
  }
  res.status(200).json({ book, message: "Book updated successfully" });
});

export const updateStock = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  const book = await Book.findByIdAndUpdate(
    id,
    { $inc: { stock: amount } },
    { new: true },
  );

  if (!book) {
    throw new CustomError("Book not found", 404);
  }

  if (book.stock < 0) {
    book.stock -= amount; // geri al
    await book.save();
    throw new CustomError("Stock cannot be negative", 400);
  }

  await StockLog.create({
    book: id,
    stockType: "sale",
    amount,
    reason: reason || "manual adjustment",
    changedBy: req.user.id,
  });

  res.status(200).json({ book, message: "Stock updated successfully" });
});

export const deleteBook = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const book = await Book.findByIdAndDelete(id);
  if (!book) {
    throw new CustomError("Book not found", 404);
  }
  res.status(200).json({ message: "Book deleted successfully" });
});

// export const getBooksByGenre = asyncHandler(async (req, res) => {
//   const { genre } = req.params;
//   const books = await Book.find({ genre: { $in: [genre] } });
//   res.status(200).json({ books, message: "Books retrieved successfully" });
// });

// export const getBooksByAuthor = asyncHandler(async (req, res) => {
//   const { author } = req.params;
//   const books = await Book.find({ author });
//   res.status(200).json({ books, message: "Books retrieved successfully" });
// });

// export const getBooksByLanguage = asyncHandler(async (req, res) => {
//   const { language } = req.params;
//   const books = await Book.find({ language });
//   res.status(200).json({ books, message: "Books retrieved successfully" });
// });

// export const getBooksByPublishedYear = asyncHandler(async (req, res) => {
//   const { year } = req.params;
//   const books = await Book.find({ publishedYear: year });
//   res.status(200).json({ books, message: "Books retrieved successfully" });
// });
