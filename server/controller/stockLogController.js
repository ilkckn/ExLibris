import asyncHandler from "../utils/asyncHandler.js";
import { CustomError } from "../utils/errorHandler.js";
import StockLog from "../schemas/stockLogSchema.js";
import Book from "../schemas/bookSchema.js";

export const getStockHistory = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  const { stockType } = req.query;

  const book = await Book.findById(bookId);
  if (!book) {
    throw new CustomError("Book not found", 404);
  }

  const filter = { book: bookId };
  if (stockType) {
    filter.stockType = stockType;
  }

  const logs = await StockLog.find(filter)
    .populate("changedBy", "firstName lastName")
    .sort({ createdAt: -1 });

  res.status(200).json({ logs, message: "Stock history retrieved successfully" });
});

export const getAllStockLogs = asyncHandler(async (req, res) => {
  const { stockType } = req.query;

  const filter = {};
  if (stockType) {
    filter.stockType = stockType;
  }

  const logs = await StockLog.find(filter)
    .populate("book", "title author")
    .populate("changedBy", "firstName lastName")
    .sort({ createdAt: -1 });

  res.status(200).json({ logs, message: "All stock logs retrieved successfully" });
});