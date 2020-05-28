const jwt = require("jsonwebtoken");
const controller = require("./controller.kernel");
const logger = require("../middleware/logger/logger");

const token = async (req, res, next) => {
  jwt.verify(
    req.cookies.jwt,
    req.app.kernel.config.common.JWT_SECRET,
    (err, decoded) => {
      if (err) {
        logger.log("token_error", err.message, req.pathName);
        // token expired or does not exist, therefore we must forbid accessing requested endpoint
        return res.status(401).send(err.message);
      }

      req.userToken = decoded.user;

      controller(req, res, next);
    }
  );
};

module.exports = token;
