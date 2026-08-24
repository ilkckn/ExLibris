import User from "../schemas/userSchema.js";
import { CustomError } from "../utils/errorHandler.js";
import asyncHandler from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

export const getAllUser = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json({ users, message: "Users retrieved successfully" });
});

export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select("-password");
  if (!user) {
    throw new CustomError("User not found", 404);
  }
  if (req.user.id !== id && req.user.role !== "admin") {
    throw new CustomError("You can only update your own account", 403);
  }
  res.status(200).json({ user, message: "User retrieved successfully" });
});

export const createUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, address, age, userName } =
    req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new CustomError("User with this email already exists", 400);
  }
  const existingUserName = await User.findOne({ userName });
  if (existingUserName) {
    throw new CustomError("This username is already taken", 400);
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    firstName,
    lastName,
    email,
    userName,
    password: hashedPassword,
    address,
    age,
  });

  generateTokenAndSetCookie(res, user);

  res.status(201).json({ user, message: "User created successfully" });
});

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, password, address, age, userName } =
    req.body;
  const updateData = { firstName, lastName, email, userName, address, age };
  if (password) {
    updateData.password = await bcrypt.hash(password, 12);
  }
  if (req.user.id !== id && req.user.role !== "admin") {
    throw new CustomError("You can only update your own account", 403);
  }
  const user = await User.findByIdAndUpdate(id, updateData, { new: true }).select("-password");
  if (!user) {
    throw new CustomError("User not found", 404);
  }
  res.status(200).json({ user, message: "User updated successfully" });
});

export const deactivateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (req.user.id !== id && req.user.role !== "admin") {
    throw new CustomError("You can only update your own account", 403);
  }
  const user = await User.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true },
  ).select("-password");
  if (!user) {
    throw new CustomError("User not found", 404);
  }

  if (req.user.id === id) {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      path: "/",
    });
  }

  res.status(200).json({ message: "Account deactivated successfully" });
});

export const reactivateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(
    id,
    { isActive: true },
    { new: true },
  ).select("-password");

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  res.status(200).json({ user, message: "Account reactivated successfully" });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new CustomError("User not found", 404);
  }
  res.status(200).json({ message: "User deleted successfully" });
});

import jwt from "jsonwebtoken";

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError("Invalid email or password", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new CustomError("Invalid email or password", 401);
  }

  if (!user.isActive) {
    throw new CustomError(
      "This account has been deactivated. Please contact support to reactivate.",
      403,
    );
  }

  generateTokenAndSetCookie(res, user);

  res.status(200).json({ user, message: "Login successful" });
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 0,
    path: "/",
  });
  res.status(200).json({ message: "Logout successful" });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) {
    throw new CustomError("User not found", 404);
  }
  res.status(200).json({
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age,
      email: user.email,
      userName: user.userName,
      role: user.role,
    },
    message: "Current user retrieved successfully",
  });
});
