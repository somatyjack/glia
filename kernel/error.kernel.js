/**
 * Set of Errors for Client to better handle user behaviour
 * Can be disabled via Config and direct http errors will be returned instead
 */

let errCodes;

// generic error, occurs within Service/Model files
class ServiceError extends Error {
  constructor(message, errLocation) {
    super();
    console.log(errCodes);
    this.httpCode = errCodes.ServiceError.httpCode;
    this.statusCode = errCodes.ServiceError.statusCode;
    this.location = !errLocation ? "" : errLocation;
    this.message = message;
  }
}

// when all process went successfully and no errors found. Returns nothing or data
class ServiceSuccess extends Error {
  constructor(data) {
    super();
    this.httpCode = errCodes.ServiceSuccess.httpCode;
    this.statusCode = errCodes.ServiceSuccess.statusCode;
    this.message = data;
  }
}

// This should be thrown when we want to return useful information to userAgent
class ServiceInfo extends Error {
  constructor(message) {
    super();
    this.httpCode = errCodes.ServiceInfo.httpCode;
    this.statusCode = errCodes.ServiceInfo.statusCode;
    this.message = message;
  }
}

// this error should be hidden from user and generic db error should be returned instead,
// however error will be reported in the logs
class DbError extends Error {
  constructor(message, errLocation) {
    super();
    this.httpCode = errCodes.DbError.httpCode;
    this.statusCode = errCodes.DbError.statusCode;
    this.errLocation = !errLocation ? "" : errLocation;
    this.message = message;
  }
}

// return validation error. Usefull during form processing
class ValidationError extends Error {
  constructor(errors) {
    super();
    this.httpCode = errCodes.ValidationError.httpCode;
    this.statusCode = errCodes.ValidationError.statusCode;
    this.message = errors;
  }
}

class NotFoundError extends Error {
  constructor(err) {
    super();
    this.httpCode = errCodes.NotFoundError.httpCode;
    this.statusCode = errCodes.NotFoundError.statusCode;
    this.message = err;
  }
}

// errors within micro service kernel. i.e Router/Controller
class KernelError extends Error {
  constructor(err) {
    super();
    this.httpCode = errCodes.KernelError.httpCode;
    this.statusCode = errCodes.KernelError.statusCode;
    this.message = err;
  }
}

// service response handler
const handleResponse = (err, res) => {
  const { httpCode, statusCode, message } = err;
  console.log(err);
  res.status(httpCode).json({
    status: statusCode,
    resp: message,
  });
};

// allow to initialiase once on load
let initExecuted = false; // due to file scope, maybe a better way is available
const InitErrorCodes = (codes) => {
  return (function () {
    if (!initExecuted) {
      errCodes = codes;
      initExecuted = true;
    }
  })();
};

module.exports = {
  InitErrorCodes,
  ServiceError,
  ServiceInfo,
  DbError,
  ValidationError,
  ServiceSuccess,
  KernelError,
  NotFoundError,
  handleResponse,
};
