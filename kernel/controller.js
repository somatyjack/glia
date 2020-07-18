const hdlServiceChecks = require("./serviceCheck");
const logger = require("glia/middleware/logger/logger");
// const { ValidationError } = require("glia/kernel/error");

const controller = async (req, res, next) => {
    const { services, errResponder, config } = req.app.kernel;

    const method = req.method;
    let data = {};

    //try {
    // validate request and passed arguments
    const [hasError, errMessage] = hdlServiceChecks(req, data);
    if (hasError) {
        logger.log("error", errMessage, "validation");
        return res.status(200).send({ success: false, message: errMessage });
        //throw new ValidationError(errMessage, "hdlServiceChecks");
    }

    // assign all params from token to data
    for (let key in req.userToken) data[key] = req.userToken[key];

    const serviceFunction = services[method][req.serviceName];
    // execute service API defined within .services files
    try {
        const response = await serviceFunction(data);

        res.status(200).send({ success: true, response });
    } catch (err) {
        next(err);
    }
    //.then((response) => {
    /*
        const response =
          req.isExternalRequest && config.ms.USE_CUSTOM_RESPONSE
            ? { status: "success", resp: rsp }
            : rsp;
        */

    //res.status(200).send({ success:true, response });
    //})
    //.catch((err) => {

    //next(err);
    /*
        // check if we have a RunTime error or programmatically controlled
        if (!err.customCode)
          // only extended errors will have this field
          errResponder["error"](err.stack, "RuntimeError");
        // this will also log error message and its location
        else errResponder[err.customCode](err.message, err.errLocation);
        */
    //});
    //} catch (err) {
    // this will trigger error handling middleware
    // and response will be sent back
    // this won't log anything
    //next(err);
    //}
};

module.exports = controller;
