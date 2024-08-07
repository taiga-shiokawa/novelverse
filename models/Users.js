const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const rateLimit = require("express-rate-limit");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    requred: true,
    unique: true,
  },
  self_introdaction: {
    type: String,
  },
  birthday: {
    type: Date,
  },
  lastLoginDate: {
    type: Date
  },
  image: [
    {
      url: String,
      filename: String,
    },
  ],
  role: {
    type: String,
    default: "user",
  },

  loginAttempts: { type: Number, required: true, default: 0 },
  lockUntil: { type: Number },
});

// スキーマにインデックスを定義
userSchema.index({ lastLoginDate: 1 });

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 2 * 60 * 60 * 1000; // 2時間

userSchema.methods.incLoginAttempts = function(callback) {
  // ロックアウト期間が過ぎている場合はリセット
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    }, callback);
  }
  // ロックアウトされていない場合は試行回数を増やす
  const updates = { $inc: { loginAttempts: 1 } };
  // 最大試行回数を超えた場合はロック
  if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + LOCK_TIME };
  }
  return this.updateOne(updates, callback);
};

userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

module.exports = mongoose.model("User", userSchema);
