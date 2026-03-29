const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

module.exports.validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    weather: Joi.string().required().messages({
      "string.empty": 'The "weather" field must be filled in',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
  }),
});
module.exports.validateUserBody = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string().min(2).max(30).messages({
        "string.min": 'The minimum length of the "name" field is 2',
        "string.max": 'The maximum length of the "name" field is 30',
        "string.empty": 'The "name" field must be filled in',
      }),
      username: Joi.string().min(2).max(30).messages({
        "string.min": 'The minimum length of the "username" field is 2',
        "string.max": 'The maximum length of the "username" field is 30',
        "string.empty": 'The "username" field must be filled in',
      }),
      avatar: Joi.string().required().custom(validateURL).messages({
        "string.empty": 'The "avatar" field must be filled in',
        "string.uri": 'the "avatar" field must be a valid url',
      }),
      email: Joi.string().required().email().messages({
        "string.email": 'The "email" field must be a valid email',
        "string.empty": 'The "email" field must be filled in',
      }),
      password: Joi.string().required().min(6).messages({
        "string.min": 'The minimum length of the "password" field is 6',
        "string.empty": 'The "password" field must be filled in',
      }),
    })
    .or("name", "username")
    .messages({
      "object.missing":
        'Either the "name" or "username" field must be provided',
    }),
});

module.exports.validateProfileBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'the "avatar" field must be a valid url',
    }),
  }),
});

module.exports.validateLoginBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.email": 'The "email" field must be a valid email',
      "string.empty": 'The "email" field must be filled in',
    }),
    password: Joi.string().required().min(6).messages({
      "string.min": 'The minimum length of the "password" field is 6',
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});
module.exports.validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required().messages({
      "string.hex": 'The "userId" field must be a valid hex',
      "string.length": 'The "userId" field must be 24 characters long',
      "string.empty": 'The "userId" field must be filled in',
    }),
  }),
});

module.exports.validateItemId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required().messages({
      "string.hex": 'The "itemId" field must be a valid hex',
      "string.length": 'The "itemId" field must be 24 characters long',
      "string.empty": 'The "itemId" field must be filled in',
    }),
  }),
});
