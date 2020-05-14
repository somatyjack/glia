const express = require("express");
const router = express.Router({ mergeParams: true });
const token = require("./token.kernel");
const controller = require("./controller.kernel");

const { parseRoutePath } = require("./utils.kernel");
const { ServiceError, KernelError, NotFoundError } = require("./error.kernel");

function validateRoute(req, res, next) {
  const { services, routes } = req.app.kernel;
  const { method, query, body } = req;

  let routeObj = {};
  try {
    routeObj = parseRoutePath(req, routes);
    // remove full route from params
    // TO DO: avoid deletion
    delete req.params[0];
  } catch (e) {
    throw new KernelError(
      `Failed to parse route:${req.params[0]}. Route does not exist OR icorrect route version`
    );
  }

  try {
    if (!routeObj)
      throw new KernelError(`Uri patname is not specified or is not correct`);

    const { route, serviceName } = routeObj;

    // allows us to detect if other microservice has executed this service
    const serviceRequestType = query.requestType
      ? query.requestType
      : body.requestType;

    req.isExternalRequest = route.routeAccess === "internal" ? false : true;

    // check if such service is available within service file
    if (!services[method][serviceName])
      throw new KernelError(
        `Failed to find service: ${serviceName} for request:${method}`
      );

    // this confirm that serviceName exists
    req.serviceName = serviceName;

    // if routeAccess = internal AND this service is not called by other micro service -> validate token
    // otheriwise route traffic directly to controller

    if (route.routeAccess === "internal" && !serviceRequestType)
      token(req, res, next);
    else controller(req, res, next);
  } catch (e) {
    // if route not found, throw 404
    if (!routeObj) next(new NotFoundError(e.message, "KernelRouter"));
    else {
      next(new ServiceError(e.message, "KernelRouter"));
    }
  }
}

// dynamically resolve route path
router.all("*", validateRoute);

module.exports = {
  router,
  validateRoute,
};
