const express = require("express");
const app = express();
const connectDB = require("./db/connect");
const PORT = 3000;
const DB_URL = "mongodb://localhost:27017/novelversedb";

const start = async () => {
  try {
    await connectDB(DB_URL);
  } catch (err) {
    console.log(err);
  }
};

start();

app.listen(PORT, console.log("サーバーが起動しました"));