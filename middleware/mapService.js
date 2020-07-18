const mapService = (req, res, next) => {
    // get route based on first 2 values
    const subPath = req.path.split("/");
    const fullPath = `/${subPath[1]}/${subPath[2]}`;
    req.serviceName = req.app.kernel.routeMap[req.method][fullPath];

    next();
};

module.exports = mapService;
