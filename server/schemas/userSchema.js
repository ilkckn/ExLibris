import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      postcode: { type: String, trim: true },
      country: { type: String, trim: true },
    },
    age: {
      type: Number,
      min: 16,
    },
    avatar: {
      type: String,
      trim: true,
      default:
        "https://res.cloudinary.com/dxjv7gq0f/image/upload/v1690911871/avatars/default-avatar.png",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    favorites: [{ type: Schema.Types.ObjectId, ref: "Book" }],
  },
  { timestamps: true },
);

export default model("User", userSchema);
