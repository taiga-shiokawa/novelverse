const Novel = require("../../models/Novels");
const NovelReview = require("../../models/Reviews");
const setTopImage = require("../../utils/setTopImage");
const User = require("../../models/Users");

// 掲示板の説明画面へ遷移
module.exports.renderBoardInfo = async (req, res) => {
  const topImg = await setTopImage(res);
  console.log(topImg);
  res.render("boards/board-info", { topImg, csrfToken: req.csrfToken() });
};

// 掲示板へ遷移
module.exports.renderBoardHome = async (req, res) => {
  const topImg = await setTopImage(res);
  const pageTitle = "感想・レビューを見たい小説を選んでください";
  try {
    const novels = await Novel.find({}).sort({_id: -1}).populate("author").populate("genre");
    res.render("boards/board-home", { novels, pageTitle, topImg, csrfToken: req.csrfToken() });
  } catch (err) {
    console.log("掲示板の小説一覧表示でエラー:", err);
  }
};

// 各小説の掲示板へ
module.exports.renderBoardReviews = async (req, res, next) => {
  const novelId = req.params.id;
  const userId = res.locals.currentUser;
  const topImg = await setTopImage(res);
  try {
    const loginUser = await User.findById(userId);
    const novel = await Novel.findById(novelId).populate("author").populate("genre");
    const reviews = await NovelReview.find({ novel: novelId }).populate("user");
    res.render("boards/board-reviews", { novel, reviews, loginUser, topImg, csrfToken: req.csrfToken() });
  } catch(err) {
    console.log("該当小説の掲示板表示時にエラーが発生しました:", err);
    next();
  }
};

// 小説へのレビュー投稿
module.exports.reviewPost = async (req, res, next) => {
  const { content, novelId } = req.body.review;
  const userId = res.locals.currentUser;
  console.log("ここまで");
  try {
    const review = new NovelReview({
      content: content,
      novel: novelId,
      user: userId,
    });

    await review.save();
    res.redirect(`/board/reviews/${novelId}`);
  } catch (err) {
    console.log("レビュー投稿に失敗: ", err);
    next();
  }
};

// レビュー削除
module.exports.reviewDelete = async (req, res, next) => {
  const { reviewId, novelId } = req.body;
  try {
    const reviewContent = await NovelReview.findById(reviewId);

    if (!reviewContent) {
      return res.redirect(`/board/reviews/${novelId}`);
    } else {
      await NovelReview.findByIdAndDelete(reviewId);
      res.redirect(`/board/reviews/${novelId}`);
    }
  } catch (err) {
    console.log("レビューの削除に失敗しました: ", err);
    next();
  }
};