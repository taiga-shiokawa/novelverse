const BaseJoi = require("joi");
const extention = require("../utils/sanitize-html");

const Joi = BaseJoi.extend(extention); // XSS攻撃を避けるためのsanitize-html.js(escapeHTML())をJoiに継承させる

const userSchema = Joi.object({
  username: Joi.string().required().escapeHTML().min(3).max(30).messages({
    "string.base": "ユーザー名は文字列である必要があります",
    "string.empty": "ユーザー名を入力してください",
    "string.min": "ユーザー名は少なくとも3文字以上である必要があります",
    "string.max": "ユーザー名は30文字以下である必要があります",
    "any.required": "ユーザー名は必須です",
  }),
  email: Joi.string().required().escapeHTML().email().messages({
    "string.base": "メールアドレスは文字列である必要があります",
    "string.empty": "メールアドレスを入力してください",
    "string.email": "有効なメールアドレスを入力してください",
    "any.required": "メールアドレスは必須です",
  }),
  password: Joi.string().required().escapeHTML().min(8).messages({
    "string.base": "パスワードは文字列である必要があります",
    "string.empty": "パスワードを入力してください",
    "string.min": "パスワードは少なくとも8文字以上である必要があります",
    "any.required": "パスワードは必須です",
  }),
  _csrf: Joi.string().required()
}).required();

const userAccountCreateValidate = (data) => {
  const { error } = userSchema.validate(data, { abortEarly: false });
  if (error) {
    const errors = {};
    error.details.forEach((err) => {
      errors[err.path[0]] = err.message;
    });
    return errors;
  }
  return null;
};

module.exports = userAccountCreateValidate;
