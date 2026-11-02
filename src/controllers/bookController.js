const {
  createBook,
  deleteBook,
  findBookById,
  getBooks,
  updateBook,
} = require("../data/books");

function validateBookDetails(details, isPartial = false) {
  if (!details || typeof details !== "object" || Array.isArray(details)) {
    return "Request body must be a JSON object";
  }

  const fields = ["title", "author", "isbn", "publishedYear", "totalCopies"];
  const allowedFields = new Set(fields);
  const unknownField = Object.keys(details).find((field) => !allowedFields.has(field));

  if (unknownField) {
    return `Unknown field: ${unknownField}`;
  }

  if (!isPartial && fields.some((field) => details[field] === undefined)) {
    return "title, author, isbn, publishedYear, and totalCopies are required";
  }

  for (const field of ["title", "author", "isbn"]) {
    if (details[field] !== undefined) {
      if (typeof details[field] !== "string" || details[field].trim() === "") {
        return `${field} must be a non-empty string`;
      }
    }
  }

  if (details.publishedYear !== undefined) {
    const currentYear = new Date().getFullYear();
    if (
      !Number.isInteger(details.publishedYear) ||
      details.publishedYear < 0 ||
      details.publishedYear > currentYear
    ) {
      return `publishedYear must be an integer between 0 and ${currentYear}`;
    }
  }

  if (
    details.totalCopies !== undefined &&
    (!Number.isInteger(details.totalCopies) || details.totalCopies < 0)
  ) {
    return "totalCopies must be a non-negative integer";
  }

  return null;
}

function listBooks(req, res) {
  const books = getBooks();
  return res.status(200).json({
    count: books.length,
    message: books.length === 0 ? "No books found" : undefined,
    books,
  });
}

function getBook(req, res) {
  const book = findBookById(req.params.id);
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  return res.status(200).json(book);
}

function addBook(req, res) {
  const validationError = validateBookDetails(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const book = createBook(req.body);
  return res.status(201).json(book);
}

function editBook(req, res) {
  const validationError = validateBookDetails(req.body, true);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "Provide at least one book detail to update" });
  }

  const book = findBookById(req.params.id);
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  const issuedCopies = book.totalCopies - book.availableCopies;
  if (req.body.totalCopies !== undefined && req.body.totalCopies < issuedCopies) {
    return res.status(400).json({
      message: `totalCopies cannot be less than the ${issuedCopies} copies currently issued`,
    });
  }

  return res.status(200).json(updateBook(book, req.body));
}

function removeBook(req, res) {
  const book = findBookById(req.params.id);
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  if (book.availableCopies !== book.totalCopies) {
    return res.status(409).json({
      message: "Book cannot be deleted while copies are issued",
    });
  }

  deleteBook(book);
  return res.status(200).json({ message: "Book deleted successfully" });
}

function searchBooks(req, res) {
  const query = typeof req.query.q === "string" ? req.query.q.trim().toLowerCase() : "";
  if (!query) {
    return res.status(400).json({ message: "Provide a search term with the q parameter" });
  }

  const books = getBooks().filter((book) =>
    [book.title, book.author, book.isbn].some((value) =>
      value.toLowerCase().includes(query),
    ),
  );
  return res.status(200).json({ count: books.length, books });
}

function issueBook(req, res) {
  const book = findBookById(req.params.id);
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  if (book.availableCopies === 0) {
    return res.status(409).json({ message: "No available copies to issue" });
  }

  book.availableCopies -= 1;
  return res.status(200).json({
    message: "Book issued successfully",
    book,
  });
}

function returnBook(req, res) {
  const book = findBookById(req.params.id);
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  if (book.availableCopies === book.totalCopies) {
    return res.status(409).json({ message: "No issued copies to return" });
  }

  book.availableCopies += 1;
  return res.status(200).json({
    message: "Book returned successfully",
    book,
  });
}

module.exports = {
  addBook,
  editBook,
  getBook,
  issueBook,
  listBooks,
  removeBook,
  returnBook,
  searchBooks,
};
