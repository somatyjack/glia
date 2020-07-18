const isInternal = (req, res, next) => {
    const host = req.headers.host;

    // we should not have origin for internal routes
    if (host.indexOf("localhost") === -1) {
        res.status(404).send({
            success: false,
            message: `route:${req.path} not found`,
        });
    }

    next();
};

module.exports = isInternal;
