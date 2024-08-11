const setTopImage = require("../../utils/setTopImage");
const Novel = require("../../models/Novels");
const User = require("../../models/Users");

// 掲示板の説明画面へ遷移
module.exports.renderBoardInfo = async (req, res) => {
  let topImg = setTopImage;
  res.render("boards/board-info", { topImg, csrfToken: req.csrfToken() });
};

// 掲示板へ遷移
module.exports.renderBoardHome = async (req, res) => {
  let topImg = setTopImage;
  const pageTitle = "感想・レビューを見たい小説を選んでください";
  try {
    const novels = await Novel.find({}).sort({_id: -1}).populate("author").populate("genre");
    res.render("boards/board-home", { novels, pageTitle, topImg, csrfToken: req.csrfToken() });
  } catch (err) {
    console.log("掲示板の小説一覧表示でエラー:", err);
  }
};

// 各小説の掲示板へ
module.exports.renderBoardReviews = async (req, res) => {
  const novelId = req.params.id;
  let topImg = setTopImage;
  try {
    const novel = await Novel.findById(novelId).populate("author").populate("genre");
    res.render("boards/board-reviews", { novel, topImg, csrfToken: req.csrfToken() });
  } catch(err) {
    console.log("該当小説の掲示板表示時にエラーが発生しました:", err);
  }
};