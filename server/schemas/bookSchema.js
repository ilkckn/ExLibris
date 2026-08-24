import { Schema, model } from "mongoose";

const bookSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: Schema.Types.ObjectId, ref: "Author", required: true },
    isbn: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    coverImage: {
      type: String,
      trim: true,
      default:
        "https://res.cloudinary.com/dxjv7gq0f/image/upload/v1690911871/books/default-cover.png",
    },
    genre: { type: [String], default: [] },
    language: { type: String, default: "Almanca" },
    publishedYear: { type: Number },
    publisher: { type: String, trim: true },
    pageCount: { type: Number, min: 1 },
    price: { type: Number, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    rentalStock: { type: Number, default: 0, min: 0 },
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    addedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default model("Book", bookSchema);