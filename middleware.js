// 未ログイン時のリダイレクト処理
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    console.log(req.path, req.originalUrl);
    req.session.returnTo = req.originalUrl;
    return res.redirect("/user/login");
  }
  next();
};

// ユーザーが管理者画面に行けないようにする

// 未ログイン時のリダイレクト処理
module.exports.adminIsLoggedIn = (req, res, next) => {
  console.log(` !req.isAuthenticated():${req.isAuthenticated()}`);
  //console.dir(req.session.passport.user);
  if (!req.isAuthenticated()) {
    console.log(req.path, req.originalUrl);
    req.session.returnTo = req.originalUrl;
    return res.redirect("/admin/admin_login");
  }
  if (req.user && req.user.role !== "admin") {
    req.flash("error", "管理者権限が必要です");
    return res.redirect("/novel/home");
  }
  next();
};
