# MIDTERM1_CSE11_2026B01030011

# Library Management REST API

A simple library management API built with Node.js and Express. Book data is
stored in memory, so it resets whenever the server restarts. This project does
not use a database, MongoDB, Mongoose, React, or authentication.

## Folder structure

```text
midterm1/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── controllers/
│   │   └── bookController.js
│   ├── data/
│   │   └── books.js
│   └── routes/
│       └── bookRoutes.js
├── MIDTERM1_CSE11_2026B01030011/
│   └── README.md
├── .gitignore
├── package.json
└── package-lock.json
```

## Setup and run

Install dependencies and start the server:

```bash
npm install
npm start
```

The server runs at `http://localhost:3000`. The app uses the
`express.json()` middleware to parse JSON request bodies. For development with
Node.js watch mode, run `npm run dev`.

## API endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/books` | Add a book |
| `GET` | `/api/books` | Retrieve all books (returns an empty list and message when none exist) |
| `GET` | `/api/books/:id` | Retrieve one book |
| `PUT` | `/api/books/:id` | Update one or more book details |
| `DELETE` | `/api/books/:id` | Delete a book if no copies are issued |
| `GET` | `/api/books/search?q=term` | Search title, author, or ISBN |
| `POST` | `/api/books/:id/issue` | Issue one available copy |
| `POST` | `/api/books/:id/return` | Return one issued copy |

### Add a book

Send a JSON body to `POST /api/books`:

```json
{
  "title": "The Hobbit",
  "author": "J. R. R. Tolkien",
  "isbn": "9780547928227",
  "publishedYear": 1937,
  "totalCopies": 4
}
```

New books receive a numeric `id`; `availableCopies` starts at `totalCopies`.
Only `title`, `author`, `isbn`, `publishedYear`, and `totalCopies` can be
changed with `PUT`. Issuing and returning affect one copy per request.

### Example requests

```bash
curl -X POST http://localhost:3000/api/books ^
  -H "Content-Type: application/json" ^
  -d "{\"title\":\"The Hobbit\",\"author\":\"J. R. R. Tolkien\",\"isbn\":\"9780547928227\",\"publishedYear\":1937,\"totalCopies\":4}"

curl http://localhost:3000/api/books
curl http://localhost:3000/api/books/1
curl "http://localhost:3000/api/books/search?q=hobbit"
curl -X POST http://localhost:3000/api/books/1/issue
curl -X POST http://localhost:3000/api/books/1/return
```

Use the corresponding `PUT` and `DELETE` methods on `/api/books/:id` to edit
and remove a book. Invalid input returns `400`, missing books return `404`,
and operations that conflict with copy availability return `409`.