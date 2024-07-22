const express = require("express");
const { Resend } = require("resend");
require("dotenv").config();
const AdminAuthors = require('../controllers/admin-authors');
const resend = new Resend(process.env.RESEND_API_KEY);
const router = express.Router();
const { adminIsLoggedIn } = require("../middleware");

router.route('/author-index')
    .get(  adminIsLoggedIn , AdminAuthors.renderAdminAuthors )   //管理者管理画面に遷移

router.route('/deletion')
    .post( adminIsLoggedIn , AdminAuthors.authorsDeletion )    
    
module.exports = router;