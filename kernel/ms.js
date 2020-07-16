const hdlServiceChecks = (req, data) => {
    const { config, validate, sanitize } = req.app.kernel;

    // if POST, save action to activity table - only for direct requests for now..
    /*
  if (config.savePostActivity && req.method === "POST" && req.isExternalRoute) {
    PostAndForget(route.activity("NewActivity"), {
      ...bodyParams,
      action: req.serviceName,
    });
  }
*/
    // copy all into one

    for (const key in req.params) data[key] = req.params[key];
    for (const key in req.query) data[key] = req.query[key];
    for (const key in req.body) data[key] = req.body[key];

    if (config.ms.VALIDATION_ENABLED) {
        const [hasError, errMessage] = validate(
            req.method,
            req.serviceName,
            data
        );
        if (hasError) return [hasError, errMessage];
    }

    if (config.ms.SANITIZATION_ENABLED)
        data = sanitize(req.method, req.serviceName, data);

    if (config.ms.CASCADE_REQ) data["req"] = req;

    //if (config.cascadeRequest) data["req"] = req;
    return [false, ""];
};

/* breaks down routes mapping into correct access pools
 *	authservice can access auth/public services
 *	pubservice can access only public services
 */
/* TO REMOVE */
/*
const routeAccessProcessor = (allRoutes) => {
  let authRoutes = {};
  let publicRoutes = {};

  // loop over GET/POST/DELETE Methods
  for (const method in allRoutes) {
    let methodRoutes = allRoutes[method];

    // init methods for the routes
    authRoutes[method] = {};
    publicRoutes[method] = {};

    // loop over routes
    for (const rt in methodRoutes) {
      let params = methodRoutes[rt];

      switch (params.accessType) {
        case "authservice":
          authRoutes[method][rt] = methodRoutes[rt];
          break;
        case "pubservice":
          // we want pubservice to be accessible by authenticated requests
          authRoutes[method][rt] = methodRoutes[rt];
          publicRoutes[method][rt] = methodRoutes[rt];
          break;
        default:
          break;
      }
    }
  }

  return {
    authRoutes,
    publicRoutes,
  };
};
*/

module.exports = {
    hdlServiceChecks,
    //routeAccessProcessor,
};