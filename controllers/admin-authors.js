const Author = require('../models/Authors');
const Novel = require('../models/Novels');

// 著者画面へ遷移
module.exports.renderAdminAuthors = async ( req , res ) => {
  const authors = await Author.find({});
  const count = await Novel.estimatedDocumentCount();
  res.render("admins/admin-authors" , { authors , count });
}

// 著者削除
module.exports.authorsDeletion = async (req , res) => {
  const { delete_author_id , delete_author_name } = req.body;

  let count = 0;
  count = await Novel.estimatedDocumentCount(delete_author_id);

  if( count != 0 ){
    req.flash('error' , `この著者の小説が存在するため、削除できません`);
  } else {
    const deleteAuthor = await Author.findByIdAndDelete(delete_author_id);
    req.flash('success' , `${delete_author_name }さんを削除しました`);
  }

  res.redirect("/admin-author/author-index");

}