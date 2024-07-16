const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const novelSchema = new Schema({
  title: String,
  summary: String,
  is_new: false,
  pages: String,
  publication_info: String,
  price: Number,
  novel_type: Number,
  is_recommend: false,
  covers: String, // cloudinaryを使用するまで一旦ダミー画像を使用する.
  // covers: [
  //   {
  //     url: String,
  //     filename: String,
  //   },
  // ],
  author: {
    type: Schema.Types.ObjectId,
    ref: "Author",
  },
});

module.exports = mongoose.model("Novel", novelSchema);