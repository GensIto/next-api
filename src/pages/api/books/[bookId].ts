import { booksDB } from "../../../db";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { bookId }: any = req.query;
  if (req.method === "GET") {
    const book = booksDB.find((book) => book.id === parseInt(bookId));
    res.status(200).json(book);
  } else if (req.method === "DELETE") {
    const index = booksDB.findIndex((book) => book.id === parseInt(bookId));
    booksDB.splice(index, 1);
    res.status(200).json(booksDB);
  }
}
