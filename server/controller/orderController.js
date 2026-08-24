import asyncHandler from "../utils/asyncHandler.js";
import { CustomError } from "../utils/errorHandler.js";
import Order from "../schemas/orderSchema.js";
import Book from "../schemas/bookSchema.js";
import StockLog from "../schemas/stockLogSchema.js";

export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("user", "firstName lastName email address")
    .populate("items.book", "title author price");
  res.status(200).json({ orders, message: "Orders retrieved successfully" });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id)
    .populate("user", "firstName lastName email address")
    .populate("items.book", "title author price");

  if (!order) {
    throw new CustomError("Order not found", 404);
  }

  if (order.user._id.toString() !== req.user.id && req.user.role !== "admin") {
    throw new CustomError("You can only view your own orders", 403);
  }

  res.status(200).json({ order, message: "Order retrieved successfully" });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).populate(
    "items.book",
    "title author price",
  );
  res.status(200).json({ orders, message: "Orders retrieved successfully" });
});

export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress } = req.body;

  const orders = await Promise.all(
    items.map(async (item) => {
      const book = await Book.findById(item.book);
      if (!book) {
        throw new CustomError(`Book with ID ${item.book} not found`, 404);
      }
      if (book.stock < item.quantity) {
        throw new CustomError(`Not enough stock for book ${book.title}`, 400);
      }
      book.stock -= item.quantity;
      await StockLog.create({
        book: book._id,
        stockType: "sale",
        amount: -item.quantity,
        reason: "order",
        changedBy: req.user.id,
      });
      await book.save();

      return {
        book: book._id,
        quantity: item.quantity,
        priceAtPurchase: book.price,
      };
    }),
  );
  const totalPrice = orders.reduce(
    (acc, item) => acc + item.priceAtPurchase * item.quantity,
    0,
  );
  const order = await Order.create({
    user: req.user.id,
    items: orders,
    totalPrice,
    shippingAddress,
  });
  res.status(201).json({ order, message: "Order created successfully" });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["pending", "shipped", "delivered", "cancelled"];
  if (!validStatuses.includes(status)) {
    throw new CustomError("Invalid order status", 400);
  }

  const order = await Order.findById(id);
  if (!order) {
    throw new CustomError("Order not found", 404);
  }

  order.status = status;
  await order.save();

  res.status(200).json({ order, message: "Order status updated successfully" });
});
