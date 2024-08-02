// サードパーティ(外部のライブラリなど)モジュール
const { Resend } = require("resend");
require("dotenv").config();
const passport = require("passport");
const userAccountCreateValidate = require("../../utils/user-account-create-validation");
const userLoginValidate = require("../../utils/user-login-validation");

// ローカルモジュール
const User = require("../../models/Users");

// Resend環境変数
let resend;
const apiKey = process.env.RESEND_API_KEY_HEROKU || process.env.RESEND_API_KEY;
if (apiKey) {
  resend = new Resend(apiKey);
} else {
  console.error('Resend API key is not set');
}

// アカウント作成画面へ遷移
module.exports.goToAccountCreate = (req, res) => {
  res.render("users/user-signup", { inputData: {}, errors: {}, csrfToken: req.csrfToken() });
};

// アカウント作成処理
module.exports.accountCreate = async (req, res) => {
  const { username, email, password } = req.body;
  let role = "user";

  console.log(password);
  console.log(req.body._csrf);

  const errors = userAccountCreateValidate(req.body);
  if (errors) {
    return res.render('users/user-signup', { 
      inputData: { username, email },
      csrfToken: req.csrfToken(),
      errors: errors
    });
  }

  try {
    const user = new User({ username, email, role });
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      req.flash("creation-error", "ニックネームまたはメールアドレスがすでに使用されています");
      return res.redirect("/user/signup");
    }
    const registerdUser = await User.register(user, password);
    const data = await resend.emails.send({
      from: "onboarding@novelverse.net",
      to: email,
      subject: "メール確認",
      html: `
        <h1>メールアドレスの確認</h1>
        <p>ゴキブリが、あなたを見ているよっちゃんイカ。</p>
        <p>以下のリンクをクリックし、認証を実行してくだサイボーグ爺さん。</p>
        <a href="http://localhost:8000/user/login">ぴゃー！！！</a>
      `,
    });
    console.log("メール送信成功 : ", data);
    res.redirect("/user/after_page");
  } catch (err) {
    console.log("メール送信エラー : ", err);
  }
};

module.exports.goToAfterPage = (req, res) => {
  res.render("users/after-account-creation-page");
};

// ログイン画面へ遷移
module.exports.goToLogin = (req, res) => {
  res.render("users/user-login", { inputData: {}, errors: {}, csrfToken: req.csrfToken() });
};

// ログイン処理
module.exports.userLogin = async (req, res, next) => {

  const { email } = req.body;
  
  console.log(req.body._csrf);
  
  const errors = userLoginValidate(req.body);
  if (errors) {
    return res.render('users/user-login', { 
      errors: errors,
      csrfToken: req.csrfToken()
    });
  }
  
  // if (!req.body._csrf) {
  //   return res.status(403).json({ error: 'CSRFトークンがありません' });
  // }

  // セッションの外で returnTo を保持
  const returnTo = req.session.returnTo;
  console.log("Original returnTo:", returnTo);

  const user = await User.findOne({ email: email });

  // アカウントがロックされているかチェック
  if (user.isLocked) {
    req.flash("error", "アカウントがロックされています。しばらく待ってから再試行してください。");
    console.log('Authentication failed:', info);
    return res.redirect("/user/login");
  }
  
  passport.authenticate("user", async (err, user, info) => {
    if (err) {
      console.error('Authentication error:', err);
      return next(err);
    }
    if (!user) {
      const userToUpdate = await User.findOne({ email: email });
      if (userToUpdate) {
        await userToUpdate.incLoginAttempts();
      }
      req.flash("error", "メールアドレスまたはパスワードが正しくありません");
      return res.redirect("/user/login");
    }
    
    // ログイン成功時の処理
    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();

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
};
