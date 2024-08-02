// 本番環境で実行されていない場合にdotenvモジュールを読み込み,  .envファイルから環境変数を読み込む
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

// 標準モジュール
const path = require("path"); // viewsフォルダのファイルパスを指定するためのモジュール

// サードパーティ(外部のライブラリなど)モジュール
const connectDB = require("./db/connect"); // MongoDB接続のためにconnectファイルからインポート
const express = require("express"); // Node.jsのWEBフレームワークであるExpressパッケージをインポート
const ejsMate = require("ejs-mate"); // テンプレートの共通部分の管理ライブラリ
const flash = require("connect-flash"); // req,res間で一時的に保持されたメッセージを表示してユーザーにフィードバックを行う
const LocalStrategy = require("passport-local"); // Passport.jsのローカル認証をインポート
const passport = require("passport"); // Passportライブラリのインポート
const session = require("express-session"); // アプリのセッション管理機能を追加するためのミドルウェアの設定
const methodOverride = require("method-override");
const mongoSanitize = require("express-mongo-sanitize");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const { createClient } = require('redis');
const RedisStore = require('connect-redis').default;

// ローカルモジュール
const getGenreName = require("./common/genres"); // アプリ共通ヘッダーのナビゲーションにMongoDBから取得してきたジャンルを表示する
const getAuthorName = require("./common/authors"); // アプリ共通ヘッダーのナビゲーションにMongoDBから取得してきた作家名を表示する
const User = require("./models/Users"); // ユーザーの認証のためUserモデルをインポート
const Admin = require("./models/Admins"); // ユーザーの認証のためUserモデルをインポート
const userAccountRouter = require("./routes/users/user-account"); // ユーザーアカウント関連ルーター
const userLogoutRouter = require("./routes/users/user-logout"); // ユーザーのログアウトルーター
const novelRouter = require("./routes/novels/novels"); // 小説関連ルーター
const novelManagementRouter = require("./routes/admins/admin-novel-management"); // 小説管理ルーター
const userSignupAndLogin = require("./routes/users/user-signup-and-login"); // ユーザー登録とログインルーター
const adminRouter = require("./routes/admins/admin"); // 管理者関連ルーター
const adminUserManagementRouter = require("./routes/admins/admin-user-management"); // 管理者ユーザー管理関係ルーター
const adminManagementRouter = require("./routes/admins/admin-management"); // 管理者の管理関係ルーター
const adminAuthorRouter = require("./routes/admins/admin-author"); // 管理者の著者関係ルーター
const ExpressError = require("./utils/ExpressError");
const boardRouter = require("./routes/boards/boards");

const app = express();
const PORT = 3000;

// MongoDB名（ローカル）
const DB_URL = "mongodb://localhost:27017/novelversedb";

// MongoDB接続
const start = async () => {
  try {
    await connectDB(process.env.MONGO_HEROKU_URL || process.env.MONGO_URL);
  } catch (err) {
    console.log(err);
  }
};

// Redisクライアントの初期化
let redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});
redisClient.connect().catch(console.error);

// RedisStoreの初期化
let redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
})

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

// commonフォルダのgenres.jsから作者名を読み込み
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
app.engine("ejs", ejsMate); // ejs拡張子を指定.
app.set("view engine", "ejs"); // このアプリでejsをViewエンジンとして使用することを宣言.
app.set("views", path.join(__dirname, "views")); // Viewsフォルダ配下のejsファイルの絶対パスの生成.

// JSONボディを解析するミドルウェア
app.use(express.json());

// publicフォルダを使用するためのミドルウェア
app.use(express.static(path.join(__dirname, "public")));

// HTMLのフォーム送信によるbody部分に含まれるデータを解析しreq.bodyにパースするためのミドルウェア
app.use(express.urlencoded({ extended: true }));

// マルチパートフォームデータを解析するミドルウェア
// const upload = multer({ storage: storage });

// PUT、DELETEメソッドのため
app.use(methodOverride("_method"));

// MongoDBインジェクションを防ぐため
app.use(
  mongoSanitize({
    replaceWith: "_", // ? を _ に置換するオプション
  })
);

// セッション設定
const sessionConfig = {
  store: redisStore,
  secret: process.env.SESSION_SECRET || "mysecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: 'lax',
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // Cookieの有効期限を1週間後に設定
    maxAge: 1000 * 60 * 60 * 24 * 7, // Coolieの"最大"有効期限を1週間に設定
  },
};

// 本番環境でのみ適用される追加設定
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
  sessionConfig.cookie.secure = true;
}

// CSRFミドルウェアの設定
const csrfProtection = csrf({
  cookie: true,
  ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
  value: (req) => {
    return req.body._csrf || req.query._csrf || req.headers['x-csrf-token'];
  }
});

app.use(cookieParser());
app.use(session(sessionConfig));
app.use(flash());
app.use(csrfProtection);
app.use(passport.initialize()); // パスポートを初期化し, ユーザー認証機能を有効にする.
app.use(passport.session()); // ユーザー認証情報をセッションで維持する

// CSRFトークンを生成し、レスポンスローカルに保存するミドルウェア
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

// 認証を, authenticateという方法でLocalStrategy(ローカル認証)を使ってやることを宣言
passport.use(
  "user",
  new LocalStrategy(
    { 
      usernameField: "email", 
      passwordField: "password" 
    },
    User.authenticate()
  )
);

// 管理者向けのLocalStrategy
passport.use(
  "admin",
  new LocalStrategy(
    {
      usernameField: "admin_code",
      passwordField: "password",
    },
    Admin.authenticate()
  )
);

