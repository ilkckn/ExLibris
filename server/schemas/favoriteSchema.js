import { Schema, model } from "mongoose";

const favoriteSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
  },
  { timestamps: true }
);

favoriteSchema.index({ user: 1, book: 1 }, { unique: true });

export default model("Favorite", favoriteSchema);