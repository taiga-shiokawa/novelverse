// サードパーティ(外部のライブラリなど)モジュール
const express = require("express");
const multer = require("multer");

// ローカルモジュール
const { storage } = require("../../cloudinary/cloudinary");
const Novels = require("../../controllers/novels/novel-controllers");
const validate = require("../../utils/novel-registration-and-update-validation");   // 小説投稿と更新のバリデーション

const router = express.Router();

// アップロードされたファイルの保存先を指定
const upload = multer({ storage });

router.route("/home")
    .get(Novels.goToHome);  // ホーム画面へ遷移

router.route("/list")
    .get(Novels.seeMoreNovelList);  // 「もっと見る」以降の小説一覧

router.route("/registration")
    .get(Novels.goToNovelRegistration)  // 小説登録画面へ遷移
    .post(upload.single("cover"), validate, Novels.novelRegistration);    // 小説登録処理

router.route("/detail/:id")
    .get(Novels.goToNovelDetails);  // 小説詳細画面へ遷移

router.route("/author")
    .get(Novels.getAuthorNames);  // 作家取得（非同期）

router.route("/search")
    .get(Novels.goToSearchResultAndSearchProcess);  // 検索結果画面へ遷移&処理

router.route("/genre/:id")
    .get(Novels.goToByGenreNovelListAndGNovelGet);  // ジャンル別小説一覧画面へ遷移

router.route('/admin/info')
    .get(Novels.goToAdminInfo);  // 「運営者について」画面に遷移

router.route('/app_info')
    .get(Novels.goToAppInfo);    // 「ノベルバース」について画面に遷移

module.exports = router;
