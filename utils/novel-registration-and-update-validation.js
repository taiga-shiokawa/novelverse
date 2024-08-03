const Joi = require("joi");
const ExpressError = require("./ExpressError");

const novelRegisrationtAndUpdateValidate = (req, res, next) => {
  const novelSchema = Joi.object({
    novel: Joi.object({
      title: Joi.string().required(),
      summary: Joi.string().required(),
      is_new: Joi.string().valid('on').optional(),
      pages: Joi.number().min(0).required(),
      publisher_name: Joi.string().required(),
      publication_date: Joi.date().required(),
      price: Joi.number().min(0).required(),
      novel_type: Joi.string().required(),
      amazon_url: Joi.string().allow(''),
      author: Joi.string().required(),
      genre: Joi.string().allow(''),
    }).required(),
    _csrf: Joi.string().optional()
  });

  const { error } = novelSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((detail) => detail.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports = novelRegisrationtAndUpdateValidate;
