const Admin = require('../models/Admins');
const User = require('../models/Users');
const passport = require("passport");


// ユーザー管理画面へ遷移
module.exports.renderUserManagement = async ( req , res ) => {
  const users = await User.find({});
  const selectingUser = null;
  res.render("admins/user-management" , {users , selectingUser});
}

// 特定のユーザーの情報を一覧表示させて、ユーザー管理画面へ遷移
module.exports.renderUserManagementAndDetail = async ( req , res ) => {
  const users = await User.find({});
  const selectingUser = await User.findById(req.params.id)
  res.render("admins/user-management" , {users , selectingUser });
}

module.exports.accountDeletion = async (req , res) => {
  console.log('削除画面');
  const { admin_code, delete_user_id , delete_user_name } = req.body;
  const current_admin_code = req.session.admin_code;

  if( admin_code == current_admin_code ){
    const deleteUser = await User.findByIdAndDelete(delete_user_id);
    req.flash('success' , `${delete_user_name }さんのアカウントを削除しました`);
    res.redirect("/admin-user-management/user-management");
  }else{
    req.flash('error' , `管理者コードが間違っています`);
    res.redirect(`/admin-user-management/user-management/${delete_user_id}`);
  }

}