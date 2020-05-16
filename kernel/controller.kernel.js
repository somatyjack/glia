const { hdlServiceChecks } = require("./ms.kernel");

const controller = async (req, res, next) => {
  const { services, errResponder, config } = req.app.kernel;

  const method = req.method;

  try {
    // validate request and passed arguments
    const data = hdlServiceChecks(req, next);

    // assign all params from token to data
    for (let key in req.userToken) data[key] = req.userToken[key];

    const serviceFunction = services[method][req.serviceName];
    // execute service API defined within .services files
    await serviceFunction(data)
      .then((rsp) => {
        const response =
          req.isExternalRequest && config.ms.USE_CUSTOM_RESPONSE
            ? { status: "success", resp: rsp }
            : rsp;

        res.status(200).send(response);
      })
      .catch((err) => {
        // check if we have a RunTime error or programmatically controlled
        if (!err.customCode)
          // only extended errors will have this field
          errResponder["error"](err.stack, "RuntimeError");
        // this will also log error message and its location
        else errResponder[err.customCode](err.message, err.errLocation);
      });
  } catch (err) {
    // this will trigger error handling middleware
    // and response will be sent back
    // this won't log anything
    next(err);
  }
};

module.exports = controller;
