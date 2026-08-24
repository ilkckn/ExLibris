import mongoose from "mongoose";
import dotenv from "dotenv";
import Author from "../schemas/authorSchema.js";

dotenv.config();

const authors = [
  {
    name: "J.R.R. Tolkien",
    bio: "English writer, poet, and philologist, best known as the author of The Hobbit and The Lord of the Rings. A professor at Oxford, his work laid the foundation for modern fantasy literature.",
    birthYear: 1892,
    deathYear: 1973,
    birthPlace: "Bloemfontein, Orange Free State (South Africa)",
    livedIn: ["Birmingham, England", "Oxford, England"],
    nationality: "British",
    notableWorks: ["The Hobbit", "The Lord of the Rings", "The Silmarillion"],
  },
  {
    name: "George Orwell",
    bio: "English novelist, essayist, and journalist, known for his lucid prose and his novels 1984 and Animal Farm, which explore totalitarianism and social injustice.",
    birthYear: 1903,
    deathYear: 1950,
    birthPlace: "Motihari, Bengal Presidency (British India)",
    livedIn: ["Burma", "Paris, France", "London, England", "Jura, Scotland"],
    nationality: "British",
    notableWorks: ["1984", "Animal Farm", "Homage to Catalonia"],
  },
  {
    name: "Jane Austen",
    bio: "English novelist known for her wit, social commentary, and keen observation of the British landed gentry, author of Pride and Prejudice and Emma.",
    birthYear: 1775,
    deathYear: 1817,
    birthPlace: "Steventon, Hampshire, England",
    livedIn: ["Bath, England", "Chawton, England"],
    nationality: "British",
    notableWorks: ["Pride and Prejudice", "Sense and Sensibility", "Emma"],
  },
  {
    name: "Gabriel García Márquez",
    bio: "Colombian novelist and journalist, awarded the Nobel Prize in Literature in 1982. A pioneer of the magical realism genre, best known for One Hundred Years of Solitude.",
    birthYear: 1927,
    deathYear: 2014,
    birthPlace: "Aracataca, Colombia",
    livedIn: ["Bogotá, Colombia", "Paris, France", "Mexico City, Mexico"],
    nationality: "Colombian",
    notableWorks: ["One Hundred Years of Solitude", "Love in the Time of Cholera"],
  },
  {
    name: "Franz Kafka",
    bio: "German-speaking Bohemian novelist and short-story writer, widely regarded as a major figure of 20th-century literature, known for The Metamorphosis and The Trial.",
    birthYear: 1883,
    deathYear: 1924,
    birthPlace: "Prague, Austria-Hungary (now Czech Republic)",
    livedIn: ["Prague, Austria-Hungary"],
    nationality: "Austro-Hungarian",
    notableWorks: ["The Metamorphosis", "The Trial", "The Castle"],
  },
  {
    name: "Virginia Woolf",
    bio: "English writer, considered one of the foremost modernist literary figures of the 20th century, known for her stream-of-consciousness technique.",
    birthYear: 1882,
    deathYear: 1941,
    birthPlace: "London, England",
    livedIn: ["London, England", "Sussex, England"],
    nationality: "British",
    notableWorks: ["Mrs Dalloway", "To the Lighthouse", "Orlando"],
  },
  {
    name: "Fyodor Dostoevsky",
    bio: "Russian novelist and philosopher, known for his deep psychological exploration of the human condition, author of Crime and Punishment.",
    birthYear: 1821,
    deathYear: 1881,
    birthPlace: "Moscow, Russian Empire",
    livedIn: ["Saint Petersburg, Russian Empire", "Siberia (exile)"],
    nationality: "Russian",
    notableWorks: ["Crime and Punishment", "The Brothers Karamazov", "The Idiot"],
  },
  {
    name: "Leo Tolstoy",
    bio: "Russian writer regarded as one of the greatest authors of all time, known for his epic novels War and Peace and Anna Karenina.",
    birthYear: 1828,
    deathYear: 1910,
    birthPlace: "Yasnaya Polyana, Russian Empire",
    livedIn: ["Yasnaya Polyana, Russian Empire", "Moscow, Russian Empire"],
    nationality: "Russian",
    notableWorks: ["War and Peace", "Anna Karenina"],
  },
  {
    name: "Ernest Hemingway",
    bio: "American novelist and short-story writer known for an economical, understated style. Winner of the Nobel Prize in Literature in 1954.",
    birthYear: 1899,
    deathYear: 1961,
    birthPlace: "Oak Park, Illinois, United States",
    livedIn: ["Paris, France", "Key West, Florida", "Havana, Cuba"],
    nationality: "American",
    notableWorks: ["The Old Man and the Sea", "A Farewell to Arms", "The Sun Also Rises"],
  },
  {
    name: "Agatha Christie",
    bio: "English writer known primarily for her 66 detective novels, especially those featuring Hercule Poirot and Miss Marple. The best-selling novelist of all time.",
    birthYear: 1890,
    deathYear: 1976,
    birthPlace: "Torquay, Devon, England",
    livedIn: ["Devon, England", "London, England"],
    nationality: "British",
    notableWorks: ["Murder on the Orient Express", "And Then There Were None"],
  },
  {
    name: "Haruki Murakami",
    bio: "Japanese writer known for blending surrealism, pop culture, and melancholic introspection in novels such as Norwegian Wood and Kafka on the Shore.",
    birthYear: 1949,
    deathYear: null,
    birthPlace: "Kyoto, Japan",
    livedIn: ["Tokyo, Japan", "Boston, United States"],
    nationality: "Japanese",
    notableWorks: ["Norwegian Wood", "Kafka on the Shore", "1Q84"],
  },
  {
    name: "Toni Morrison",
    bio: "American novelist and essayist, awarded the Nobel Prize in Literature in 1993. Known for exploring the African-American experience in works like Beloved.",
    birthYear: 1931,
    deathYear: 2019,
    birthPlace: "Lorain, Ohio, United States",
    livedIn: ["New York, United States"],
    nationality: "American",
    notableWorks: ["Beloved", "Song of Solomon"],
  },
  {
    name: "Mark Twain",
    bio: "American writer, humorist, and lecturer, celebrated for The Adventures of Tom Sawyer and its sequel, Adventures of Huckleberry Finn.",
    birthYear: 1835,
    deathYear: 1910,
    birthPlace: "Florida, Missouri, United States",
    livedIn: ["Hannibal, Missouri", "Hartford, Connecticut"],
    nationality: "American",
    notableWorks: ["Adventures of Huckleberry Finn", "The Adventures of Tom Sawyer"],
  },
  {
    name: "Emily Brontë",
    bio: "English novelist and poet, best remembered for her only novel, Wuthering Heights, now considered a classic of English literature.",
    birthYear: 1818,
    deathYear: 1848,
    birthPlace: "Thornton, Yorkshire, England",
    livedIn: ["Haworth, Yorkshire, England"],
    nationality: "British",
    notableWorks: ["Wuthering Heights"],
  },
  {
    name: "Albert Camus",
    bio: "French philosopher, author, and journalist, awarded the Nobel Prize in Literature in 1957. Closely associated with absurdism.",
    birthYear: 1913,
    deathYear: 1960,
    birthPlace: "Mondovi, French Algeria",
    livedIn: ["Algiers, French Algeria", "Paris, France"],
    nationality: "French",
    notableWorks: ["The Stranger", "The Plague", "The Myth of Sisyphus"],
  },
  {
    name: "Charles Dickens",
    bio: "English writer and social critic, considered the greatest novelist of the Victorian era, creator of some of the world's best-known fictional characters.",
    birthYear: 1812,
    deathYear: 1870,
    birthPlace: "Portsmouth, England",
    livedIn: ["London, England", "Kent, England"],
    nationality: "British",
    notableWorks: ["Great Expectations", "Oliver Twist", "A Tale of Two Cities"],
  },
  {
    name: "Isabel Allende",
    bio: "Chilean-American writer known for novels that often incorporate elements of magical realism, most notably The House of the Spirits.",
    birthYear: 1942,
    deathYear: null,
    birthPlace: "Lima, Peru",
    livedIn: ["Santiago, Chile", "Caracas, Venezuela", "California, United States"],
    nationality: "Chilean",
    notableWorks: ["The House of the Spirits", "Of Love and Shadows"],
  },
  {
    name: "Kurt Vonnegut",
    bio: "American writer known for blending satire, science fiction, and dark humor, most famously in Slaughterhouse-Five.",
    birthYear: 1922,
    deathYear: 2007,
    birthPlace: "Indianapolis, Indiana, United States",
    livedIn: ["Cape Cod, Massachusetts", "New York, United States"],
    nationality: "American",
    notableWorks: ["Slaughterhouse-Five", "Cat's Cradle"],
  },
  {
    name: "J.K. Rowling",
    bio: "British author, philanthropist, and screenwriter, best known for writing the Harry Potter fantasy series.",
    birthYear: 1965,
    deathYear: null,
    birthPlace: "Yate, Gloucestershire, England",
    livedIn: ["Edinburgh, Scotland", "Porto, Portugal"],
    nationality: "British",
    notableWorks: ["Harry Potter series", "The Casual Vacancy"],
  },
  {
    name: "Orhan Pamuk",
    bio: "Turkish novelist, screenwriter, and academic, awarded the Nobel Prize in Literature in 2006. Known for exploring the clash between Eastern and Western identity.",
    birthYear: 1952,
    deathYear: null,
    birthPlace: "Istanbul, Turkey",
    livedIn: ["Istanbul, Turkey", "New York, United States"],
    nationality: "Turkish",
    notableWorks: ["My Name is Red", "Snow", "The Museum of Innocence"],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB");

    await Author.deleteMany({});
    const result = await Author.insertMany(authors);

    console.log(`${result.length} authors inserted successfully`);
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();