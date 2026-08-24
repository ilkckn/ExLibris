import { Schema, model } from "mongoose";

const readingListSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    status: {
      type: String,
      enum: ["want-to-read", "reading", "read"],
      default: "want-to-read",
    },
  },
  { timestamps: true }
);

readingListSchema.index({ user: 1, book: 1 }, { unique: true });

export default model("ReadingList", readingListSchema);