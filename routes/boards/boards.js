const express = require("express");
const User = require("../../models/Users");
const router = express.Router();

// 掲示板の説明画面へ遷移
router.get("/info", async (req, res) => {
  if(res.locals.currentUser){
    const { id } = res.locals.currentUser; //ログイン中のユーザーのID
    const loginUser = await User.findById(id); //ログイン中のユーザーの情報を全て取得
    topImg =  loginUser.image;
  }
  res.render("boards/board-info", { topImg, csrfToken: req.csrfToken() });
});

// 掲示板へ遷移
router.get("/home", async (req, res) => {
  if(res.locals.currentUser){
    const { id } = res.locals.currentUser; //ログイン中のユーザーのID
    const loginUser = await User.findById(id); //ログイン中のユーザーの情報を全て取得
    topImg =  loginUser.image;
  }
  res.render("boards/board-home", { topImg, csrfToken: req.csrfToken() });
});

module.exports = router;