import mongoose from "mongoose";
import dotenv from "dotenv";
import Author from "../schemas/authorSchema.js";
import Book from "../schemas/bookSchema.js";

dotenv.config();

const booksData = [
  {
    authorName: "J.R.R. Tolkien",
    title: "The Hobbit",
    isbn: "978-0-618-00221-4",
    description: "A reluctant hobbit sets out on an unexpected journey to help a group of dwarves reclaim their mountain home from a dragon.",
    genre: ["Fantasy"],
    language: "English",
    publishedYear: 1937,
    publisher: "George Allen & Unwin",
    pageCount: 310,
    price: 15,
    stock: 10,
    rentalStock: 4,
  },
  {
    authorName: "George Orwell",
    title: "1984",
    isbn: "978-3-548-23410-3",
    description: "A dystopian social science fiction novel exploring totalitarianism, mass surveillance, and repressive regimentation.",
    genre: ["Bilim Kurgu"],
    language: "English",
    publishedYear: 1949,
    publisher: "Secker & Warburg",
    pageCount: 328,
    price: 14.99,
    stock: 8,
    rentalStock: 3,
  },
  {
    authorName: "George Orwell",
    title: "Animal Farm",
    isbn: "978-0-451-52634-2",
    description: "A satirical allegorical novella reflecting events leading up to the Russian Revolution and the Stalinist era.",
    genre: ["Roman"],
    language: "English",
    publishedYear: 1945,
    publisher: "Secker & Warburg",
    pageCount: 112,
    price: 10,
    stock: 12,
    rentalStock: 5,
  },
  {
    authorName: "Jane Austen",
    title: "Pride and Prejudice",
    isbn: "978-0-14-143951-8",
    description: "A romantic novel following Elizabeth Bennet as she navigates issues of manners, upbringing, morality, and marriage.",
    genre: ["Roman"],
    language: "English",
    publishedYear: 1813,
    publisher: "T. Egerton",
    pageCount: 279,
    price: 12,
    stock: 9,
    rentalStock: 4,
  },
  {
    authorName: "Gabriel García Márquez",
    title: "One Hundred Years of Solitude",
    isbn: "978-0-06-088328-7",
    description: "The multi-generational story of the Buendía family, chronicling the rise and fall of the fictional town of Macondo.",
    genre: ["Roman"],
    language: "English",
    publishedYear: 1967,
    publisher: "Harper & Row",
    pageCount: 417,
    price: 16,
    stock: 6,
    rentalStock: 2,
  },
  {
    authorName: "Franz Kafka",
    title: "The Metamorphosis",
    isbn: "978-0-8129-6543-1",
    description: "A traveling salesman wakes up one morning to find himself transformed into a giant insect.",
    genre: ["Roman"],
    language: "English",
    publishedYear: 1915,
    publisher: "Kurt Wolff Verlag",
    pageCount: 96,
    price: 9,
    stock: 11,
    rentalStock: 5,
  },
  {
    authorName: "Fyodor Dostoevsky",
    title: "Crime and Punishment",
    isbn: "978-0-14-044913-6",
    description: "The psychological drama of Raskolnikov, a poor ex-student who murders a pawnbroker for money, and his subsequent guilt.",
    genre: ["Roman"],
    language: "English",
    publishedYear: 1866,
    publisher: "The Russian Messenger",
    pageCount: 671,
    price: 18,
    stock: 7,
    rentalStock: 3,
  },
  {
    authorName: "Ernest Hemingway",
    title: "The Old Man and the Sea",
    isbn: "978-0-684-80122-3",
    description: "An aging fisherman's epic battle with a giant marlin far out in the Gulf Stream.",
    genre: ["Roman"],
    language: "English",
    publishedYear: 1952,
    publisher: "Charles Scribner's Sons",
    pageCount: 127,
    price: 11,
    stock: 10,
    rentalStock: 4,
  },
  {
    authorName: "Agatha Christie",
    title: "Murder on the Orient Express",
    isbn: "978-0-06-269336-4",
    description: "Detective Hercule Poirot investigates a murder aboard the famous Orient Express train.",
    genre: ["Polisiye"],
    language: "English",
    publishedYear: 1934,
    publisher: "Collins Crime Club",
    pageCount: 256,
    price: 13,
    stock: 9,
    rentalStock: 4,
  },
  {
    authorName: "Haruki Murakami",
    title: "Norwegian Wood",
    isbn: "978-0-375-70402-3",
    description: "A nostalgic story of loss and burgeoning sexuality set in late 1960s Tokyo.",
    genre: ["Roman"],
    language: "English",
    publishedYear: 1987,
    publisher: "Kodansha",
    pageCount: 296,
    price: 15,
    stock: 8,
    rentalStock: 3,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB");

    for (const bookData of booksData) {
      const { authorName, ...rest } = bookData;

      const author = await Author.findOne({ name: authorName });
      if (!author) {
        console.log(`⚠️  Author not found: ${authorName}, skipping "${rest.title}"`);
        continue;
      }

      const existingBook = await Book.findOne({ isbn: rest.isbn });
      if (existingBook) {
        console.log(`⚠️  Book already exists: ${rest.title}, skipping`);
        continue;
      }

      await Book.create({
        ...rest,
        author: author._id,
      });

      console.log(`✅ Added: ${rest.title} by ${authorName}`);
    }

    console.log("Seeding complete");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();