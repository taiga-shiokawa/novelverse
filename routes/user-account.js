const express = require("express");
const router = express.Router({ mergeParams : true});
const { isLoggedIn } = require("../middleware");
const userAccount = require('../controllers/user-account');

router.route('/deletion')
    .get(isLoggedIn , userAccount.renderAccountDeletion ) // アカウント削除画面へ遷移
    .put(isLoggedIn , userAccount.accountDeletion )       // アカウント削除

router.route('/setting')
    .get(isLoggedIn , userAccount.renderAccountSetting ) // アカウント設定画面へ遷移
    .put(isLoggedIn , userAccount.accountSetting )       // アカウント設定

router.route('/password_change')
    .get(isLoggedIn , userAccount.renderPasswordChange ) // アカウント設定画面へ遷移
    .put(isLoggedIn , userAccount.passwordChange )       // アカウント設定

module.exports = router;