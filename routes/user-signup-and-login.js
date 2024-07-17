const express = require("express");
const User = require("../models/Users");
const passport = require("passport");
const { Resend } = require("resend");
require("dotenv").config();
const resend = new Resend(process.env.RESEND_API_KEY);
const router = express.Router();

// アカウント作成画面へ遷移
router.get("/signup", (req, res) => {
  res.render("users/user-signup");
});

// アカウント作成処理
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registerdUser = await User.register(user, password);
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "メール確認",
      html: `
        <h1>メールアドレスの確認</h1>
        <p>ゴキブリが、あなたを見ているよ。</p>
        <p>以下のリンクをクリックし、認証を実行してください。</p>
        <a href="http://localhost:8000/user/login">みょ〜ん</a>
      `
    });
    console.log("メール送信成功 : ", data);
    res.redirect("/user/login");
  } catch (err) {
    console.log("メール送信エラー : ", err);
  }
});

// ログイン画面へ遷移
router.get("/login", (req, res) => {
  res.render("users/user-login");
});

module.exports = router;
