// サードパーティモジュール
const express = require("express");
const { isLoggedIn }    = require("../../middleware");

// ローカルモジュール
const Board = require("../../controllers/boards/board-controllers"); 
const User = require("../../models/Users");
const router = express.Router();

router.route("/info")
    .get(Board.renderBoardInfo);  // 掲示板の説明画面へ遷移

router.route("/home")
    .get(Board.renderBoardHome);  // 掲示板へ遷移

router.route("/reviews/:id")
    .get(Board.renderBoardReviews) // 各小説の掲示板へ

router.route("/review-post")
    .post(isLoggedIn, Board.reviewPost);    // レビュー投稿

router.route("/review-delete")
    .post(isLoggedIn, Board.reviewDelete);    // レビュー削除

module.exports = router;