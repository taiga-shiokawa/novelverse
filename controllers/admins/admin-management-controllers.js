const Admin = require('../../models/Admins');

// 管理者管理画面へ遷移
module.exports.renderAdminManagement = async ( req , res ) => {
  const admins = await Admin.find({});
  const selectingAdmin = null;
  const pageTitle = "管理者管理画面";
  res.render("admins/admin-management" , { pageTitle , admins , selectingAdmin  , csrfToken: req.csrfToken()});
}

// 特定のユーザーの情報を一覧表示させて、管理者管理画面へ遷移
module.exports.renderAdminManagementAndDetail = async ( req , res ) => {
  const admins = await Admin.find({});
  const selectingAdmin = await Admin.findById(req.params.id)
  const current_admin_code = req.session.admin_code;
  const pageTitle = "管理者管理画面";
  res.render("admins/admin-management" , { pageTitle , admins , selectingAdmin , current_admin_code });
}

module.exports.accountDeletion = async (req , res) => {
  const { admin_code, delete_admin_id , delete_admin_name } = req.body;
  const current_admin_code = req.session.admin_code;

  if(delete_admin_id == current_admin_code ){
    req.flash('error' , `ログイン中の管理者は削除できません`);
    res.redirect(`/admin-management/admin-management/${delete_admin_id}`);
  } else if( admin_code != current_admin_code ){
    req.flash('error' , `管理者コードが間違っています`);
    res.redirect(`/admin-management/admin-management/${delete_admin_id}`);
  } else {
    const deleteAdmin = await Admin.findByIdAndDelete(delete_admin_id);
    req.flash('success' , `${delete_admin_name }さんのアカウントを削除しました`);
    res.redirect("/admin-management/admin-management");
  }

}