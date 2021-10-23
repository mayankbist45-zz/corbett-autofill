const express = require("express");
const app = express();
const cors = require("cors");
require("./prod");

// database
const mongoose = require("mongoose");
const uri = `mongodb+srv://corbett:zpTiC0denyk3iesn@cluster0.ll84g.mongodb.net/test`;

// const uri = `mongodb://localhost/playground`;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error"));
db.once("open", function () {
  console.log("We are connected");
});

const Schema = mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  phone: Number,
  country: {
    type: String,
    default: "India",
  },
  documentType: Number,
  documentNumber: Number,
  adminId: Number
});

const User = mongoose.model("userModel", Schema);

async function getAllUsers() {
  const users = await User.find();
  console.log(users);
  return users;
}

async function addData(data) {
  console.log("data we are going to add ", data);
  const user = new User(data);
  return await user.save();
}

// express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());

app.post("/users", async (req, res) => {
  await addData(req.body);
  res.send(await getAllUsers());
});

app.get("/users/:id", async (req, res) => {
  res.send(await User.find({ adminId: req.params.id }));
});

app.get("/users", async (req, res) => {
  res.send(await getAllUsers());
});

app.delete("/users/:id", async (req, res) => {
  await User.findByIdAndRemove(req.params.id);
  res.send(await getAllUsers());
});

const PORT = process.env.PORT || 8021;
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
