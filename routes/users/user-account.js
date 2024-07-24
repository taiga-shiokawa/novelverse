const express = require("express");
const router = express.Router({ mergeParams : true});
const { isLoggedIn } = require("../../middleware");
const userAccount = require("../../controllers/users/user-account-controllers");

router.route('/deletion')
    .get(isLoggedIn , userAccount.renderAccountDeletion )   // アカウント削除画面へ遷移
    .put(isLoggedIn , userAccount.accountDeletion );        // アカウント削除

router.route('/setting')
    .get(isLoggedIn , userAccount.renderAccountSetting )    // アカウント設定画面へ遷移
    .put(isLoggedIn , userAccount.accountSetting );         // アカウント設定

router.route('/password_change')
    .get(isLoggedIn , userAccount.renderPasswordChange )    // アカウント設定画面へ遷移
    .put(isLoggedIn , userAccount.passwordChange );         // アカウント設定

router.route('/bookmark')
    .get(userAccount.renderNovelHome)                       // 小説一覧へリダイレクト
    .post(isLoggedIn, userAccount.addBookmark);             // ブックマーク追加      

router.route('/bookmark/list')
    .get(isLoggedIn, userAccount.renderBookmarkLists);      // ブックマーク一覧画面へ遷移

router.route('/bookmark/cancel')
    .post(isLoggedIn, userAccount.cancelBookmark);

module.exports = router;