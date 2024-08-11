const User = require('../../models/Users');

// ユーザー管理画面へ遷移
module.exports.renderUserManagement = async ( req , res ) => {
  const users         = await User.find({});
  const selectingUser = null;
  const searchUser    = null;
  const count         = await User.estimatedDocumentCount();
  const pageTitle     = "ユーザー管理画面";
  res.render("admins/user-management" , { pageTitle , users , selectingUser , count , searchUser , csrfToken: req.csrfToken()});
}

// 特定のユーザーの情報を一覧表示させて、ユーザー管理画面へ遷移
module.exports.renderUserManagementAndDetail = async ( req , res ) => {
  const users         = await User.find({});
  const selectingUser = await User.findById(req.params.id)
  const count         = await User.estimatedDocumentCount();
  const pageTitle     = "ユーザー管理画面";
  res.render("admins/user-management" , { pageTitle ,users , selectingUser , count , csrfToken: req.csrfToken()});
}

module.exports.accountDeletion = async (req , res) => {
  const { admin_code, delete_user_id , delete_user_name } = req.body;
  const current_admin_code = req.session.admin_code;
  if( admin_code == current_admin_code ){
    await User.findByIdAndDelete(delete_user_id);
    req.flash('success' , `${delete_user_name }さんのアカウントを削除しました`);
    res.redirect("/admin-user-management/user-management");
  }else{
    req.flash('error' , `管理者コードが間違っています`);
    res.redirect(`/admin-user-management/user-management/${delete_user_id}`);
  }
}

module.exports.userSearch = async (req, res) => {
  const searchQuery   = req.query.search;
  const pageTitle     = "ユーザー管理画面";
  const selectingUser = null;
  const count         = await User.estimatedDocumentCount();

  if (!searchQuery || searchQuery.trim() == "") {
    return res.redirect("/admin-user-management/user-management");
  }

  try {
    const regex      = new RegExp(searchQuery, "i");
    const searchUser = await User.find({username: regex});
    const users      = [];

    if (searchUser.length < 1) {
      return res.redirect("/admin-user-management/user-management");
    } else {
      res.render("admins/user-management", {pageTitle, searchUser, selectingUser, count, users , csrfToken: req.csrfToken()});
    }

  } catch (err) {
    console.log("ユーザーの検索に失敗しました", err);
  }
};