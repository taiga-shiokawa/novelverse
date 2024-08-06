const express = require("express");
require("dotenv").config();
const Admin = require('../../controllers/admins/admin-controllers');
const router = express.Router();
const { isLoggedIn , adminIsLoggedIn } = require("../../middleware");

router.route('/add-admin')
    .get( adminIsLoggedIn , Admin.renderAddAdmin )   //管理者追加画面に遷移
    .post(adminIsLoggedIn , Admin.addAdmin )         //管理者追加

router.route('/admin-login')
    .get(Admin.renderAdminLogin )   //管理者ログイン画面に遷移
    .post(Admin.adminLogin )         //管理者ログイン

router.route('/registration-admin')
    .get( Admin.renderRegistrationAdmin )   //管理者新規登録画面に遷移
    .post( Admin.registrationAdmin )        //管理者新規登録

router.route('/dashboard')
    .get( adminIsLoggedIn , Admin.renderDashboardAdmin )   //管理者新規登録画面に遷移

router.route('/logout')
    .post(Admin.adminLogout)         //管理者ログイン   

    
module.exports = router;