const { hdlServiceChecks } = require("./ms.kernel");
const {
  ServiceError,
  DbError,
  ServiceInfo,
  FormError,
  ServiceSuccess,
  NotFoundError,
  KernelError,
} = require("./error.kernel");

const logger = require("../middleware/logger/logger");

const errResponder = {
  SERVICE_ERROR: (errMessage, errLocation) => {
    logger.log("error", errMessage, errLocation);
    throw new ServiceError(
      "Service error occurred. We are investigating and will take appropriate action to resolve it."
    );
  },
  DB_ERROR: (errMessage, errLocation) => {
    logger.log("db_error", errMessage, errLocation);
    // we do not inform user of the real problem
    throw new DbError("Data problem occurred. We are investigating");
  },
  SERVICE_INFO: (info) => {
    throw new ServiceInfo(info);
  },
  SERVICE_SUCCESS: (info) => {
    throw new ServiceSuccess(info);
  },
  FORM_ERROR: (formErrors) => {
    throw new FormError(formErrors);
  }, // array
  NOT_FOUND_ERROR: (err, errLocation) => {
    logger.log("not_found", err, errLocation);
    throw new NotFoundError("Requested resource was not found");
  },
  KERNEL_ERROR: (err, errLocation) => {
    logger.log("kernel_error", err, errLocation);
    throw new KernelError(
      "Service ran into a problem. Seems like something went wrong. We are investigating"
    );
  },
};

const controller = async (req, res, next) => {
  const { services, validation } = req.app.kernel;

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

/*

  // All POST Requests
  SaveData: async (req, res, next) => {
    const requestName = req.params.requestName;

    try {
      const schema = postValidation[req.serviceName];
      if (!schema) {
        logger.log(
          "error",
          `schema for ${req.serviceName} is not defined. ${req.method}`,
          `schema validation`
        );
        throw new ServiceError(
          `Schema failed to validate request ${req.method} parameters`,
          "SaveData"
        );
      }

      // attach schema to req
      req.schema = schema;

      req.isExternalRoute = req.body.routeType === "internal" ? false : true;

      // validate request and passed arguments
      const data = hdlServiceChecks(req, next, req.body);

      const serviceFunction = req.app.kernel.services.POST[req.serviceName];

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
  },
  DeleteData: async (req, res, next) => {
    const requestName = req.params.requestName;

    try {
      const schema = deleteValidation[req.serviceName];
      if (!schema) {
        logger.log(
          "error",
          `schema for ${req.serviceName} is not defined. ${req.method}`,
          `schema validation`
        );

        throw new ServiceError(
          `Schema failed to validate request ${req.method} parameters`,
          "DeleteData"
        );
      }

      // attach schema to req
      req.schema = schema;

      req.isExternalRoute = req.body.routeType === "internal" ? false : true;

      // validate request and passed arguments
      const data = hdlServiceChecks(req, next, req.body);

      const serviceFunction = req.app.kernel.services.DELETE[req.serviceName];

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
  },
*/
