// generic error, occurs within Service/Model files
class ServiceError extends Error {
  constructor(message, errLocation) {
    super();
    this.statusCode = 500;
    this.statusType = "error";
    this.errorType = "SERVICE_ERROR";
    this.errLocation = !errLocation ? "" : errLocation;
    this.message = message;
  }
}

// This should be thrown when we want to return useful information to userAgent
// for example, user made a booking and we need to return confirmation message
// user attempts to create second listing and we should throw message that only 1 listing is allowed
class ServiceInfo extends Error {
  constructor(message) {
    super();
    this.statusCode = 200;
    this.statusType = "info";
    this.errorType = "SERVICE_INFO";
    this.message = message;
  }
}

// when all process went successfully and no errors found, returns nothing or data
class ServiceSuccess extends Error {
  constructor(data) {
    super();
    this.statusCode = 200;
    this.statusType = "success";
    this.errorType = "SERVICE_SUCCESS";
    this.message = data;
  }
}

// this error will be hidden from user and generic db error should be returned
class DbError extends Error {
  constructor(message, errLocation) {
    super();
    this.statusCode = 500;
    this.statusType = "db_error";
    this.errorType = "DB_ERROR";
    this.errLocation = !errLocation ? "" : errLocation;
    this.message = message;
  }
}

// when we fill fields that are validated against db, we return errors that are 200
class FormError extends Error {
  constructor(formErrors) {
    super();
    this.statusCode = 200;
    this.statusType = "form_error";
    this.errorType = "FORM_ERROR";
    this.message = formErrors;
  }
}

class NotFoundError extends Error {
  constructor(err) {
    super();
    this.statusCode = 404;
    this.statusType = "not_found_error";
    this.errorType = "NOT_FOUND_ERROR";
    this.message = err;
  }
}

class KernelError extends Error {
  constructor(err) {
    super();
    this.statusCode = 500;
    this.statusType = "kernel_error";
    this.errorType = "KERNEL_ERROR";
    this.message = err;
  }
}

const handleResponse = (err, res) => {
  const { statusCode, statusType, message } = err;
  console.log(err);
  res.status(statusCode).json({
    status: statusType,
    resp: message,
  });
};

module.exports = {
  ServiceError,
  ServiceInfo,
  DbError,
  FormError,
  ServiceSuccess,
  KernelError,
  NotFoundError,
  handleResponse,
};
