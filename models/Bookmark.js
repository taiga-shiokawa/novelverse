const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookmarkSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  novel: {
    type: Schema.Types.ObjectId,
    ref: "Novel",
    required: true,
  },
});

// インデックスを追加して、ユーザーと小説の組み合わせがユニークであることを保証する
bookmarkSchema.index({user: 1, novel: 1}, {unique: true});

module.exports = mongoose.model("Bookmark", bookmarkSchema);
