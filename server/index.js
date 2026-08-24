import "./db/index.js";
import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import readingListRoutes from "./routes/readingListRoutes.js";
import loanRoutes from "./routes/loanRoutes.js";
import stockLogRoutes from "./routes/stockLogRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import authorRoutes from "./routes/authorRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
  json({ limit: "50mb" }),
  cookieParser(),
);

app.use("/api", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/reading-list", readingListRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/stock-logs", stockLogRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/authors", authorRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the server!");
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`✅ Server is 🏃 on port ${PORT}`);
});
