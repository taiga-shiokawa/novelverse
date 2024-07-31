const express = require("express");
const router = express.Router();

// 掲示板の説明画面へ遷移
router.get("/info", (req, res) => {
  res.render("boards/board-info", { csrfToken: req.csrfToken() });
});

// 掲示板へ遷移
router.get("/home", (req, res) => {
  res.render("boards/board-home", { csrfToken: req.csrfToken() });
});

module.exports = router;