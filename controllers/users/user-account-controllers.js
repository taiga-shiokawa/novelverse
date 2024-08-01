const User = require("../../models/Users");
const Bookmark = require("../../models/Bookmark");
const DeletionReason = require("../../models/Deletion_reasons");
const passport = require("passport");
const { cloudinary } = require("../../cloudinary/cloudinary");

module.exports.renderAccountDeletion = async (req, res) => {
  const { id } = res.locals.currentUser; //ログイン中のユーザーのID
  const loginUser = await User.findById(id); //ログイン中のユーザーの情報を全て取得
  const username = loginUser.username;
  const topImg =  loginUser.image;
  res.render("users/account-deletion", { username , topImg ,csrfToken: req.csrfToken() });
};

module.exports.accountDeletion = async (req, res, next) => {
  console.log(`deletion`);
  const { id } = res.locals.currentUser; //ログイン中のユーザーのID
  const { password, opinion } = req.body; //formに入力した値
  passport.authenticate("local", async (err, user, info) => {
    if (err) {
      // エラーがあれば次のエラーハンドラーに渡す
      return next(err);
    }
    if (!user) {
      req.flash('error', 'パスワードが間違っています');
      return res.redirect('/user/account/deletion'); // リダイレクト先
    }

    try {
      // 削除理由の保存
      const deletionReason = new DeletionReason({ opinion });
      await deletionReason.save(); // 削除理由を登録

      // ユーザーアカウントの削除
      await User.findByIdAndDelete(user.id);

      // ログアウト処理
      req.logout(err => {
        if (err) {
          return next(err);
        }
        req.flash('success', 'アカウントを削除しました');
        res.redirect('/user/login'); // リダイレクト先
      });
    } catch (error) {
      console.error('アカウント削除中にエラーが発生しました:', error);
      req.flash('error', 'アカウント削除に失敗しました');
      res.redirect('/user/account/deletion'); // リダイレクト先
    }
  })(req, res, next); // passport.authenticateミドルウェアを呼び出す

};

module.exports.renderAccountSetting = async (req, res) => {
  const { id } = res.locals.currentUser; //ログイン中のユーザーのID
  const loginUser = await User.findById(id); //ログイン中のユーザーの情報を全て取得
  const topImg =  loginUser.image;
  if (!loginUser) {
    req.flash("error", "ユーザーは見つかりませんでした");
    return res.redirect(`/user/login`);
  }
  res.render("users/account-settings", { loginUser , topImg , csrfToken: req.csrfToken() });
};

module.exports.accountSetting = async (req, res) => {
  const { id } = res.locals.currentUser; //ログイン中のユーザーのID
  const user = await User.findById(id);
  await User.findByIdAndUpdate(id, { ...req.body.user });
  req.flash("success", "アカウントを更新しました");
  res.redirect("/user/account/setting");
};

module.exports.accountSettingImg = async (req, res) => {
  const { id } = res.locals.currentUser;
  if (req.file) {
    const img = { url: req.file.path, filename: req.file.filename };
  }

  try {
    await User.findByIdAndUpdate( id , { image: { url: req.file.path, filename: req.file.filename } });
    req.flash("success", "トップ画像をしました");
    res.redirect("/user/account/setting");
  } catch (err) {
    req.flash("error", "トップ画像の変更に失敗しました");
    res.redirect("/user/account/setting");
  }
  
};

module.exports.deleteSettingImg = async (req, res) => {
  try {
    const { id } = res.locals.currentUser;
    const userImgId = req.body.imgId;
    const loginUser = await User.findById(id); //ログイン中のユーザーの情報を全て取得
    const topImg =  loginUser.image;

    console.log(`topImg ${userImgId}`);
    // Cloudinaryから画像を削除
    if (topImg && topImg[0].filename) {
      // console.log(`topImg[0].filename ${topImg[0].filename}`);
      await cloudinary.uploader.destroy(topImg[0].filename);
    }

    loginUser.image = loginUser.image.filter((c) => c._id.toString() !== userImgId);
    await loginUser.save();
    res.redirect("/user/account/setting");
  } catch (err) {
    console.log(err);
    const updatedUser = await User.findByIdAndUpdate(id);
    res.render("users/account-settings", { loginUser: updatedUser , topImg , csrfToken: req.csrfToken() });
  }
}

module.exports.renderPasswordChange = async (req, res) => {
  const { id } = res.locals.currentUser; //ログイン中のユーザーのID
  const loginUser = await User.findById(id); //ログイン中のユーザーの情報を全て取得
  const topImg =  loginUser.image;
  res.render("users/password-change" , { topImg ,csrfToken: req.csrfToken()});
};

