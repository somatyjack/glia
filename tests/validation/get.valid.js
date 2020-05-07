const Joi = require("@hapi/joi");

const validation = {
  GetTest: {},
  GetTestWithQuery: { queryTest: Joi.string().required() },
  GetTestWithAllArgs: {
    queryTest: Joi.string().required(),
    paramsTest: Joi.string().required(),
    bodyTest: Joi.string().required(),
  },
  GetTestError: {},
  GetTestRuntimeError: {},
};

module.exports = validation;
