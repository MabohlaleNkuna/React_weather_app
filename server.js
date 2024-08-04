
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 5000;
app.use(express.json());
app.use(cors());

const db = new sqlite3.Database('weather.db'); 

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS weather (id INTEGER PRIMARY KEY AUTOINCREMENT, location TEXT, temperature TEXT, main TEXT, icon TEXT, date TEXT)");

  const stmt = db.prepare("INSERT INTO weather (location, temperature, main, icon, date) VALUES (?, ?, ?, ?, ?)");
  stmt.run("Sample Location", "22°C", "Clear", "http://example.com/icon.png", new Date().toLocaleDateString());
  stmt.finalize();
});

app.get('/weather', (req, res) => {
  db.all("SELECT * FROM weather", (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json(rows);
    }
  });
});

app.post('/weather', (req, res) => {
  const { location, temperature, main, icon, date } = req.body;
  const stmt = db.prepare("INSERT INTO weather (location, temperature, main, icon, date) VALUES (?, ?, ?, ?, ?)");
  stmt.run(location, temperature, main, icon, date, function(err) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(201).json({ id: this.lastID });
    }
  });
  stmt.finalize();
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
