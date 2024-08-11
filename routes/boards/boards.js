// サードパーティモジュール
const express = require("express");

// ローカルモジュール
const Board = require("../../controllers/boards/board-controllers"); 
const User = require("../../models/Users");
const router = express.Router();

router.route("/info")
    .get(Board.renderBoardInfo);  // 掲示板の説明画面へ遷移

router.route("/home")
    .get(Board.renderBoardHome);  // 掲示板へ遷移

router.route("/reviews/:id")
    .get(Board.renderBoardReviews); // 各小説の掲示板へ

module.exports = router;