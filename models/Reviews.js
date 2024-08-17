const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const novelReviewSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  novel: {
    type: Schema.Types.ObjectId,
    ref: "Novel",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  postedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model("Review", novelReviewSchema);