// サードパーティ(外部のライブラリなど)モジュール
const express   = require("express");
const rateLimit = require("express-rate-limit");

// ローカルモジュール
const {
  goToAccountCreate,
  accountCreate,
  goToLogin,
  userLogin,
  goToAfterPage,
} = require("../../controllers/users/user-signup-and-login-controllers");

const router = express.Router();

// レート制限(ログイン試行)ミドルウェア
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 5, // IPアドレスごとに15分間で5回まで
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    req.flash(
      "login-error",
      "過度のログイン試行を検出しました。15分後に再試行してください。"
    );
    res.status(429).redirect("/error");
  },
  skipFailedRequests: true,
});

router.route("/signup")
  .get(goToAccountCreate) // アカウント作成画面へ遷移
  .post(accountCreate);   // アカウント作成処理

router.route("/login")
  .get(goToLogin)                   // ログイン画面へ遷移
  .post(loginLimiter, userLogin);   // ログイン処理

router.route("/after_page") 
  .get(goToAfterPage);  // アカウント作成後ページ

module.exports = router;
