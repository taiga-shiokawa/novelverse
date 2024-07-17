// 未ログイン時のリダイレクト処理
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    console.log(req.path, req.originalUrl);
    req.session.returnTo = req.originalUrl;
    req.flash("error", "ログインしてください");
    return res.redirect("/user/login");
  }
  next();
};