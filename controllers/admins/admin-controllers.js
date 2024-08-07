const Admin = require("../../models/Admins");
const User = require("../../models/Users");
const Novel = require("../../models/Novels");
const passport = require("passport");
// サードパーティ(外部のライブラリなど)モジュール
const { Resend } = require("resend");
require("dotenv").config();

// Resend環境変数
const resend = new Resend(process.env.RESEND_API_KEY);

//管理者ログインに遷移
module.exports.renderAdminLogin = (req, res) => {
  const pageTitle = "管理者ログイン";
  res.render("admins/admin-login", { pageTitle , csrfToken: req.csrfToken()});
};

// 管理者ログイン処理
module.exports.adminLogin = async (req, res, next) => {
  // セッションの外で returnTo を保持
  const returnTo = req.session.returnTo;
  console.log("Original returnTo:", returnTo);

  const { admin_code } = req.body;
  const admin = await Admin.findOne({ admin_code: admin_code });

  if (!admin) {
    req.flash("error", "ログインに失敗しました");
    return res.redirect("/admin/admin-login");
  }

  passport.authenticate("admin", (err, admin, info) => {
    if (err) {
      return next(err);
    }
    if (!admin) {
      req.flash("error", "管理者コードまたはパスワードが間違っています");
      return res.redirect("/admin/admin-login");
    }

    req.logIn(admin, (err) => {
      if (err) {
        return next(err);
      }
      // ここで保持していた returnTo を使用
      const redirectUrl = returnTo || "/admin/dashboard";
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
  const pageTitle = "管理者追加";
  res.render("admins/admin-add"), { pageTitle , csrfToken: req.csrfToken()};
};

// 管理者追加処理
module.exports.addAdmin = async (req, res) => {
  const { admin_code, name, email, birthday, password } = req.body;
  let role = "admin";
  const pageTitle = "管理者追加";
  try {
    const admin = new Admin({ admin_code, name, email, birthday, role });
    const registerAdmin = await Admin.register(admin, password);
    req.flash("success", "管理者を登録しました。");
  } catch (err) {
    console.log(err);
    req.flash("error", "更新中にエラーが発生しました");
  }
  res.render("admins/admin-add" , { pageTitle });
};

// 管理者追加画面へ遷移
module.exports.renderRegistrationAdmin = (req, res) => {
  const pageTitle = "管理者新規登録";
  res.render("admins/admin-registration" , { pageTitle });
};

// 管理者新規登録処理
module.exports.registrationAdmin = async (req, res) => {
  const { admin_code, name, email, birthday, password } = req.body;
  let role = "admin";
  try {
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
    res.redirect("/admin/admin-login");
  } catch (err) {
    console.log(err);
    const pageTitle = "管理者新規登録";
    req.flash("error", "登録中にエラーが発生しました");
    res.redirect("/admin/registration-admin");
  }
};

// ダッシュボード画面へ遷移
module.exports.renderDashboardAdmin = async (req, res) => {
  const pageTitle = "ダッシュボード";
  try {
    const userCount = await User.countDocuments();
    const novelCount = await Novel.countDocuments();
    // 当日のアクティブユーザー数をカウント
    const today = new Date();
    today.setHours(0, 0, 0, 0);  // その日の午前0時に設定
    const todayActiveUser = await User.countDocuments({lastLoginDate: {$gte: today}});
    // 7日前の日時を計算し1週間のアクティブユーザー数をカウント
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const oneWeekActiveUser = await User.countDocuments({lastLoginDate: {$gte: oneWeekAgo}});

    console.log(`総ユーザー数：${userCount}`, `小説総数：${novelCount}`, `総アクティブユーザー：${todayActiveUser}`);
    res.render("admins/admin-dashboard" , {pageTitle, userCount, novelCount, todayActiveUser, oneWeekActiveUser});
  } catch (err) {
    console.log(err);
    res.redirect("/admin/dashboard");
  }
};

// ログアウト
module.exports.adminLogout = (req, res, next) => {
  console.log("Logout route hit");
  console.log("CSRF token from form:", req.body._csrf);
  console.log("CSRF token from request:", req.csrfToken());
  console.log("Session:", req.session);

  req.logout(function (err) {
    if (err) {
      console.error("Logout error:", err);
      return next(err);
    }

    delete req.session.admin_code;
    req.flash("success", "ログアウトしました");
    res.redirect("/admin/admin-login");
  });
};