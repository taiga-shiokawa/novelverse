const express = require("express");
const { Resend } = require("resend");
require("dotenv").config();
const Admin = require('../controllers/admin');
const resend = new Resend(process.env.RESEND_API_KEY);
const router = express.Router();
const { isLoggedIn , adminIsLoggedIn } = require("../middleware");

router.route('/add_admin')
    .get( adminIsLoggedIn , Admin.renderAddAdmin )   //管理者追加画面に遷移
    .post(adminIsLoggedIn , Admin.addAdmin )         //管理者追加

router.route('/admin_login')
    .get(Admin.renderAdminLogin )   //管理者ログイン画面に遷移
    .post(Admin.adminLogin )         //管理者ログイン

router.route('/registration_admin')
    .get( Admin.renderRegistrationAdmin )   //管理者新規登録画面に遷移
    .post( Admin.registrationAdmin )        //管理者新規登録

router.route('/dashboard_admin')
    .get( adminIsLoggedIn , Admin.renderDashboardAdmin )   //管理者新規登録画面に遷移

router.route('/logout')
    .post(Admin.adminLogout)         //管理者ログイン   


    
module.exports = router;