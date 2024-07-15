const mongoose = require("mongoose");

// DB接続
const connectDB = (url) => {
  return mongoose
    .connect(url)
    .then(() => {
      console.log("DBコネクト成功!!");
    })
    .catch((err) => {
      console.log("DBコネクト失敗...", err);
    });
}

module.exports = connectDB;
