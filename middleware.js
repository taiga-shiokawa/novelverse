// 未ログイン時のリダイレクト処理
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    console.log(req.path, req.originalUrl);
    req.session.returnTo = req.originalUrl;
    return res.redirect("/user/login");
  }
  next();
};

// 未ログイン時のリダイレクト処理
module.exports.adminIsLoggedIn = (req, res, next) => {
  console.log(` !req.isAuthenticated():${req.isAuthenticated()}`)
  console.dir(req.session.passport.user);
  if (!req.isAuthenticated()) {
    console.log(req.path, req.originalUrl);
    req.session.returnTo = req.originalUrl;
    return res.redirect("/admin/admin_login");
  }
  next();
};