import { Schema, model } from "mongoose";

const authorSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    bio: { type: String, trim: true },
    photo: {
      type: String,
      trim: true,
      default:
        "https://res.cloudinary.com/dxjv7gq0f/image/upload/v1690911871/authors/default-author.png",
    },
    birthYear: { type: Number },
    deathYear: { type: Number, default: null }, // hayattaysa null kalır
    birthPlace: { type: String, trim: true },
    livedIn: { type: [String], default: [] }, // yaşadığı yerler, birden fazla olabilir
    nationality: { type: String, trim: true },
    notableWorks: { type: [String], default: [] }, // en bilinen eserleri (isim olarak, Book referansı değil)
  },
  { timestamps: true }
);

export default model("Author", authorSchema);