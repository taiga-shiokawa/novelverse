const BaseJoi = require("joi");
const extention = require("../utils/sanitize-html");

const Joi = BaseJoi.extend(extention); // XSS攻撃を避けるためのsanitize-html.js(escapeHTML())をJoiに継承させる

const userSchema = Joi.object({
  email: Joi.string().escapeHTML().email().required().messages({
    "string.base": "メールアドレスは文字列である必要があります",
    "string.email": "有効なメールアドレスを入力してください",
    "any.required": "メールアドレスは必須です"
  }),
  password: Joi.string().required().messages({
    "string.base": "パスワードは文字列である必要があります",
    "any.required": "パスワードは必須です"
  }),
  _csrf: Joi.string().required()
}).required();

const userLoginValidate = (data) => {
  const { error } = userSchema.validate(data, { abortEarly: false });
  if (error) {
    const errors = {};
    if (error.details && Array.isArray(error.details)) {
      error.details.forEach((err) => {
        if (err.path[0] !== '_csrf') { // CSRFエラーはクライアントに送信しない
          errors[err.path[0]] = err.message;
        }
      });
    } else {
      // エラーの詳細が期待通りの形式でない場合の処理
      errors.general = "入力内容を確認してください";
    }
    return Object.keys(errors).length > 0 ? errors : null;
  }
  return null;
};

module.exports = userLoginValidate;