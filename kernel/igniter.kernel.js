"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const logger = require("../middleware/logger/logger");
const app = express();
const router = require("./router.kernel");
const { handleResponse } = require("./error.kernel");
const { corsOptions } = require("./utils.kernel");

const igniter = {
  start: function (appModules) {
    const { config } = appModules;

    // Set up a whitelist and check against it:
    var whiteList = config.all.corsWhiteList();
    logger.init(config);

    app.use((req, res, next) => {
      // if host requested resource internally -> origin will be undefined, so we need to check that host
      // is part of the allowed list, otherwise forbid
      // Need to log Origin and Host
      //console.log(req.headers.origin)
      //console.log(req.headers.host)
      if (!req.headers.origin)
        if (whiteList.indexOf(req.headers.host) !== -1)
          req.headers.origin = req.headers.host;
      next();
    }, cors(corsOptions(whiteList)));

    /*
    app.use((req, res, next) => {
      console.log("request time:", new Date().getTime());
    });
*/
    // Parse incoming requests data
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    app.use(`/api/${config.ms.MS_NAME}`, router);

    // add properties to be accessable from req.app.kernel
    app.kernel = appModules;

    // error handling middleware
    app.use((err, req, res, next) => {
      handleResponse(err, res);
    });

    // to delete
    const errors = require("./error.kernel");
    errors.InitErrorCodes(config.ms.ERROR_CODES);

    const port = config.ms.PORT;

    app.listen(port, function () {
      console.log(`------------------------------------------------`);
      console.log(`Server: ${config.ms.MS_NAME} started on port: ${port}`);
      console.log(`Logs path: ${config.ms.LOGS_PATH}`);
      console.log(`------------------------------------------------`);
    });

    process.on("unhandledRejection", (error, promise) => {
      console.log(" promise rejection here: ", promise);
      console.log(" The error was: ", error);
    });

    process.on("SIGINT", () => {
      console.log("Server is shutting down");
      logger.closeLogging();
      process.exit();
    });
  },
};

module.exports = igniter;
