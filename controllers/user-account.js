const User = require('../models/Users');
const DeletionReason = require('../models/Deletion_reasons');

module.exports.renderAccountDeletion = (req , res) => {
    res.render("users/account-deletion");
}

module.exports.accountDeletion = async (req, res) => {
    const { id } = res.locals.currentUser; //ログイン中のユーザーのID
    const { reason, opinion } = req.body; //formに入力した値
    const deletionReason  = new DeletionReason ({ reason, opinion });
    deletionReason.save(); //削除理由登録
    await User.findByIdAndDelete(id); //アカウント削除
    req.flash('success' , 'アカウントを削除しました');
    //ログアウト
    res.redirect('/user/login'); //リダイレクト先
}

module.exports.renderAccountSetting = async (req, res) => {
    const { id } = res.locals.currentUser; //ログイン中のユーザーのID
    const loginUser = await User.findById(id); //ログイン中のユーザーの情報を全て取得
  
    if(!loginUser){
      req.flash('error' , 'ユーザーは見つかりませんでした');
      return res.redirect(`/user/login`);
    }
    res.render("users/account-settings" , {loginUser});
}

module.exports.accountSetting =  async (req, res) => {
    const { id } = res.locals.currentUser; //ログイン中のユーザーのID
    const user = await User.findById(id);
    await User.findByIdAndUpdate(id , { ...req.body.user });
    req.flash('success' , 'アカウントを更新しました');
    req.session.passport.user =  req.body.user.username; //formに入力した値 
    res.redirect("/user/account/setting");
}

module.exports.renderPasswordChange = (req , res) => {
    res.render("users/password-change");
}

module.exports.passwordChange = async (req, res ,next ) => {
    const { currentPassword, newPassword , confirmPassword } = req.body;
  
    if (!req.isAuthenticated()) {
            req.flash('error' , '認証されていません');
            return res.redirect(`/user/login`);
    }
  
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        req.flash('error' , 'ユーザーが見つかりません');
        return res.redirect(`/user/login`);
      }
  
      if ( newPassword != confirmPassword) {
        req.flash('error' , '新しいパスワードと確認用パスワードが一致しません');
        return res.redirect("/user/account/password_change");
      }
  
      user.authenticate(currentPassword, async (err, user, passwordError) => {
        if (err || passwordError) {
          req.flash('error' , '現在のパスワードが正しくありません');
          return res.redirect("/user/account/password_change");
        }
  
        await user.setPassword(newPassword);
        await user.save();
  
        req.login(user, (err) => {
          if (err) {
            console.error("Re-login error:", err);
            req.flash('error' , 'ログインエラーが発生しました');
            return res.redirect(`/user/login`);
          }
          req.flash('success' , 'パスワードが正常に更新されました');
          return res.redirect("/user/account/password_change");
        });
      });
    } catch (error) {
      console.error("Password update error:", error);
      res.status(500).json({ message: 'パスワードの更新中にエラーが発生しました' });
    }
}

  