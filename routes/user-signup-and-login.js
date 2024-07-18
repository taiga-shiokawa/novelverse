const express = require("express");
const User = require("../models/Users");
const { Resend } = require("resend");
require("dotenv").config();
const passport = require("passport");

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

// ログイン処理
router.post("/login", async (req, res, next) => {
  // セッションの外で returnTo を保持
  const returnTo = req.session.returnTo;
  console.log("Original returnTo:", returnTo);

  const email = req.body.email;
  const user = await User.findOne({ email: email });

  if (!user) {
    req.flash("error", "ログインに失敗しました");
    return res.redirect("/user/login");
  }

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      // req.flash("error", "Invalid username or password");
      return res.redirect("/user/login");
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      // ここで保持していた returnTo を使用
      const redirectUrl = returnTo || "/novel/home";
      // セッションから returnTo を削除
      delete req.session.returnTo;
      console.log("Redirecting to:", redirectUrl);
      return res.redirect(redirectUrl);
    });
  })(req, res, next);
});

module.exports = router;
