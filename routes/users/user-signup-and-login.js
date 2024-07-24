// サードパーティ(外部のライブラリなど)モジュール
const express = require("express");

// ローカルモジュール
const {
  goToAccountCreate,
  accountCreate,
  goToLogin,
  userLogin,
} = require("../../controllers/users/user-signup-and-login-controllers");

const router = express.Router();

router.route("/signup")
    .get(goToAccountCreate) // アカウント作成画面へ遷移
    .post(accountCreate);   // アカウント作成処理

router.route("/login")
    .get(goToLogin)   // ログイン画面へ遷移
    .post(userLogin); // ログイン処理


module.exports = router;