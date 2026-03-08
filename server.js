const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./students.db");

// Create table
db.run(`
CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  phone TEXT
)
`);

// Add student
app.post("/add-user", (req, res) => {

  const { name, phone } = req.body;

  db.run(
    "INSERT INTO students (name, phone) VALUES (?, ?)",
    [name, phone],
    function (err) {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({ message: "Student added successfully" });
    }
  );

});

// Get students
app.get("/users", (req, res) => {

  db.all("SELECT * FROM students", (err, rows) => {

    if (err) {
      return res.status(500).json(err);
    }

    res.json(rows);

  });

});

// Delete student
app.delete("/delete-user/:id", (req, res) => {

  const id = req.params.id;

  db.run("DELETE FROM students WHERE id = ?", [id], function (err) {

    if (err) {
      return res.status(500).json(err);
    }

    res.json({ message: "Student deleted successfully" });

  });

});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});