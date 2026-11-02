const express = require("express");
const bookRoutes = require("./routes/bookRoutes");

const app = express();

app.use(express.json());
app.use("/api/books", bookRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ message: "Request body must be valid JSON" });
  }

  console.error(err);
  return res.status(500).json({ message: "Internal server error" });
});

module.exports = app;
