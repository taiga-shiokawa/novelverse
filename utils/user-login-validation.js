const BaseJoi = require("joi");
const extention = require("../utils/sanitize-html");

const Joi = BaseJoi.extend(extention); // XSS攻撃を避けるためのsanitize-html.js(escapeHTML())をJoiに継承させる

const userSchema = Joi.object({
  email: Joi.string().escapeHTML().messages({
    "string.base": "ユーザー名は文字列である必要があります",
  }),
  password: Joi.string().escapeHTML().messages({
    "string.base": "ユーザー名は文字列である必要があります",
  }),
}).required();

const userLoginValidate = (date) => {
  const { error } = userSchema.validate(date, { abortEarly: false });
  if (error) {
    const errors = {};
    errors.details.forEach((err) => {
      errors[err.path[0]] = err.message;
    });
    return errors;
  }
  return null;
};

module.exports = userLoginValidate;