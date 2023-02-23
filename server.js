const express = require("express");
const compression = require("compression");
const databaseConnection = require("./config/db");
const api = require("./api");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(compression());
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("assets"));
app.use(express.static(__dirname + "/"));

databaseConnection();

// Routes
app.use(api);

// Error Handling
app.use((err, req, res, next) => {
  console.error(err);
  if (err.message) res.status(500).send({ message: err.message });
  else res.status(500).send(err);
});

// Start Server
const server = app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

module.exports = server;
