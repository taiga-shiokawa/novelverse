const Admin = require('../models/admins');
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
  
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!admin) {
        // req.flash("error", "Invalid username or password");
        return res.redirect("/admin/admin_login");
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        // ここで保持していた returnTo を使用
        const redirectUrl = returnTo || "/admin/dashboard";
        // セッションから returnTo を削除
        delete req.session.returnTo;
        console.log("Redirecting to:", redirectUrl);
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
    }
    // res.render("admins/admin-add");
}
