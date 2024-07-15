const express = require("express");
const router = express.Router();

// ログイン画面へ遷移
router.get("/login", (req, res) => {
  res.render("users/user_login");
});

module.exports = router;