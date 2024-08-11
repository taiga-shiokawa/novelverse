const express = require("express");
const { Resend } = require("resend");
require("dotenv").config();
const AdminUserManagement = require('../../controllers/admins/admin-user-management-controllers');
const resend = new Resend(process.env.RESEND_API_KEY);
const router = express.Router();
const { adminIsLoggedIn } = require("../../middleware");

router.route('/user-management')
    .get(  adminIsLoggedIn , AdminUserManagement.renderUserManagement )   //ユーザー管理画面に遷移

router.route('/user-management/:id')
    .get(  adminIsLoggedIn , AdminUserManagement.renderUserManagementAndDetail )   //ユーザー管理画面に遷移

router.route('/deletion')
    .post( adminIsLoggedIn , AdminUserManagement.accountDeletion )       // アカウント削除
    .delete( adminIsLoggedIn , AdminUserManagement.accountDeletion )      

router.route('/user-search')
    .get(adminIsLoggedIn, AdminUserManagement.userSearch);  // ユーザー検索
    


module.exports = router;