"use strict";

/*
	Micro-service kernel contains logic for:
	- data sanitization
	- data validation against schema
	- service execution based on provided parameters
*/

//const CONFIG = require('../config/config');
const logger = require("../middleware/logger/logger");
const Joi = require("@hapi/joi");
//const route = require("../../../global_routes");
const { PostAndForget } = require("../utils/utils");
const { ServiceError, KernelError, FormError } = require("./error.kernel");

// --- Sanitization ------

/*
	0 - send NewActivity if required. Only for Post Services
	1 - sanitize data if required
	2 - validate data sent within request
	3 - execute load/save or delete service
*/

const hdlServiceChecks = (req, next) => {
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
  let data = {};
  for (const key in req.params) data[key] = req.params[key];
  for (const key in req.query) data[key] = req.query[key];
  for (const key in req.body) data[key] = req.body[key];

  if (config.ms.VALIDATION_ENABLED) validate(req.method, req.serviceName, data);

  if (config.ms.SANITIZATION_ENABLED)
    data = sanitize(req.method, req.serviceName, data);

  //if (config.cascadeRequest) data["req"] = req;
  return data;
};

/* breaks down routes mapping into correct access pools
 *	authservice can access auth/public services
 *	pubservice can access only public services
 */
/* TO REMOVE */
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

//from stackoverflow.com
const uuidv4 = function () {
  return "xxxxxxxxyx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const kernel = {
  hdlServiceChecks,
  routeAccessProcessor,
  uuidv4,
};

module.exports = kernel;
