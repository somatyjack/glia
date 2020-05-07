const {
  ServiceError,
  DbError,
  ServiceInfo,
  ValidationError,
  ServiceSuccess,
  NotFoundError,
  KernelError,
} = require("../../kernel/error.kernel");
const logger = require("../../middleware/logger/logger");

const errResponder = {
  // for runtime errors
  error: (errMessage, errLocation) => {
    logger.log("error", errMessage, errLocation);
    throw new Error(
      "Internal error ocurred while executing service:" + errMessage
    );
  },
  service_error: (errMessage, errLocation) => {
    logger.log("service_error", errMessage, errLocation);
    throw new ServiceError(
      "Service error occurred. We are investigating and will take appropriate action to resolve it."
    );
  },
  db_error: (errMessage, errLocation) => {
    logger.log("db_error", errMessage, errLocation);
    // we do not inform user of the real problem
    throw new DbError("Data problem occurred. We are investigating");
  },
  service_info: (info) => {
    throw new ServiceInfo(info);
  },
  service_success: (info) => {
    throw new ServiceSuccess(info);
  },
  validation_error: (errors) => {
    throw new ValidationError(errors);
  }, // array
  not_found_error: (err, errLocation) => {
    logger.log("not_found", err, errLocation);
    throw new NotFoundError("Requested resource was not found");
  },
  kernel_error: (err, errLocation) => {
    logger.log("kernel_error", err, errLocation);
    throw new KernelError(
      "Service ran into a problem. Seems like something went wrong. We are investigating"
    );
  },
};

module.exports = errResponder;
