const express = require("express");
const router = express.Router();

// アカウント削除画面へ遷移
router.get("/deletion", (req, res) => {
  res.render("users/account_deletion");
});

// アカウント設定画面へ遷移
router.get("/setting", (req, res) => {
  res.render("users/account_settings");
});

module.exports = router;