// ログイン直後とログアウト直前にCSRFトークンをログ出力するミドルウェア
app.use((req, res, next) => {
  const originalRender = res.render;
  res.render = function() {
    console.log('Current CSRF token:', req.csrfToken());
    originalRender.apply(res, arguments);
  }
  next();
});

// ユーザーオブジェクトをシリアライズ（簡潔な形式に変換）してセッションに保存する
passport.serializeUser((user, done) => {
  done(null, { id: user._id, role: user.role }); // idとroleをセッションに保存
});

/**
 * 各リクエストでセッションからユーザーオブジェクトを取得しdeserializeUserメソッドを呼び出して, そのオブジェクトに対応するユーザーオブジェクトをデータベースから取得する
 * これにより、各リクエストに対してユーザーオブジェクトがreq.userとして利用可能になる
 */
passport.deserializeUser(async (obj, done) => {
  try {
    let user;
    if (obj.role === "admin") {
      user = await Admin.findById(obj.id);
    } else {
      user = await User.findById(obj.id);
    }

    if (!user) {
      return done(null, false);
    }

    done(null, user);
  } catch (err) {
    done(err);
  }
});

// ジャンルとユーザー情報(セッション)を全てのルートで利用可能にするミドルウェア
app.use(async (req, res, next) => {
  console.log(req.query);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.logoutSuccess = req.flash("logout-success");
  res.locals.error = req.flash("error");
  res.locals.loginError = req.flash("login-error");
  res.locals.creationError = req.flash("creation-error");
  res.locals.messages = req.flash();
  if (!res.locals.genres) {
    res.locals.genres = await loadGenres();
  }
  if (!res.locals.authors) {
    res.locals.authors = await loadAuthors();
  }
  next();
});

// WELCOMEルート
app.get('/', (req, res) => {
  res.redirect('/novel/home');
});

// ブックマーク追加を直接叩いた時
app.get("/user/account/bookmark", (req, res) => {
  res.redirect('/novel/home');
});

// ブックマークキャンセルを直接叩いた時
app.get("/user/account/bookmark/cancel", (req, res) => {
  res.redirect('/novel/home');
});

// サイト案内 -> ノベルバースとは
app.get("/app-info", async (req, res, next) => {
  let topImg = "";
    
  try {
    if(res.locals.currentUser){
      const { id } = res.locals.currentUser; //ログイン中のユーザーのID
      const loginUser = await User.findById(id); //ログイン中のユーザーの情報を全て取得
      topImg =  loginUser.image;
    }
    res.render("users/app-info", {topImg});
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// サイト案内 -> 運営者について
app.get("/admin-info", async (req, res) => {
  if(res.locals.currentUser){
    const { id } = res.locals.currentUser; //ログイン中のユーザーのID
    const loginUser = await User.findById(id); //ログイン中のユーザーの情報を全て取得
    topImg =  loginUser.image;
  }
  res.render("users/admin-info", { topImg });
});

// 利用規約
app.get("/terms-and-conditions", async (req, res) => {
  if(res.locals.currentUser){
    const { id } = res.locals.currentUser; //ログイン中のユーザーのID
    const loginUser = await User.findById(id); //ログイン中のユーザーの情報を全て取得
    topImg =  loginUser.image;
  }
  res.render("common/terms_and_conditions", { topImg });
});

// プライバシーポリシー
app.get("/privacy-policy", async (req, res) => {
  if(res.locals.currentUser){
    const { id } = res.locals.currentUser; //ログイン中のユーザーのID
    const loginUser = await User.findById(id); //ログイン中のユーザーの情報を全て取得
    topImg =  loginUser.image;
  }
  res.render("common/privacy_policy", { topImg });
});

app.use("/novel", novelRouter); // 小説関連API
app.use("/novel/management", novelManagementRouter); // 小説管理API
app.use("/user/account", userAccountRouter); // ユーザーアカウント関連API
app.use("/user", userSignupAndLogin); // ユーザー登録とログインAPI
app.use("/user", userLogoutRouter); // ユーザーログアウトAPI
app.use("/admin", adminRouter); // 管理者自身関係API
app.use("/admin-user-management", adminUserManagementRouter); // 管理者ユーザー管理関係API
app.use("/admin-management", adminManagementRouter); // 管理者の管理関係API
app.use("/admin-author", adminAuthorRouter); // 管理者小説関連API
app.use("/board", boardRouter); // 掲示板

// 共通エラーページ
app.get("/error", (req, res) => {
  res.render("errors/error", { csrfToken: req.csrfToken() });
});

app.use((err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);
  
  // CSRFトークンエラーの処理
  console.error('CSRF error:', err);
  console.error('Request body:', req.body);
  console.error('CSRF token from form:', req.body._csrf);
  console.error('CSRF token from request:', req.csrfToken());
  console.error('Headers:', req.headers);
  console.error('Session:', req.session);

  req.flash('error', 'セキュリティトークンが無効です。もう一度お試しください。');
  res.status(403);
  res.redirect('back');
});

// ExpressErrorクラスを使用してエラーメッセージとステータスコードを取得
app.all("*", (req, res, next) => {
  next(new ExpressError("ページが見つかりませんでした", 404));
});

// エラーハンドリングミドルウェア
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) {
    err.message = "問題が起きましt";
  }

  if (statusCode === 400 && err instanceof ExpressError) {
    // Joiバリデーションエラーが発火した場合
    req.flash("error", err.message);
    return res.redirect("back"); // 元のページにリダイレクト
  }

  res.status(statusCode).render("errors/error", { err });
});

// サーバー起動
async function startServer() {
  await start();
  app.listen(process.env.PORT || PORT, () =>
    console.log(`サーバーが起動しました。ポート: ${PORT}`)
  );
}
startServer();
