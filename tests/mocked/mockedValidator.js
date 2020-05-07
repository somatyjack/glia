const Joi = require("@hapi/joi");
const {
  ServiceError,
  ValidationError,
  KernelError,
} = require("../../kernel/error.kernel");
const logger = require("../../middleware/logger/logger");
const CONFIG = require("./mockedConfig");
const validationSchemas = require("../../utils/validSanitLoader")(
  CONFIG.ms.VALIDATION_SCHEMAS_PATH,
  "valid"
);

const validator = (method, serviceName, dataToValidate) => {
  // get validation schema

  const validationSchema = validationSchemas[method][serviceName];

  if (!validationSchema) {
    logger.log(
      "error",
      `Validation schema for ${serviceName} is not defined. ${method}`,
      `Schema validation`
    );

    throw new ServiceError(
      `Schema failed to validate request ${method} parameters`,
      `${method}-Service`
    );
  }

  const schemaObj = Joi.object(validationSchema);

  // validate all passed data against schema
  const { error, value } = Joi.validate(dataToValidate, schemaObj);

  // if error, identify what kind of error
  if (error) {
    var validErrors = {};

    for (var errKey in error.details) {
      for (var key in error.details[errKey].path) {
        validErrors[error.details[errKey].path[key]] =
          error.details[errKey].message;
      }
    }

    // if form was submitted and there are validation errors we need to return it back
    if (dataToValidate["formSubmission"]) {
      throw new ValidationErrors(validErrors, "ParamSchemaValidation");
    } else {
      logger.log("error", error.details[0].message, "MsKernel");
      throw new KernelError(error.details[0].message, "MsKernel");
    }
  }
};

module.exports = validator;
