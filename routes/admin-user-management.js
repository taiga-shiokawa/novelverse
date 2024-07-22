const express = require("express");
const { Resend } = require("resend");
require("dotenv").config();
const AdminUserManagement = require('../controllers/admin-user-management');
const resend = new Resend(process.env.RESEND_API_KEY);
const router = express.Router();
const { adminIsLoggedIn } = require("../middleware");

router.route('/user-management')
    .get(  adminIsLoggedIn , AdminUserManagement.renderUserManagement )   //ユーザー管理画面に遷移

router.route('/user-management/:id')
    .get(  adminIsLoggedIn , AdminUserManagement.renderUserManagementAndDetail )   //ユーザー管理画面に遷移

router.route('/deletion')
    .delete( adminIsLoggedIn , AdminUserManagement.accountDeletion )       // アカウント削除
    .post( adminIsLoggedIn , AdminUserManagement.accountDeletion )       // アカウント削除
    


module.exports = router;