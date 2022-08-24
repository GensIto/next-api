# nextjs の apiRoutes は何ができるの?

nextjs の apiRoutes についての情報が少なすぎて何ができるか全く掴めなかったので同じように疑問に感じた方のために書き記します

### やんわり知っていたこと

- json を返せる

  - ```export default async function handler(req, res) {
      const response = await fetch('https://jsonplaceholder.typicode.com/users/')
      const users = await response.json()
      res.status(200).json({ users })
    }
    ```
    こんなんで概要掴めるかぁ!

- サーバレスに api にアクセスできる
- Dynamic API Routes に対応しており個別にもアクセスできる
- HTTP メゾットにも対応している

この程度の認知でした。ぶっちゃけエンジニアペーペーの僕には全く意味がわかりません。
体育会系方式まずやってみるで少し理解できたので考えたことやったことについて書いていきます

[参考記事](https://www.topcoder.com/thrive/articles/api-routes-for-next-js)

#### GET

まず front 部分

```
const fetchBooks = async () => {
  const response = await fetch("/api/books");
  const data = await response.json();
  setBooks(data);
};
```

定番の非同期で api フォルダにリクエストし帰ってきた data を json にし
useState で宣言した配列に data を入れました

back 部分

```
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
```

まずフィイルをすっきりさせるために元々あるデータを定義し分割しました。

```
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
```

front からきた method を受け取り条件分岐しています.
GET なら今あるデータの json を返します

### POST

front 部分

```
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
  setTitle("");
  setPages("");
  setLan("");
};
```

method は POST
body,headers の理解は薄いですが
body: JSON.stringify は送るデータを json 化
headers は雛形

back 上記の POST とかぶります....

```
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
```

リクエスト Body から各項目を受け取り、各項目が入ったオブジェクト?を定義し
push で booksDB に追加

### DELETE

DELETE に関しては個別に処理する必要があるので Dynamic API Routes を使用する必要がある

front

```
const deleteBook = async (bookId: any) => {
  const response = await fetch(`/api/books/${bookId}`, {
    method: "DELETE",
  });
  const data = await response.json();
  console.log(data);
  setBooks(data);
};
```

引数で押されたボタンの id から api フォルダのダイナミックルートにアクセス
帰ってきた data を配列に代入する

back

```
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
```

個別で GET もできるようにもしている

```
const book = booksDB.find((book) => book.id === parseInt(bookId));
```

配列から条件に合っているものを探すのには find が便利
parseInt(x)は文字列の引数を整数値を返すらしい。もし送られてきた bookId が文字列の"1"でも 1 にさせるために使っていそう
GET なら find できた data の json を返す

DELETE の時は

```
const index = booksDB.findIndex((book) => book.id === parseInt(bookId));
```

findIndex は配列内の指定されたテスト関数に合格する最初の要素の位置を返します。テスト関数に合格する要素がない場合を含め、それ以外の場合は -1 を返すらしい。find でも良さそうだけど試してはいません とりあえず上記の GET と同じように条件に当てはまった data を抽出している

その data を

```
booksDB.splice(index, 1);
```

で削除し

```
res.status(200).json(booksDB);
```

で front へ booksDB に残っている data を返す

### まとめ

- 初めてしっかりめに api フォルダを使いました。
  体感としては初めて rails で簡単な api を作成した時のように簡単に作れ、簡単な rest api なら next で
  作成できると感じました。
- api フォルダはサーバー側?で動いていそうなので、クライアント側にデータを提供するにはクッキーなどを使いそう(ローカル,セッションストレージには入れられなかった..api の中でしようとしたので front に帰ってきた data ならできるかも?)
- バックエンドて難しい.....
- なんか nestJS に興味が湧いた
- 今回は参考記事に PUT がなかったので実装はしていませんが、PUT までもできたら簡単なアプリケーションなら nestjs のみで作れる！！！！！

終わり
