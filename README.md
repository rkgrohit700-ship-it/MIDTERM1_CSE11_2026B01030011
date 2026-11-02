# MIDTERM1_CSE11_2026B01030011

# Library Management REST API

A simple library management API built with Node.js and Express. Book data is
stored in memory, so it resets whenever the server restarts. This project does
not use a database, MongoDB, Mongoose, React, or authentication.

## Folder structure

```text
MIDTERM1_CSE11_2026B01030011/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── controllers/
│   │   └── bookController.js
│   ├── data/
│   │   └── books.js
│   └── routes/
│       └── bookRoutes.js
├── .gitignore
├── package.json
└── package-lock.json
```

## Setup and run

Clone the repository, open a terminal in the project folder, install
dependencies, and start the server:

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
curl -X DELETE http://localhost:3000/api/books/1
```

## Tasks 5–7: delete, search, issue, and return

- **Delete a book:** `DELETE /api/books/:id`. The API returns `404` if the book
  does not exist. A book with copies currently issued cannot be deleted and
  returns `409`.
- **Search books:** `GET /api/books/search?q=hobbit`. Search is
  case-insensitive and checks the title, author, and ISBN. The response
  includes the matching-book count and list.
- **Issue a copy:** `POST /api/books/:id/issue`. Each request issues one copy;
  the available-copy count decreases by one. If no copies are available, the
  API returns `409`.
- **Return a copy:** `POST /api/books/:id/return`. Each request returns one
  copy; the available-copy count increases by one. If no copies are currently
  issued, the API returns `409`.

Invalid input returns `400`, and requests for missing books return `404`.