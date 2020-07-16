"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const logger = require("../middleware/logger/logger");
const app = express();
const cookies = require("cookie-parser");
//const { router } = require("./router.kernel");

const { handleResponse } = require("./error");
const { corsOptions } = require("./utils");

const igniter = {
    start: function (appModules) {
        const { config, router, middleware } = appModules;
        logger.init(config);

        // TODO: Research on value of validating src at the micro service level
        const whiteList = config.common.corsWhiteList();

        app.use((req, res, next) => {
            // if host requested resource internally -> origin will be undefined, so we need to check that host
            // is part of the allowed list, otherwise forbid
            // Need to log Origin and Host
            //console.log(req.headers.origin)
            //console.log(req.headers.host)
            if (!req.headers.origin)
                if (whiteList.indexOf(req.headers.host) !== -1)
                    req.headers.origin = req.headers.host;

            if (config.common.env === "prod") cors(corsOptions(whiteList));
            else cors();

            next();
        });

        // Parse incoming requests data
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(cookies());

        // integrate custom middleware
        middleware.forEach((middlewareHook) => {
            app.use(middlewareHook);
        });

        app.use(`/`, router);

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
            console.log(
                `Server: ${config.ms.MS_NAME} started on port: ${port}`
            );
            console.log(`Logs path: ${config.ms.LOGS_PATH}`);
            console.log(
                `Validation path: ${config.ms.VALIDATION_SCHEMAS_PATH}`
            );
            console.log(
                `Sanitization path: ${config.ms.SANITIZATION_SCHEMAS_PATH}`
            );
            console.log(`------------------------------------------------`);
        });

        process.on("unhandledRejection", (error, promise) => {
            console.log("Promise rejection: ", promise);
            console.log("The error was: ", error);
        });

        process.on("SIGINT", () => {
            console.log(`Server: ${config.ms.MS_NAME} is shutting down`);
            logger.closeLogging();
            process.exit();
        });
    },
};

module.exports = igniter;
