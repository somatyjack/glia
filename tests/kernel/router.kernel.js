"use strict";

const express = require("express");
const router = express.Router({ mergeParams: true });
const controller = require("./controller.kernel");

const { setReqUserVars } = require("./utils.kernel");
const { ServiceError, KernelError, NotFoundError } = require("./error.kernel");
/*
	shared validation of service betwen get/post/delete routes
*/

// extract nested routes
// TODO: Optimize more?
function breakNestedRoute(req, routes) {
  const paramString = req.params[0];
  const params = paramString.split("/");

  // extract every second param
  // example /countries/2/regions/14/cities/367
  // if nothing is sent array[0] = '/'
  if (params.length === 1) return null;

  if (params.length === 2)
    return {
      route: routes[req.method][params[1]],
      isSingleton: false,
    };

  if (params.length > 1) {
    let currentSubRoute = routes[req.method];
    let subRoute = params[1];
    // recursive
    for (let idx = 2; idx <= params.length; idx += 2) {
      currentSubRoute = currentSubRoute[subRoute];
      const paramName = currentSubRoute.paramName;

      if (params[idx]) req.params[paramName] = params[idx];
      subRoute = params[idx + 1];
    }

    return {
      route: currentSubRoute,
      isSingleton: params.length % 2 === 1 ? true : false, // check if batch or singleton is called
    };
  }
}

function validation(req, res, next) {
  const accessType = req.accessType;

  const { services, routes } = req.app.kernel;

  let routeObj = {};
  try {
    routeObj = breakNestedRoute(req, routes);
    // remove full route from params
    delete req.params[0];
  } catch (e) {
    console.log(e);
    throw new KernelError(
      `Kernel/Failed to parse route:${req.params[0]}. Route does not exist or there is syntax problem`
    );
  }

  const { route, isSingleton } = routeObj;

  // basec on accessType use public routes or auth routes,
  // this will restrict access for public routes and allow auth routes to access everything

  // for authservice only set user's variables
  if (accessType === "authservice") {
    // intialize vars passed by load balancer -> userId,profileId
    setReqUserVars(req);

    console.log("¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬");
    console.log(req.query);
    console.log(req.body);
  }

  const met = req.method;

  // considering only GET/POST/DELETE
  // HACK -> because we have a problem with Image service see doc
  // copy all keys from query to body ONLY FOR POST
  if (req.method === "POST") {
    Object.keys(req.query).forEach((key) => {
      req.body[key] = req.query[key];
    });
  }

  const routeType =
    req.method === "GET" ? req.query.routeType : req.body.routeType;

  try {
    if (!routeObj)
      throw new KernelError(`Kernel/Failed url patname is not specified`);

    const serviceRouteType = route.routeType;

    // what should we run based on params passed
    const serviceName =
      isSingleton && route.singleton !== "" ? route.singleton : route.batch;

    // check that routeType of the route matches with routeType of the requestName
    if (serviceRouteType !== routeType && serviceRouteType !== "both")
      throw new KernelError(
        `Kernel/Failed to find ${req.method} Request: for routeType: ${routeType}`
      );

    // check if such service is available within service file
    if (!services[met][serviceName])
      throw new KernelError(
        `Kernel/Failed to find specified service: ${serviceName}`
      );
    // this confirm that serviceName exists
    req.serviceName = serviceName;

    next();
  } catch (e) {
    // if route not found, throw 404
    if (!serviceObj) next(new NotFoundError(e.message, "KernelRouter"));
    else {
      next(new ServiceError(e.message, "KernelRouter"));
      //res.status(500).send(e);
    }
  }
}

// dynamically resolve route path
router.all("*", validation, controller);

module.exports = router;
