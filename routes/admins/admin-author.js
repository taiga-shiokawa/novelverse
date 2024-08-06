const express = require("express");
const { Resend } = require("resend");
require("dotenv").config();
const AdminAuthors = require('../../controllers/admins/admin-authors-controllers');
const resend = new Resend(process.env.RESEND_API_KEY);
const router = express.Router();
const { adminIsLoggedIn } = require("../../middleware");

router.route('/author-index')
    .get(  adminIsLoggedIn , AdminAuthors.renderAdminAuthors )   //著者管理画面に遷移

router.route('/deletion/:id')
    .get( adminIsLoggedIn , AdminAuthors.authorsDeletion )  
    
//著者追加画面に遷移 / 実装
router.route("/author_add")
   .get( adminIsLoggedIn , AdminAuthors.renderAddAuthor )   
   .post( adminIsLoggedIn , AdminAuthors.addAuthor )  
    
module.exports = router;