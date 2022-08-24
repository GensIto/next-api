export type Data = {
  id: number;
  title: string;
  pages: number;
  language: string;
};
export const booksDB: Data[] = [
  {
    id: 1,
    title: "Things fall apart",
    pages: 209,
    language: "English",
  },
  {
    id: 2,
    title: "Fairy tails",
    pages: 784,
    language: "Danish",
  },
  {
    id: 3,
    title: "The book of Job",
    pages: 176,
    language: "Hebrew",
  },
  {
    id: 4,
    title: "Pride and Prejudice",
    pages: 443,
    language: "French",
  },
];
