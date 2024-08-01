const express = require("express");
const router = express.Router({ mergeParams : true});
const { isLoggedIn } = require("../../middleware");
const userAccount = require("../../controllers/users/user-account-controllers");
const multer = require("multer");
const { storage } = require("../../cloudinary/cloudinary");
const upload = multer({ storage });

router.route('/deletion')
    .get(isLoggedIn , userAccount.renderAccountDeletion )   // アカウント削除画面へ遷移
    .put(isLoggedIn , userAccount.accountDeletion );        // アカウント削除

router.route('/setting')
    .get(isLoggedIn , userAccount.renderAccountSetting )    // アカウント設定画面へ遷移
    .put(isLoggedIn , userAccount.accountSetting );         // アカウント設定

router.route('/setting-img')
    .put(upload.single("image"), userAccount.accountSettingImg);    // 小説登録処理

router.route('/delete-img')
    .put(isLoggedIn ,userAccount.deleteSettingImg);    // 小説削除

router.route('/password_change')
    .get(isLoggedIn , userAccount.renderPasswordChange )    // アカウント設定画面へ遷移
    .put(isLoggedIn , userAccount.passwordChange );         // アカウント設定

router.route('/bookmark')
    .get(userAccount.renderNovelHome)                       // 小説一覧へリダイレクト
    .post(isLoggedIn, userAccount.addBookmark);             // ブックマーク追加      

router.route('/bookmark/list')
    .get(isLoggedIn, userAccount.renderBookmarkLists);      // ブックマーク一覧画面へ遷移

router.route('/bookmark/cancel')
    .post(isLoggedIn, userAccount.cancelBookmark);          // ブックマーク解除

router.route('/inquiry')
    .get(isLoggedIn, userAccount.goToInquiry)               // ご意見・お問い合わせ画面へ遷移
    .post(isLoggedIn, userAccount.inquiry);                 // ご意見・お問い合わせ処理

module.exports = router;