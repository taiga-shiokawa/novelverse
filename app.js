const express = require("express");
const connectDB = require("./db/connect");      // MongoDB接続
const path = require("path");                   // viewsフォルダのパスを指定
const ejsMate = require("ejs-mate");            // テンプレートの共通部分の管理ライブラリ
const novelRouter = require("./routes/novels");                       // 小説関連ルーター
const userAccountRouter = require("./routes/user-account");           // ユーザーアカウント関連ルーター
const userSignupAndLogin = require("./routes/user-signup-and-login"); // ユーザー登録とログインルーター

const app = express();
const PORT = 3000;
const DB_URL = "mongodb://localhost:27017/novelversedb";  // MongoDB名（ローカル）

// MongoDB接続
const start = async () => {
  try {
    await connectDB(DB_URL);
  } catch (err) {
    console.log(err);
  }
};
start();

// viewエンジン
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// フォームからのPOSTリクエストを受け取るためのミドルウェア
app.use(express.urlencoded({ extended: true }));

// publicフォルダを使用するためのミドルウェア
app.use(express.static(path.join(__dirname, "public")));

// 小説関連API
app.use("/novel", novelRouter);

// ユーザーアカウント関連API
app.use("/user/account", userAccountRouter);

// ユーザー登録とログインAPI
app.use("/user", userSignupAndLogin);

// サーバー接続
app.listen(PORT, console.log("サーバーが起動しました"));