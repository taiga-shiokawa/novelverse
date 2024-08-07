const express = require("express");
const Novel = require("../../models/Novels");
const { cloudinary } = require("../../cloudinary/cloudinary");
const multer = require("multer");
const { storage } = require("../../cloudinary/cloudinary");
const novelRegisrationtAndUpdateValidate = require("../../utils/novel-registration-and-update-validation");   // 小説投稿と更新のバリデーション
const AdminNovles = require('../../controllers/admins/admin-novels-controllers');
const { adminIsLoggedIn } = require("../../middleware");
const catchAsync = require("../../utils/catchAsync");

const router = express.Router();

// アップロードされたファイルの保存先を指定
const upload = multer({ storage });

// 小説登録画面へ遷移
router.get("/registration", (req, res) => {
  const pageTitle = "小説追加";
  res.render("admins/novel-registration", { pageTitle , csrfToken: req.csrfToken() });
});

// 小説登録処理
router.post("/registration", (req, res, next) => {
  console.log("Route reached");
  console.log("Request body:", req.body);
  console.log("Request query:", req.query);
  console.log("Request file:", req.file);
  console.log("CSRF token from query:", req.query._csrf);
  next();
}, upload.single("cover"), novelRegisrationtAndUpdateValidate, async (req, res) => {
  const novelData = req.body.novel;

  // チェックボックスの値をMongoDBのBoolean型に合うように変換
  novelData.is_new = novelData.is_new === "on";
  novelData.is_recommend = novelData.is_recommend === "on";
  const novel = new Novel(req.body.novel);
  if (req.file) {
    novel.cover = { url: req.file.path, filename: req.file.filename };
  }
  try {
    const saveNovel = await novel.save();
    console.log("小説の登録に成功しました。", saveNovel);
    return res.redirect("/novel/management/registration");
  } catch (err) {
    console.log("小説の登録に失敗しました。", err);
    const pageTitle = "小説追加";
    return res.render("admins/novel-registration", {  pageTitle , csrfToken: req.csrfToken() });
  }
});

router.get("/all", async (req, res) => {
  try {
    const novels = await Novel.find({}).populate("author").populate("genre");
    const pageTitle = "小説一覧・削除";
    res.render("admins/admin-novel-edit", { pageTitle , novels, csrfToken: req.csrfToken() });
  } catch (err) {
    console.log(err);
  }
});

router.post("/delete", async (req, res) => {
  const { novelId, coverId } = req.body;
  try {
    const novel = await Novel.findById(novelId);
    const novels = await Novel.find({}).populate("author").populate("genre");
    if (!novel) {
      return res.status(404).json({ message: "Novel not found" });
    }

    // Cloudinaryから画像を削除
    const coverToDelete = novel.cover.find((c) => c._id.toString() === coverId);
    if (coverToDelete && coverToDelete.filename) {
      await cloudinary.uploader.destroy(coverToDelete.filename);
    }

    // データベースから画像情報を削除
    novel.cover = novel.cover.filter((c) => c._id.toString() !== coverId);

    // 小説全体を削除するか、カバー画像のみを削除するか判断
    if (novel.cover.length === 0) {
      await Novel.findByIdAndDelete(novelId);
    } else {
      await novel.save();
    }

    res.redirect("/novel/management/all");
  } catch (err) {
    console.error(err);
    const pageTitle = "小説一覧・削除";
    res.render("admins/admin-novel-edit", { pageTitle , novels, csrfToken: req.csrfToken() });
  }
});

router.get("/cover/delete/", async (req, res) => {
  try {
    const novels = await Novel.find({}).populate("author").limit(1);
    // coverの詳細をコンソールに表示
    novels.forEach((novel, index) => {
      console.log(`Novel ${index + 1}:`);
      console.log("Title:", novel.title);
      console.log("Cover:", novel.cover);
      if (novel.cover && novel.cover.length > 0) {
        console.log("Cover URL:", novel.cover[0].url);
        console.log("Cover Filename:", novel.cover[0].filename);
        console.log("Cover ID:", novel.cover[0]._id);
      } else {
        console.log("No cover image found");
      }
      console.log("-------------------");
    });
    const pageTitle = "小説管理" ; 
    res.render("admins/admin-novel-management", { pageTitle , novels });
  } catch (err) {
    console.log(err);
  }
});

router.post("/cover/delete", async (req, res) => {
  try {
    const { coverId } = req.body;
    console.log("CoverId: ", coverId);

    const novel = await Novel.findOne({ "cover._id": coverId });

    // Cloudinaryから画像を削除
    const coverToDelete = novel.cover.find((c) => c._id.toString() === coverId);
    if (coverToDelete && coverToDelete.filename) {
      await cloudinary.uploader.destroy(coverToDelete.filename);
    }

    // データベースから画像情報を削除
    novel.cover = novel.cover.filter((c) => c._id.toString() !== coverId);
    await novel.save();

    res.redirect("/novel/management/cover/delete");
  } catch (err) {
    console.log(err);
  }
});


//ジャンル追加画面に遷移 / 実装
router.route("/genre_add")
   .get(  adminIsLoggedIn , AdminNovles.renderAddGenres )   
   .post(  adminIsLoggedIn , AdminNovles.addGenres )   

//ジャンル削除画面に遷移 / 実装
router.route("/genre_delete")
   .get( adminIsLoggedIn , AdminNovles.renderGenreDeletion )
   .post(  adminIsLoggedIn , AdminNovles.deleteGenres )     

// 小説詳細画面へ遷移
router.route("/admin_detail")
   .get( adminIsLoggedIn , AdminNovles.renderAdminNovelDetails )

// 作家名取得（非同期）
router.route("/get_author_names")
   .get( adminIsLoggedIn , AdminNovles.getAuthorNames )

// 検索結果画面へ遷移&処理
router.route("/get_author_names")
   .get( adminIsLoggedIn , AdminNovles.renderAdminSearchResultAndSearchProcess )

// ジャンル別小説一覧画面へ遷移&取得
router.route("/render_admin_genre_novel_list_and_novel_get")
   .get( adminIsLoggedIn , AdminNovles.renderAdminGenreNovelListAndNovelGet )



// ジャンル別小説一覧画面へ遷移&取得
module.exports.renderAdminGenreNovelListAndGNovelGet = catchAsync(
  async (req, res) => {
    const genreId = req.params.id;
    let pageTitle = "";
    const genre = await Genre.findById(genreId);
    if (genre) {
      pageTitle = genre.genre_name;
    }
    const novelByGenreList = await Novel.find({ genre: genreId })
      .sort({_id: -1})
      .populate("author")
      .populate("genre");
    console.log(novelByGenreList);
    res.render("admins/admin-novel-genre-list", { novelByGenreList, pageTitle, csrfToken: req.csrfToken() });
  }
);

module.exports = router;
