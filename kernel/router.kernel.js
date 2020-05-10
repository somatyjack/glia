const express = require("express");
const router = express.Router({ mergeParams: true });
const controller = require("./controller.kernel");

const { setReqUserVars } = require("./utils.kernel");
const { ServiceError, KernelError, NotFoundError } = require("./error.kernel");

// extract nested routes
// TODO: Optimize more?
function breakNestedRoute(req, routes) {
  const paramString = req.params[0];
  const params = paramString.split("/");
  const apiVersion = req.headers.apiversion || "v1";
  let pathName = `/${apiVersion}/${params[1]}`;

  // extract every second param
  // example /countries/2/regions/14/cities/367
  // if nothing is sent array[0] = '/'
  if (params.length === 1) return null;

  if (params.length === 2) {
    if (!routes[req.method][pathName]) return null;
    return {
      route: routes[req.method][pathName],
      isSingleton: false,
    };
  }

  // check if no.of params is even or odd
  const isSingleton = params.length % 2 === 1 ? true : false;

  if (params.length > 1) {
    // this allows to identify is we are dealing with singleton or butch processing
    const startIndex = isSingleton ? params.length - 2 : params.length - 1;

    // get all routes for current method
    let currentSubRoute = routes[req.method];

    for (let idx = 3; idx <= params.length - 1; idx += 2) {
      pathName += `/${params[idx]}`;
    }

    // starting from the end, extract service name
    let idx = startIndex;
    currentSubRoute = currentSubRoute[pathName];
    const paramExpected = currentSubRoute.paramExpected;

    if (paramExpected !== "") {
      // if singleton
      if (params[idx + 1]) req.params[paramExpected] = params[idx + 1];
      else req.params[paramExpected] = params[idx - 1]; // batch
    }

    return {
      route: currentSubRoute,
      isSingleton, // check if batch or singleton is called
    };
  }
}

function validation(req, res, next) {
  const { services, routes } = req.app.kernel;
  const { method } = req;

  let routeObj = {};
  try {
    routeObj = breakNestedRoute(req, routes);
    // remove full route from params
    delete req.params[0];
  } catch (e) {
    throw new KernelError(
      `Kernel/Failed to parse route:${req.params[0]}. Route does not exist|| icorrect route version || syntax`
    );
  }

  // for authservice only set user's variables
  if (req.accessType === "authservice") {
    // intialize vars passed by load balancer -> userId,profileId
    setReqUserVars(req);

    console.log("¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬");
    console.log(req.query);
    console.log(req.body);
  }

  try {
    if (!routeObj)
      throw new KernelError(
        `Kernel/Failed url patname is not specified or is not correct`
      );

    const { route, isSingleton } = routeObj;

    const routeType =
      method === "GET" ? req.query.routeType : req.body.routeType;

    const serviceRouteType = route.routeType;

    // what should we run based on params passed
    const serviceName =
      isSingleton && route.singleton !== "" ? route.singleton : route.batch;

    // check that routeType of the route matches with routeType of the requestName
    if (serviceRouteType !== routeType && serviceRouteType !== "both")
      throw new KernelError(
        `Kernel/Failed to find ${method} Request: for routeType: ${routeType}`
      );

    // check if such service is available within service file
    if (!services[method][serviceName])
      throw new KernelError(`Kernel/Failed to find service`);
    // this confirm that serviceName exists
    req.serviceName = serviceName;

    next();
  } catch (e) {
    // if route not found, throw 404
    if (!routeObj) next(new NotFoundError(e.message, "KernelRouter"));
    else {
      next(new ServiceError(e.message, "KernelRouter"));
    }
  }
}

// dynamically resolve route path
router.all("*", validation, controller);

module.exports = router;
