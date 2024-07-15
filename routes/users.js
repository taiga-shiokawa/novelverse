const express = require("express");
const router = express.Router();

// ログイン画面へ遷移
router.get("/login", (req, res) => {
  res.render("users/login");
});

// アカウント削除画面へ遷移
router.get("/account_deletion", (req, res) => {
  res.render("users/account_deletion");
});

// アカウント設定画面へ遷移
router.get("/account_setting", (req, res) => {
  res.render("users/account_setting");
});

module.exports = router;