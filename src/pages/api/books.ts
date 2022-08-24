// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
// 仮装のデータベース
import { booksDB } from "../../db";
import { Data } from "../../db";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data[]>
) {
  if (req.method === "GET") {
    res.status(200).json(booksDB);
  } else if (req.method === "POST") {
    const title = req.body.title;
    const pages = req.body.pages;
    const language = req.body.language;
    const newBook = {
      id: booksDB.length + 1,
      title,
      pages,
      language,
    };
    booksDB.push(newBook);
    res.status(201).json(booksDB);
  }
}
