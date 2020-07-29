const logger = require("glia/middleware/logger/logger");
// should always be called before isAuth middleware

const isInternal = (req, res, next) => {
    const host = req.headers.host;

    // we should not have origin for internal routes
    if (host.indexOf("localhost") === -1) {
        res.status(404).send({
            success: false,
            message: `route:${req.path} not found`,
        });

        logger.log(
            "error",
            `${host} attempted to access route:${req.path}. 404`,
            "host violation"
        );
    }

    // for isAuth middleware to bypass token validation
    res.locals.isInternallCall = true;

    next();
};

module.exports = isInternal;
