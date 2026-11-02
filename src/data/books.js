const books = [];
let nextBookId = 1;

function getBooks() {
  return books;
}

function createBook(bookDetails) {
  const book = {
    id: nextBookId++,
    title: bookDetails.title.trim(),
    author: bookDetails.author.trim(),
    isbn: bookDetails.isbn.trim(),
    publishedYear: bookDetails.publishedYear,
    totalCopies: bookDetails.totalCopies,
    availableCopies: bookDetails.totalCopies,
  };

  books.push(book);
  return book;
}

function findBookById(id) {
  return books.find((book) => book.id === Number(id));
}

function updateBook(book, updates) {
  const issuedCopies = book.totalCopies - book.availableCopies;
  const updatedTotalCopies = updates.totalCopies ?? book.totalCopies;

  Object.assign(book, {
    title: updates.title === undefined ? book.title : updates.title.trim(),
    author: updates.author === undefined ? book.author : updates.author.trim(),
    isbn: updates.isbn === undefined ? book.isbn : updates.isbn.trim(),
    publishedYear:
      updates.publishedYear === undefined
        ? book.publishedYear
        : updates.publishedYear,
    totalCopies: updatedTotalCopies,
    availableCopies: updatedTotalCopies - issuedCopies,
  });

  return book;
}

function deleteBook(book) {
  const index = books.indexOf(book);
  books.splice(index, 1);
}

module.exports = {
  createBook,
  deleteBook,
  findBookById,
  getBooks,
  updateBook,
};
