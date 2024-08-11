const express = require("express");
const { storage } = require("../../cloudinary/cloudinary");
const novelRegisrationtAndUpdateValidate = require("../../utils/novel-registration-and-update-validation");   // 小説投稿と更新のバリデーション
const AdminNovles = require('../../controllers/admins/admin-novels-controllers');
const { adminIsLoggedIn } = require("../../middleware");
const router = express.Router();

const multer = require("multer");
// アップロードされたファイルの保存先を指定
const upload = multer({ storage });

// 小説登録
router.route("/registration")
   .get(  adminIsLoggedIn , AdminNovles.renderNovelRegistration )   
   .post(  upload.single("cover"), adminIsLoggedIn , AdminNovles.novelRegistration ) 

// 表紙削除
router.route("/cover/delete/")
  .get(  adminIsLoggedIn , AdminNovles.renderNovelCoverDelete )   
  .post(  adminIsLoggedIn , AdminNovles.novelCoverDelete ) 

  router.route("/all")
  .get(  adminIsLoggedIn , AdminNovles.renderNovelAll )   

//ジャンル追加画面に遷移 / 実装
router.route("/genre-add")
   .get(  adminIsLoggedIn , AdminNovles.renderAddGenres )   
   .post(  adminIsLoggedIn , AdminNovles.addGenres )   

//ジャンル削除画面に遷移 / 実装
router.route("/genre-delete")
   .get( adminIsLoggedIn , AdminNovles.renderGenreDeletion )
   .post(  adminIsLoggedIn , AdminNovles.deleteGenres )     

// 小説詳細画面へ遷移
router.route("/admin-detail/:id")
   .get( adminIsLoggedIn , AdminNovles.renderAdminNovelDetails )

// 表紙画像変更
router.route("/cover-change")
  .put( upload.single("image"),adminIsLoggedIn , AdminNovles.changeCoverImg )

// 小説情報変更
router.route("/novel-info-change")
   .put( adminIsLoggedIn , AdminNovles.novelInfoChange)


// 検索結果画面へ遷移&処理
router.route("/search")
   .get( adminIsLoggedIn , AdminNovles.renderAdminSearchResultAndSearchProcess )

// ジャンル別小説一覧画面へ遷移&取得
router.route("/genre/:id")
   .get( adminIsLoggedIn , AdminNovles.renderAdminGenreNovelListAndNovelGet )




module.exports = router;
