const Joi = require("@hapi/joi");
const logger = require("glia/middleware/logger/logger");

const schemaValidator = (route, dataToValidate) => {
    // get validation schema
    //const validationSchema = validationSchemas[method][serviceName];
    const validationSchema = route.schema;
    if (!validationSchema) {
        logger.log(
            "error",
            `Validation schema for ${route.service} is not defined.`,
            `Schema validation`
        );

        return [true, `Validation schema for ${route.service} is not defined`];
    }

    const schemaObj = Joi.object(validationSchema);

    // validate all passed data against schema
    const { error, value } = schemaObj.validate(dataToValidate);

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
            return [true, validErrors];
        } else {
            logger.log("error", error.details[0].message, "MsKernel");
            return [true, error.details[0].message];
        }
    }

    return [false, ""];
};

const hdlServiceChecks = (route, req, data) => {
    const { config, validate, sanitize } = req.app.kernel;

    for (const key in req.params) data[key] = req.params[key];
    for (const key in req.query) data[key] = req.query[key];
    for (const key in req.body) data[key] = req.body[key];

    if (config.ms.VALIDATION_ENABLED) {
        const [hasError, errMessage] = schemaValidator(route, data);

        if (hasError) return [hasError, errMessage];
    }

    if (config.ms.SANITIZATION_ENABLED)
        data = sanitize(req.method, route.service, data);

    if (config.ms.CASCADE_REQ) data["req"] = req;

    //if (config.cascadeRequest) data["req"] = req;
    return [false, ""];
};

module.exports = hdlServiceChecks;
