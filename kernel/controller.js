const hdlServiceChecks = require("./serviceCheck");
const logger = require("../middleware/logger/logger");

const controller = async (req, res, next) => {
    const { routeMap, services, providers } = req.app.kernel;

    const method = req.method;

    // get route based on first 2 values
    const subPath = req.path.split("/");
    const fullPath = `/${subPath[1]}/${subPath[2]}`;
    const route = routeMap[method][fullPath];

    if (!route) {
        logger.log(
            "error",
            `${method} route for ${fullPath} does not exist`,
            "controller"
        );
        return res
            .status(404)
            .send({ success: false, message: "route not found" });
    }

    const { service, provider } = route;

    let data = {};

    // validate request and passed arguments
    const [hasError, errMessage] = hdlServiceChecks(route, req, data);
    if (hasError) {
        logger.log("error", errMessage, "validation");
        return res.status(200).send({ success: false, message: errMessage });
    }

    // assign all params from token to data
    for (let key in req.userToken) data[key] = req.userToken[key];

    try {
        /* NOT USED FOR NOW - future proof
        if (provider) {
            // get provider function - check pre service requirements
            const preServiceValid = providers[provider];

            const isDone = await preServiceValid(data);
            if (!isDone) {
                res.status(403).send({
                    success: false,
                    message: "Access denied",
                });
            }
        }
        */

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
