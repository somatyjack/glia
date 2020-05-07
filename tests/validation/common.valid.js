const Joi = require("@hapi/joi");

module.exports = {
  // internal fields passed by nginx
  userId: Joi.number().integer().optional(),
  profileId: Joi.number().integer().optional(),
  profileTz: Joi.string().trim().optional(),
  // shared rules
  routeType: Joi.string().trim().valid("internal").optional(),
  wrapWithId: Joi.string().optional(),
};
