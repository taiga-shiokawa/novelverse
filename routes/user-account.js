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
  const users = await User.findById(id); //ログイン中のユーザーの情報を全て取得
  const deletionReason  = new DeletionReason ({ reason, opinion , users });　
  deletionReason.save(); //削除理由登録
  await User.findByIdAndDelete(id); //アカウント削除
  req.flash('success' , 'アカウントを削除しました');
  res.redirect('/user/login'); //リダイレクト先
});

// アカウント設定画面へ遷移
router.get("/setting", isLoggedIn , async (req, res) => {
  const { id } = res.locals.currentUser; //ログイン中のユーザーのID¥
  const loginUser = await User.findById(id); //ログイン中のユーザーの情報を全て取得

  // 現在のパスワードが正しいか確認
  // const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  // if (!isPasswordValid) {
  //   return res.status(400).send("現在のパスワードが正しくありません。");
  // }

   // 新しいパスワードをハッシュ化
  //  const hashedPassword = await bcrypt.hash(newPassword, 10);

  //  // ユーザーのパスワードを更新
  //  user.password = hashedPassword;
  //  await user.save();

  if(!loginUser){
    req.flash('error' , 'ユーザーは見つかりませんでした');
    return res.redirect(`/user/login`);
  }
  res.render("users/account-settings" , {loginUser});
});

// アカウント設定更新
router.post("/setting", isLoggedIn , async (req, res) => {
  const { id } = res.locals.currentUser; //ログイン中のユーザーのID
  const { passport } = req.body; 
  const updateUser = await User.findById(id , { ...req.body.updateUser });
  if(passport){
    updateUser.passport = passport;
  } // 更新内容。$set演算子を使用してageフィールドの値を更新
  await updateUser.save();
  req.flash('success' , 'アカウントを更新しました');
  res.redirect("users/account-settings");
});

module.exports = router;