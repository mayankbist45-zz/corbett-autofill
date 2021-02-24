const express = require("express");
const app = express();
const startupDebugger = require("debug")("app:startup");
const dbDebugger = require("debug")("app:db");
const morgan = require("morgan");
const config = require("config");
const cors = require("cors");

// database
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/test", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function () {
  dbDebugger("We are connected");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  startupDebugger("morgan is enabled");
}

app.post("/users", (req, res) => {
  console.log(req.body);
});

app.get("/users", (req, res) => {
  res.send("working properly");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => startupDebugger(`listening on port ${PORT}`));
