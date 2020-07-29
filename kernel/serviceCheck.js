const hdlServiceChecks = (serviceName, req, data) => {
    const { config, validate, sanitize } = req.app.kernel;

    for (const key in req.params) data[key] = req.params[key];
    for (const key in req.query) data[key] = req.query[key];
    for (const key in req.body) data[key] = req.body[key];

    if (config.ms.VALIDATION_ENABLED) {
        const [hasError, errMessage] = validate(req.method, serviceName, data);

        if (hasError) return [hasError, errMessage];
    }

    if (config.ms.SANITIZATION_ENABLED)
        data = sanitize(req.method, serviceName, data);

    if (config.ms.CASCADE_REQ) data["req"] = req;

    //if (config.cascadeRequest) data["req"] = req;
    return [false, ""];
};

module.exports = hdlServiceChecks;
