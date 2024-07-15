const express = require("express");
const router = express.Router();

// アカウント削除画面へ遷移
router.get("/deletion", (req, res) => {
  res.render("users/account-deletion");
});

// アカウント設定画面へ遷移
router.get("/setting", (req, res) => {
  res.render("users/account-settings");
});

module.exports = router;