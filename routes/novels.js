const express = require("express");
const router = express.Router();
const Novel = require("../models/Novels");
// const { isLoggedIn } = require("../middleware");

// ホーム画面へ遷移
router.get("/home", async (req, res) => {
  try {
    const newNovels = await Novel.find({ is_new: true })
      .populate("author")
      .limit(5);

    const bunkoNovels = await Novel.find({ novel_type: "文庫" })
      .populate("author")
      .limit(5);

    const tankobonNovels = await Novel.find({ novel_type: "単行本" })
      .populate("author")
      .limit(5);

    const lightNovels = await Novel.find({ novel_type: "ライトノベル" })
      .populate("author")
      .limit(5);

    const recommendedNovels = await Novel.find({ is_recommend: true })
      .populate("author")
      .limit(5);

    res.render("novels/home", {
      newNovels,
      bunkoNovels,
      tankobonNovels,
      lightNovels,
      recommendedNovels,
    });
  } catch (err) {
    console.error("小説の取得に失敗しました:", error);
  }
});

// 「もっと見る」以降の小説一覧
router.get("/list", async (req, res) => {
  try {
    let query = {};
    let pageTitle = "";

    if (req.query.is_new === "true") {
      query.is_new = true;
      pageTitle = "注目の新作";
    } else if (req.query.novel_type) {
      query.novel_type = req.query.novel_type;
      pageTitle = `おすすめの${req.query.novel_type}`;
    } else if (req.query.is_recommend === "true") {
      query.is_recommend = true;
      pageTitle = "ノベルバースおすすめ";
    }
    const novels = await Novel.find(query).populate("author").populate("genre");
    res.render("novels/novel-lists", { novels, pageTitle });
  } catch (err) {
    console.log(err);
  }
});

// 小説投稿画面へ遷移
router.get("/registration", (req, res) => {
  res.render("authors/novel-test");
});

// 小説投稿処理
router.post("/registration", async (req, res) => {
  try {
    const novelData = req.body.novel;

    // チェックボックスの値を適切に変換
    novelData.is_new = novelData.is_new === "on";
    novelData.is_recommend = novelData.is_recommend === "on";
    const novel = new Novel(req.body.novel);
    const saveNovel = await novel.save();
    console.log("小説の登録に成功しました。", saveNovel);
    res.redirect("/novel/registration");
  } catch (err) {
    console.log("小説の登録に失敗しました。", err);
    res.redirect("/novel/registration");
  }
});

// 小説詳細画面へ遷移
router.get("/detail/:id", async (req, res) => {
  const id = req.params.id;
  const novelDetails = await Novel.findById(id).populate("author").populate("genre");
  console.log(novelDetails);
  res.render("novels/novel-details", { novelDetails });
});

module.exports = router;
