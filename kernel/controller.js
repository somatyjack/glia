const hdlServiceChecks = require("./serviceCheck");
const logger = require("glia/middleware/logger/logger");

const controller = async (req, res, next) => {
    const { routeMap, services, providers, config } = req.app.kernel;

    const method = req.method;

    // get route based on first 2 values
    const subPath = req.path.split("/");
    const fullPath = `/${subPath[1]}/${subPath[2]}`;
    const { service, provider } = routeMap[req.method][fullPath];

    let data = {};

    // validate request and passed arguments
    const [hasError, errMessage] = hdlServiceChecks(service, req, data);
    if (hasError) {
        logger.log("error", errMessage, "validation");
        return res.status(200).send({ success: false, message: errMessage });
        //throw new ValidationError(errMessage, "hdlServiceChecks");
    }

    // assign all params from token to data
    for (let key in req.userToken) data[key] = req.userToken[key];

    try {
        if (provider) {
            // get provider function - check user permissions
            const extractIds = providers[provider];

            const isDone = await extractIds(data);
            if (!isDone) {
                res.status(403).send({
                    success: false,
                    message: "Access denied",
                });
            }
        }

        const serviceFunction = services[method][service];
        // execute service API defined within .services files

        const response = await serviceFunction(data);

        res.status(200).send({ success: true, response });
    } catch (err) {
        logger.log("error", err.message, "controller");
        next(err);
    }
};

module.exports = controller;
