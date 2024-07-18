const mongoose = require("mongoose");
const Genre = require("../models/Genres");
const genres = require("./genres");
const connectDB = require("../db/connect");

const DB_URL = "mongodb://localhost:27017/novelversedb"; // MongoDB名（ローカル）

const start = async () => {
  try {
    await connectDB(DB_URL);
  } catch (err) {
    console.log(err);
  }
};
start();

async function saveGenres() {
  try {
    await Genre.deleteMany({});
    const genreNames = genres.map((name) => ({ genre_name: name }));
    const result = await Genre.insertMany(genreNames);
    console.log(`${result.length}件のジャンル名を保存しました。`);
  } catch (err) {
    console.log("エラーが発生しました。", err);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDBの接続を閉じました。");
  }
}
saveGenres();