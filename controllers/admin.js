const Admin = require('../models/Admins');
const passport = require("passport");


//管理者ログインに遷移
module.exports.renderAdminLogin = ( req , res ) => {
    res.render("admins/admin-login");
}

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

        console.log(` ログイン画面でのreq.isAuthenticated():${req.isAuthenticated()}`);
        console.log(` ログイン画面でのセッション確認:${req.session.passport.user}`);
        console.dir(req.session.passport)

        return res.redirect(redirectUrl);
      });
    })(req, res, next);
}

// 管理者追加画面へ遷移
module.exports.renderAddAdmin = ( req , res ) => {
    res.render("admins/admin-add");
}

module.exports.addAdmin = async (req, res) => {
    try {
        const {admin_code , name, email, birthday , password } = req.body;
        const admin = new Admin({ admin_code , name, email , birthday});
        const registerAdmin = await Admin.register(admin, password);
        req.flash('success' , '管理者を登録しました。');
        res.render("admins/admin-add");
    }catch(err){
        console.log(err);
        req.flash('error' , '更新中にエラーが発生しました');
        res.render("admins/admin-add");
    }
    // res.render("admins/admin-add");
}

// 管理者追加画面へ遷移
module.exports.renderRegistrationAdmin = ( req , res ) => {
  res.render("admins/admin-registration");
}

module.exports.registrationAdmin = async (req, res) => {
  try {
      const {admin_code , name, email, birthday , password } = req.body;
      console.log(`${admin_code}と${name}と${email}`)
      const admin = new Admin({  username: admin_code, admin_code , name, email , birthday});
      const registerAdmin = await Admin.register(admin, password);
      req.flash('success' , '管理者を登録しました。');
      res.render("admins/admin-registration");
      res.redirect('/admin/registration_admin');
  }catch(err){
      console.log(err);
      req.flash('error' , '登録中にエラーが発生しました');
      res.redirect('/admin/registration_admin');
  }
  // res.render("admins/admin-add");
}


module.exports.renderDashboardAdmin = ( req , res ) => {
  console.dir('ダッシュボード' + req.session.passport.user);
  console.dir('ダッシュボードreq.isAuthenticated() : ' + req.isAuthenticated());
  res.render("admins/admin-dashboard");
}