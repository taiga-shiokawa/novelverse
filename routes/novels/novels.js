// サードパーティ(外部のライブラリなど)モジュール
const express = require("express");
const multer = require("multer");

// ローカルモジュール
const { storage } = require("../../cloudinary/cloudinary");
// const { isLoggedIn } = require("../middleware");
const {
  goToHome,
  seeMoreNovelList,
  goToNovelRegistration,
  novelRegistration,
  goToNovelDetails,
  getAuthorNames,
  goToSearchResultAndSearchProcess,
  goToByGenreNovelListAndGNovelGet,
} = require("../../controllers/novels/novel-controllers");

const router = express.Router();

// アップロードされたファイルの保存先を指定
const upload = multer({ storage });

// ホーム画面へ遷移
router.get("/home", goToHome);

// 「もっと見る」以降の小説一覧
router.get("/list", seeMoreNovelList);

// 小説登録画面へ遷移
router.get("/registration", goToNovelRegistration);

// 小説登録処理
router.post("/registration", upload.single("cover"), novelRegistration);

// 小説詳細画面へ遷移
router.get("/detail/:id", goToNovelDetails);

// 作家取得（非同期）
router.get("/author", getAuthorNames);

// 検索結果画面へ遷移&処理
router.get("/search", goToSearchResultAndSearchProcess);

// ジャンル別小説一覧画面へ遷移
router.get("/genre/:id", goToByGenreNovelListAndGNovelGet);

module.exports = router;
