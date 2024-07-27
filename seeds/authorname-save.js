const mongoose = require("mongoose");
const Author = require("../models/Authors");
const authors = require("./authors");
const connectDB = require("../db/connect"); // MongoDB接続
require("dotenv").config();

const DB_URL = "mongodb://localhost:27017/novelversedb"; // MongoDB名（ローカル）

// MongoDB接続
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
  } catch (err) {
    console.log(err);
  }
};
start();

async function saveAuthorNames() {
  try {
    await Author.deleteMany({});

    const authorNames = authors.map((name) => ({ author_name: name }));
    const result = await Author.insertMany(authorNames);
    console.log(`${result.length}件の作家名を保存しました。`);
  } catch (err) {
    console.log("エラーが発生しました。", err);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDBの接続を閉じました。");
  }
}

saveAuthorNames();
