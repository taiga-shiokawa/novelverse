const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const novelSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  is_new: {
    type: Boolean,
    required: true,
    default: false,
  },
  pages: {
    type: Number,
    required: true,
  },
  publisher_name: {
    type: String,
    required: true,
  },
  publication_date: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  novel_type: {
    type: String,
    required: true,
  },
  is_recommend: {
    type: Boolean,
    required: true,
    default: false,
  },
  cover: [
    {
      url: String,
      filename: String,
    },
  ], 
  author: {
    type: Schema.Types.ObjectId,
    ref: "Author",
  },
  genre: {
    type: Schema.Types.ObjectId,
    ref: "Genre",
  },
});

module.exports = mongoose.model("Novel", novelSchema);
