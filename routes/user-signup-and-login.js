// サードパーティ(外部のライブラリなど)モジュール
const express = require("express");

// ローカルモジュール
const {
  goToAccountCreate,
  accountCreate,
  goToLogin,
  userLogin,
} = require("../controllers/user-signup-and-login-controllers");

const router = express.Router();

// アカウント作成画面へ遷移
router.get("/signup", goToAccountCreate);

// アカウント作成処理
router.post("/signup", accountCreate);

// ログイン画面へ遷移
router.get("/login", goToLogin);

// ログイン処理
router.post("/login", userLogin);

module.exports = router;
