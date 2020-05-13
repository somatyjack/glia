const jwt = require("jsonwebtoken");
const controller = require("./controller.kernel");

const token = async (req, res, next) => {
  jwt.verify(
    req.cookies.jwt,
    req.app.kernel.config.common.JWT_SECRET,
    (err, decoded) => {
      if (err) {
        console.log("TOKEN ERROR:", err);
        // token expired or does not exist, therefore we must dissallow accessing requested endpoint
        return res.status(403).send();
      }

      console.log("DECODED STUFF::_______");
      console.log(decoded);

      //   req.query.userId = uId;
      //   req.query.profileId = profileId;
      //   req.query.profileTz = profileTz;

      controller(req, res, next);
    }
  );
};

module.exports = token;
