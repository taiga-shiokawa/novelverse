if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const connectDB = require("./db/connect"); // MongoDB接続
const path = require("path"); // viewsフォルダのパスを指定
const ejsMate = require("ejs-mate"); // テンプレートの共通部分の管理ライブラリ
const novelRouter = require("./routes/novels"); // 小説関連ルーター
const userAccountRouter = require("./routes/user-account"); // ユーザーアカウント関連ルーター
const userSignupAndLogin = require("./routes/user-signup-and-login"); // ユーザー登録とログインルーター
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const User = require("./models/Users");
const userLogoutRouter = require("./routes/user-logout");
const getGenreName = require("./common/genres");
const getAuthorName = require("./common/authors");
const flash = require("connect-flash");

const app = express();
const PORT = 3000;
const DB_URL = "mongodb://localhost:27017/novelversedb"; // MongoDB名（ローカル）

// MongoDB接続
const start = async () => {
  try {
    await connectDB(DB_URL);
  } catch (err) {
    console.log(err);
  }
};

// commonフォルダのgenres.jsからジャンル名を読み込み
async function loadGenres() {
  try {
    const genres = await getGenreName();
    return genres;
  } catch (err) {
    console.log("Error loading genres:", err);
    return [];
  }
}

async function loadAuthors() {
  try {
    const authors = await getAuthorName();
    return authors;
  } catch (err) {
    console.log("Error loading genres:", err);
    return [];
  }
}

// viewエンジン
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// publicフォルダを使用するためのミドルウェア
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// セッション設定
const sessionConfig = {
  secret: "mysecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

// フォームからのPOSTリクエストを受け取るためのミドルウェア
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// 認証を, authenticateという方法でLocalStrategyを使ってやることを宣言
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ジャンルとユーザー情報(セッション)を全てのルートで利用可能にするミドルウェア
app.use(async (req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  if (!res.locals.genres) {
    res.locals.genres = await loadGenres();
  }
  if(!res.locals.authors) {
    res.locals.authors = await loadAuthors();
  }
  next();
});

app.use("/novel", novelRouter);               // 小説関連API
app.use("/user/account", userAccountRouter);  // ユーザーアカウント関連API
app.use("/user", userSignupAndLogin);         // ユーザー登録とログインAPI
app.use("/user", userLogoutRouter);           // ユーザーログアウトAPI

// エラーハンドリングミドルウェア
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Something went wrong");
});

// サーバー起動
async function startServer() {
  await start();
  app.listen(PORT, () => console.log(`サーバーが起動しました。ポート: ${PORT}`));
}

startServer();
