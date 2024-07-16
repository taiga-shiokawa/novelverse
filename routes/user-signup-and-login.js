const express = require("express");
const router = express.Router();

// アカウント作成画面へ遷移
router.get("/signup", (req, res) => {
  res.render("users/user-signup");
});

// ログイン画面へ遷移
router.get("/login", (req, res) => {
  res.render("users/user-login");
});

module.exports = router;