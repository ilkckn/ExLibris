import { CustomError } from "../utils/errorHandler.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

export const auth = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new CustomError("Not authorized, token missing", 401);
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new CustomError("Session expired, please login again", 401);
    }
    throw new CustomError("Invalid token", 401);
  }
});

export const admin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    throw new CustomError("Not authorized as an admin", 403);
  }
});
