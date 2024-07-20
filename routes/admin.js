const express = require("express");
const { Resend } = require("resend");
require("dotenv").config();
const Admin = require('../controllers/admin');
const resend = new Resend(process.env.RESEND_API_KEY);
const router = express.Router();
const { isLoggedIn } = require("../middleware");

router.route('/add_admin')
    .get( isLoggedIn , Admin.renderAddAdmin )   //管理者追加画面に遷移
    .post(isLoggedIn , Admin.addAdmin )         //管理者追加

router.route('/admin_login')
    .get(Admin.renderAdminLogin )   //管理者ログイン画面に遷移
    .post(Admin.adminLogin )         //管理者ログイン

module.exports = router;