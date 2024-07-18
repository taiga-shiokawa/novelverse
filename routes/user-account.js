const express = require("express");
const router = express.Router({ mergeParams : true});
const User = require("../models/Users");
const { isLoggedIn } = require("../middleware");
const DeletionReason = require('../models/Deletion_reasons');


// アカウント削除画面へ遷移
router.get("/deletion", isLoggedIn ,  (req, res) => {
  res.render("users/account-deletion");
});

// アカウント削除
router.post("/deletion", isLoggedIn , async (req, res) => {
  const { id } = res.locals.currentUser; //ログイン中のユーザーのID
  const { reason, opinion } = req.body; //formに入力した値
  const deletionReason  = new DeletionReason ({ reason, opinion });
  deletionReason.save(); //削除理由登録
  await User.findByIdAndDelete(id); //アカウント削除
  req.flash('success' , 'アカウントを削除しました');
  res.redirect('/user/login'); //リダイレクト先
});


// アカウント設定画面へ遷移
router.get("/setting", isLoggedIn , async (req, res) => {
  const { id } = res.locals.currentUser; //ログイン中のユーザーのID
  const loginUser = await User.findById(id); //ログイン中のユーザーの情報を全て取得

  if(!loginUser){
    req.flash('error' , 'ユーザーは見つかりませんでした');
    return res.redirect(`/user/login`);
  }
  res.render("users/account-settings" , {loginUser});
});

// アカウント設定更新
router.post("/setting", isLoggedIn , async (req, res) => {
  const { id } = res.locals.currentUser; //ログイン中のユーザーのID
  const user = await User.findById(id);
  await User.findByIdAndUpdate(id , { ...req.body.user });
  req.flash('success' , 'アカウントを更新しました');

  console.log(req.body.user.birthday);
  req.session.passport.user =  req.body.user.username; //formに入力した値 
  res.redirect("/user/account/setting");
});

module.exports = router;