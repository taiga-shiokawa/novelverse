const express = require("express");
const router = express.Router();

// ホーム画面へ遷移
router.get("/home", (req, res) => {
  res.render("novels/home");
});

// 「もっと見る」以降の小説一覧
router.get("/list", (req, res) => {
  res.render("novels/novel_lists");
});

module.exports = router;
