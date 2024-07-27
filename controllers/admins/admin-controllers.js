const Admin = require("../../models/Admins");
const User = require("../../models/Users");
const passport = require("passport");
// サードパーティ(外部のライブラリなど)モジュール
const { Resend } = require("resend");
require("dotenv").config();

// Resend環境変数
const resend = new Resend(process.env.RESEND_API_KEY);

//管理者ログインに遷移
module.exports.renderAdminLogin = (req, res) => {
  res.render("admins/admin-login");
};

module.exports.adminLogin = async (req, res, next) => {
  // セッションの外で returnTo を保持
  const returnTo = req.session.returnTo;
  console.log("Original returnTo:", returnTo);

  const { admin_code } = req.body;
  const admin = await Admin.findOne({ admin_code: admin_code });

  if (!admin) {
    req.flash("error", "ログインに失敗しました");
    return res.redirect("/admin/admin_login");
  }

  passport.authenticate("admin", (err, admin, info) => {
    if (err) {
      return next(err);
    }
    if (!admin) {
      req.flash("error", "管理者コードまたはパスワードが間違っています");
      return res.redirect("/admin/admin_login");
    }

    req.logIn(admin, (err) => {
      if (err) {
        return next(err);
      }
      // ここで保持していた returnTo を使用
      const redirectUrl = returnTo || "/admin/dashboard_admin";
      // セッションから returnTo を削除
      delete req.session.returnTo;
      console.log("Redirecting to:", redirectUrl);
      req.session.admin_code = admin_code;

      return res.redirect(redirectUrl);
    });
  })(req, res, next);
};

// 管理者追加画面へ遷移
module.exports.renderAddAdmin = (req, res) => {
  res.render("admins/admin-add");
};

module.exports.addAdmin = async (req, res) => {
  const { admin_code, name, email, birthday, password } = req.body;
  let role = "admin";
  try {
    const admin = new Admin({ admin_code, name, email, birthday, role });
    const registerAdmin = await Admin.register(admin, password);
    req.flash("success", "管理者を登録しました。");
    res.render("admins/admin-add");
  } catch (err) {
    console.log(err);
    req.flash("error", "更新中にエラーが発生しました");
    res.render("admins/admin-add");
  }
  // res.render("admins/admin-add");
};

// 管理者追加画面へ遷移
module.exports.renderRegistrationAdmin = (req, res) => {
  res.render("admins/admin-registration");
};

module.exports.registrationAdmin = async (req, res) => {
  const { admin_code, name, email, birthday, password } = req.body;
  let role = "admin";
  try {
    console.log(`${admin_code}と${name}と${email}と${role}`);
    const admin = new Admin({
      username: admin_code,
      admin_code,
      name,
      email,
      birthday,
      role,
    });
    const registerAdmin = await Admin.register(admin, password);
    req.flash("success", "管理者を登録しました。");
    // res.render("admins/admin-registration");
    res.redirect("/admin/admin_login");
  } catch (err) {
    console.log(err);
    req.flash("error", "登録中にエラーが発生しました");
    res.redirect("/admin/registration_admin");
  }
};

module.exports.renderDashboardAdmin = (req, res) => {
  res.render("admins/admin-dashboard");
};

// ログアウト
module.exports.adminLogout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    delete req.session.admin_code;
    req.flash("success", "ログアウトしました");
    res.redirect("/admin/admin_login");
  });
};

// 「運営者について」画面へ遷移
module.exports.goToAdminInfo = (req, res) => {
  res.render("admins/admin-info");
};

// 「ノベルバースについて」画面へ遷移
module.exports.goToAppInfo = (req, res) => {
  res.render("admins/app-info");
};

// ご意見・お問い合わせ画面へ遷移
module.exports.goToInquiry = (req, res) => {
  res.render("users/inquiry-page");
};

// ご意見・お問い合わせ処理
module.exports.inquiry = async (req, res) => {
  const { email, subject, text } = req.body;
  const userId = req.user._id;
  try {
    const existingUser = await User.findOne({
      $or: [{ _id: userId }, { email }],
    });
    if (!existingUser) {
      req.flash("existError", "ログインしてください");
      return res.redirect("/user/login");
    }
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "taiga.hr12@gmail.com",
      subject: `${subject}`,
      html: `
      <p>From: ${email}</p>
      <p>Subject: ${subject}</p>
      <p>Message:</p>
      <p>${text}</p>
    `,
    });
    console.log("メール送信成功 : ", data);
    res.redirect("/user/after_page");
  } catch (err) {
    console.log("メール送信エラー : ", err);
  }
};
