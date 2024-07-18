const mongoose = require("mongoose");
const { Schema } = mongoose;

const deletionReasonSchema = new Schema({
  reason: String,
  opinion: String,
});

module.exports = mongoose.model("DeletionReason", deletionReasonSchema);