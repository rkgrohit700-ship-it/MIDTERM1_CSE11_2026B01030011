const express = require("express");
const {
  addBook,
  editBook,
  getBook,
  issueBook,
  listBooks,
  removeBook,
  returnBook,
  searchBooks,
} = require("../controllers/bookController");

const router = express.Router();

router.get("/search", searchBooks);
router.post("/", addBook);
router.get("/", listBooks);
router.get("/:id", getBook);
router.put("/:id", editBook);
router.delete("/:id", removeBook);
router.post("/:id/issue", issueBook);
router.post("/:id/return", returnBook);

module.exports = router;
