import { Schema, model } from "mongoose";

const stockLogSchema = new Schema({
  book: { type: Schema.Types.ObjectId, ref: "Book" },
  stockType: { type: String, enum: ["rental", "sale"], required: true },
  amount: { type: Number, required: true }, // burada amount saklanır
  reason: { type: String }, // "restock", "sale", "damage" gibi
  changedBy: { type: Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export default model("StockLog", stockLogSchema);