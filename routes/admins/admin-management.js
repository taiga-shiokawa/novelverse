const express = require("express");
const { Resend } = require("resend");
require("dotenv").config();
const AdminManagement = require('../../controllers/admins/admin-management-controllers');
const resend = new Resend(process.env.RESEND_API_KEY);
const router = express.Router();
const { adminIsLoggedIn } = require("../../middleware");

router.route('/admin-management')
    .get(  adminIsLoggedIn , AdminManagement.renderAdminManagement )   //管理者管理画面に遷移

router.route('/admin-management/:id')
    .get(  adminIsLoggedIn , AdminManagement.renderAdminManagementAndDetail )   //管理者管理画面に遷移

router.route('/deletion')
    .post( adminIsLoggedIn , AdminManagement.accountDeletion )    
    .delete( adminIsLoggedIn , AdminManagement.accountDeletion )    

    
module.exports = router;