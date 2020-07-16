const logger = require("glia/middleware/logger/logger");
const errorMapper = require("glia/utils/errorMapper");

/**
 * Set of Errors for Client to better handle user behaviour
 * Can be disabled via Config and direct http errors will be returned instead
 * Errors should never exposed location of the error - strictly for logging
 */

let errCodes;

// generic error, occurs within Service/Model files
class ServiceError extends Error {
    constructor(message, errLocation) {
        super();
        this.httpCode = errCodes.ServiceError.httpCode;
        this.customCode = errCodes.ServiceError.customCode;
        this.errLocation = !errLocation ? "" : errLocation;
        this.message = message;
    }
}

// when all process went successfully and no errors found. Returns nothing or data
class ServiceSuccess extends Error {
    constructor(data) {
        super();
        this.httpCode = errCodes.ServiceSuccess.httpCode;
        this.customCode = errCodes.ServiceSuccess.customCode;
        this.message = data;
    }
}

// This should be thrown when we want to return useful information to userAgent
class ServiceInfo extends Error {
    constructor(message) {
        super();
        this.httpCode = errCodes.ServiceInfo.httpCode;
        this.customCode = errCodes.ServiceInfo.customCode;
        this.message = message;
    }
}

// this error should be hidden from user and generic db error should be returned instead,
// however error will be reported in the logs
class DbError extends Error {
    constructor(message, errLocation) {
        super();
        this.httpCode = errCodes.DbError.httpCode;
        this.customCode = errCodes.DbError.customCode;
        this.errLocation = !errLocation ? "" : errLocation;
        this.message = message;
    }
}

// return validation error. Usefull during form processing
class ValidationError extends Error {
    constructor(errors) {
        super();
        this.httpCode = errCodes.ValidationError.httpCode;
        this.customCode = errCodes.ValidationError.customCode;
        this.message = errors;
    }
}

class NotFoundError extends Error {
    constructor(err) {
        super();
        this.httpCode = errCodes.NotFoundError.httpCode;
        this.customCode = errCodes.NotFoundError.customCode;
        this.message = err;
    }
}

// errors within micro service kernel. i.e Router/Controller
class KernelError extends Error {
    constructor(err) {
        super();
        this.httpCode = errCodes.KernelError.httpCode;
        this.customCode = errCodes.KernelError.customCode;
        this.message = err;
    }
}

// service response handler
const handleResponse = (err, res) => {
    const { httpCode, customCode, message } = err;

    if (customCode !== "success" && customCode !== "service_info")
        logger.log(customCode, err.message, err.errLocation);

    res.status(httpCode).json({
        success: httpCode === 200 ? true : false,
        message: httpCode === 200 ? message : errorMapper[httpCode],
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
