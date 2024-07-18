const mongoose = require("mongoose");
const { Schema } = mongoose;

const deletionReasonSchema = new Schema({
  reason: String,
  opinion: String,
  users: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
});

module.exports = mongoose.model("DeletionReason", deletionReasonSchema);