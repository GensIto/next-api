import type { NextPage } from "next";
import { useState } from "react";
import { Data } from "../db";

const Home: NextPage = () => {
  const [title, setTitle] = useState("");
  const [pages, setPages] = useState("");
  const [lan, setLan] = useState("");
  const [books, setBooks] = useState([]);

  const deleteBook = async (bookId: any) => {
    const response = await fetch(`/api/books/${bookId}`, {
      method: "DELETE",
    });
    const data = await response.json();
    console.log(data);
    setBooks(data);
  };

  const fetchBooks = async () => {
    const response = await fetch("/api/books");
    const data = await response.json();
    setBooks(data);
  };

  const submitBook = async () => {
    const response = await fetch("/api/books", {
      method: "POST",
      body: JSON.stringify({
        title,
        pages,
        language: lan,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);
    setTitle("");
    setPages("");
    setLan("");
  };
  return (
    <>
      <div>
        {"Title: "}
        <input
          type='text'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        {"Pages: "}
        <input
          type='text'
          value={pages}
          onChange={(e) => setPages(e.target.value)}
        />
        <br />
        {"Language: "}
        <input
          type='text'
          value={lan}
          onChange={(e) => setLan(e.target.value)}
        />
        <br />
        <button onClick={submitBook}>Submit book</button>
      </div>{" "}
      <br />
      <br /> <br />
      <div>
        <button onClick={fetchBooks}>Get the latest books</button>
      </div>{" "}
      {books.map((book: Data) => {
        return (
          <div key={book.id}>
            {book.id}.<br />
            {"Title: "}
            {book.title}.<br />
            {"Pages: "} {book.pages}.<br />
            {"Language: "}
            {book.language} <br />
            <button onClick={() => deleteBook(book.id)}>Delete</button>
            <hr />
          </div>
        );
      })}{" "}
    </>
  );
};

export default Home;
