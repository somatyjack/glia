const jwt = require("jsonwebtoken");
const logger = require("../middleware/logger/logger");

const isAuth = (req, res, next) => {
    jwt.verify(
        req.cookies.accessTkn,
        req.app.kernel.config.common.JWT_SECRET,
        (err, decoded) => {
            if (err) {
                logger.log("token_error", err.message, req.path);
                // token expired or does not exist, therefore we must forbid accessing requested endpoint
                return res
                    .status(401)
                    .send({ success: false, message: err.message });
            }

            req.userToken = decoded.user;

            next();
        }
    );
};

module.exports = isAuth;