module.exports.passwordChange = async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!req.isAuthenticated()) {
    req.flash("error", "認証されていません");
    return res.redirect(`/user/login`);
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      req.flash("error", "ユーザーが見つかりません");
      return res.redirect(`/user/login`);
    }

    if (newPassword != confirmPassword) {
      req.flash("error", "新しいパスワードと確認用パスワードが一致しません");
      return res.redirect("/user/account/password_change");
    }

    user.authenticate(currentPassword, async (err, user, passwordError) => {
      if (err || passwordError) {
        req.flash("error", "現在のパスワードが正しくありません");
        return res.redirect("/user/account/password_change");
      }

      await user.setPassword(newPassword);
      await user.save();

      req.login(user, (err) => {
        if (err) {
          console.error("Re-login error:", err);
          req.flash("error", "ログインエラーが発生しました");
          return res.redirect(`/user/login`);
        }
        req.flash("success", "パスワードが正常に更新されました");
        return res.redirect("/user/account/password_change");
      });
    });
  } catch (error) {
    console.error("Password update error:", error);
    res
      .status(500)
      .json({ message: "パスワードの更新中にエラーが発生しました" });
  }
};

module.exports.addBookmark = async (req, res) => {
  try {
    const novelId = req.body.novelId;
    const userId = req.user._id;

    // 既存のブックマークを確認
    let bookmark = await Bookmark.findOne({ user: userId, novel: novelId });
    if (bookmark) {
      return res.json({
        success: false,
        message: "既にブックマークされています",
      });
    }

    bookmark = new Bookmark({
      user: userId,
      novel: novelId,
    });

    await bookmark.save();

    res.json({ success: true, message: "ブックマークに追加しました" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "サーバーエラーが発生しました" });
  }
};

module.exports.renderNovelHome = async (req, res) => {
  const { id } = res.locals.currentUser; //ログイン中のユーザーのID
  const loginUser = await User.findById(id); //ログイン中のユーザーの情報を全て取得
  const topImg =  loginUser.image.url;
  res.redirect("/novel/home" , {topImg ,csrfToken: req.csrfToken()});
};

module.exports.renderBookmarkLists = async (req, res) => {
  const userId = req.user._id;
  try {
    const bookmarks = await Bookmark.find({ user: userId }).populate({
      path: "novel",
      populate: {
        path: "author",
        model: "Author",
      },
    });

    const { id } = res.locals.currentUser; //ログイン中のユーザーのID
  const loginUser = await User.findById(id); //ログイン中のユーザーの情報を全て取得
  const topImg =  loginUser.image;

    const novels = bookmarks.map((bookmark) => bookmark.novel);
    res.render("users/bookmark-list", { novels, topImg ,  csrfToken: req.csrfToken() });
  } catch (err) {
    console.log(err);
  }
};

module.exports.cancelBookmark = async (req, res) => {
  try {
    const novelId = req.body.novelId;
    const userId = req.user._id;

    // 既存のブックマークを確認して削除
    let result = await Bookmark.findOneAndDelete({
      user: userId,
      novel: novelId,
    });
    if (result) {
      return res.json({
        success: true,
        message: "ブックマークを解除しました",
      });
    } else {
      return res.json({
        success: false,
        message: "ブックマークの解除に失敗しました",
      });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "サーバーエラーが発生しました" });
  }
};

// ご意見・お問い合わせ画面へ遷移
module.exports.goToInquiry = async (req, res) => {
  if(res.locals.currentUser){
    const { id } = res.locals.currentUser; //ログイン中のユーザーのID
    const loginUser = await User.findById(id); //ログイン中のユーザーの情報を全て取得
    const topImg =  loginUser.image;
    res.render("users/inquiry-page" , {topImg, csrfToken: req.csrfToken()});
  }
};

// ご意見・お問い合わせ処理
module.exports.inquiry = async (req, res) => {
  const { email, subject, text } = req.body;
  const userId = req.user._id;
  try {
    const existingUser = await User.findOne({
      $or: [{ _id: userId }, { email }],
    });
    if (!existingUser) {
      req.flash("existError", "ログインしてください");
      return res.redirect("/user/login");
    }
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "taiga.hr12@gmail.com",
      subject: `${subject}`,
      html: `
      <p>From: ${email}</p>
      <p>Subject: ${subject}</p>
      <p>Message:</p>
      <p>${text}</p>
    `,
    });
    console.log("メール送信成功 : ", data);
    res.redirect("/user/after_page");
  } catch (err) {
    console.log("メール送信エラー : ", err);
  }
};