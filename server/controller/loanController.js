import Book from "../schemas/bookSchema.js";
import Loan from "../schemas/loanSchema.js";
import StockLog from "../schemas/stockLogSchema.js";
import asyncHandler from "../utils/asyncHandler.js";
import { CustomError } from "../utils/errorHandler.js";

const RENTAL_PERIOD_DAYS = 30;

const addOverdueInfo = (loans) => {
  return loans.map((loan) => {
    const isOverdue = loan.status === "borrowed" && new Date() > loan.dueDate;
    return {
      ...loan.toObject(),
      isOverdue,
    };
  });
};

export const getAllLoans = asyncHandler(async (req, res) => {
  const { overdueOnly } = req.query;

  const loans = await Loan.find()
    .populate("user", "firstName lastName email address")
    .populate("book", "title author isbn coverImage");

  let loansWithOverdueInfo = addOverdueInfo(loans);

  if (overdueOnly === "true") {
    loansWithOverdueInfo = loansWithOverdueInfo.filter(
      (loan) => loan.isOverdue,
    );
  }

  res
    .status(200)
    .json({
      loans: loansWithOverdueInfo,
      message: "All loans retrieved successfully",
    });
});

export const getMyLoans = asyncHandler(async (req, res) => {
  const { status } = req.query;

  const filter = { user: req.user.id };
  if (status) {
    filter.status = status;
  }

  const loans = await Loan.find(filter)
    .populate("book", "title author coverImage")
    .sort({ borrowedAt: -1 });

  const loansWithOverdueInfo = addOverdueInfo(loans);

  res.status(200).json({
    loans: loansWithOverdueInfo,
    message: "Loans retrieved successfully",
  });
});

export const createLoan = asyncHandler(async (req, res) => {
  const { bookId } = req.params;

  const book = await Book.findById(bookId);
  if (!book) {
    throw new CustomError("Book not found", 404);
  }

  if (book.rentalStock < 1) {
    throw new CustomError("Book is not available for loan", 400);
  }

  const existingLoan = await Loan.findOne({
    user: req.user.id,
    book: bookId,
    status: "borrowed",
  });
  if (existingLoan) {
    throw new CustomError(
      "You already have this book borrowed. You cannot borrow it again.",
      400,
    );
  }

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + RENTAL_PERIOD_DAYS);

  const loan = await Loan.create({
    user: req.user.id,
    book: bookId,
    dueDate,
  });

  book.rentalStock -= 1;
  await StockLog.create({
    book: bookId,
    stockType: "rental",
    amount: -1,
    reason: "loan",
    changedBy: req.user.id,
  });
  await book.save();

  res.status(201).json({ loan, message: "Loan created successfully" });
});

export const returnLoan = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const loan = await Loan.findById(id);
  if (!loan) {
    throw new CustomError("Loan not found", 404);
  }

  if (loan.user.toString() !== req.user.id && req.user.role !== "admin") {
    throw new CustomError("You can only return your own borrowed books", 403);
  }

  if (loan.status === "returned") {
    throw new CustomError("This book has already been returned", 400);
  }

  loan.status = "returned";
  loan.returnedAt = new Date();
  await loan.save();

  const book = await Book.findById(loan.book);
  book.rentalStock += 1;
  await StockLog.create({
    book: loan.book,
    stockType: "rental",
    amount: 1,
    reason: "return",
    changedBy: req.user.id,
  });
  await book.save();

  res.status(200).json({ loan, message: "Book returned successfully" });
});
