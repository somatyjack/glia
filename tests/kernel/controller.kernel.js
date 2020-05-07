const { hdlServiceChecks } = require("./ms.kernel");
const {
  ServiceError,
  DbError,
  ServiceInfo,
  ValidationError,
  ServiceSuccess,
  NotFoundError,
  KernelError,
} = require("./error.kernel");

const logger = require("../middleware/logger/logger");

const errResponder = {
  service_error: (errMessage, errLocation) => {
    logger.log("error", errMessage, errLocation);
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

const controller = async (req, res, next) => {
  const { services } = req.app.kernel;

  const method = req.method;

  try {
    req.isExternalRoute = req.query.routeType === "internal" ? false : true;

    // validate request and passed arguments
    const data = hdlServiceChecks(req, next);

    const serviceFunction = services[method][req.serviceName];
    // execute service API defined within .services files
    await serviceFunction(data)
      .then((rsp) => {
        const response = req.isExternalRoute
          ? { status: "success", resp: rsp }
          : rsp;
        res.status(200).send(response);
      })
      .catch((err) => {
        // check if we have a RunTime error or programmatically controlled
        if (!err.statusType)
          // only extended errors will have this field
          errResponder["SERVICE_ERROR"](err.stack, "RuntimeError");
        // this will also log error message and its location
        else errResponder[err.errorType](err.message, err.errLocation);
      });
  } catch (err) {
    // this will trigger error handling middleware
    // and response will be send back
    // this won't log anything
    next(err);
  }
};

module.exports = controller;
