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
start();

// viewエンジン
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// publicフォルダを使用するためのミドルウェア
app.use(express.static(path.join(__dirname, "public")));

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
app.use(express.urlencoded({ extended: true }));
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

// セッション情報
app.use((req, res, next) => {
  console.log(req.session);
  res.locals.currentUser = req.user;
  next();
});

// 認証を, authenticateという方法でLocalStrategyを使ってやることを宣言
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// 小説関連API
app.use("/novel", novelRouter);

// ユーザーアカウント関連API
app.use("/user/account", userAccountRouter);

// ユーザー登録とログインAPI
app.use("/user", userSignupAndLogin);

// サーバー接続
app.listen(PORT, console.log("サーバーが起動しました"));
