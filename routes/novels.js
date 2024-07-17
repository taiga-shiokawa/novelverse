const express = require("express");
const router = express.Router();
// const { isLoggedIn } = require("../middleware");

// ホーム画面へ遷移
router.get("/home", (req, res) => {
  res.render("novels/home");
});

// 「もっと見る」以降の小説一覧
router.get("/list", (req, res) => {
  res.render("novels/novel-lists");
});

module.exports = router;
