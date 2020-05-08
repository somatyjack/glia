const Joi = require("@hapi/joi");
const { DbError } = require("./error.kernel");

/* 
	SHARED RULES - Passed by default from client/load balancer to server 
	set to optional, because nginx will pass it, but between micros, they should be set manually
******************/

var sharedRules = {
  callType: Joi.valid("direct", "transfer").required(),
  userId: Joi.number().integer().optional(),
  profileId: Joi.number().integer().optional(),
  profileTz: Joi.string().optional(), // time zone
};

// abstraction function to avoid writing try/catch in each service
const utils = {
  corsOptions: (whitelist) => {
    return {
      origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
    };
  },
  setReqUserVars: (req) => {
    var uId = parseInt(req.header("uid"));
    var profileId = parseInt(req.header("profileId"));
    var profileTz = req.header("profileTz"); // Time zone

    //console.log(req.header('uname'));

    if (!uId && !profileId) return;

    if (req.method == "GET") {
      req.query.userId = uId;
      req.query.profileId = profileId;
      req.query.profileTz = profileTz;
    } else if (req.method == "POST" || req.method == "DELETE") {
      req.body.userId = uId;
      req.body.profileId = profileId;
      req.body.profileTz = profileTz;
    }
  },
  // add shared rules to all get/post/delete validations
  addSharedRules: (schema) => {
    // loop over service validations
    for (const key in schema) {
      // loop over shared rules and add them for each above validation
      for (const rule in sharedRules) {
        schema[key][rule] = sharedRules[rule];
      }
    }
  },
  wrapWithTransaction: async function (conn, qHandle, transName) {
    try {
      await conn.beginTransaction();

      await qHandle();

      await conn.commit();
      await conn.release();
    } catch (e) {
      await conn.rollback();
      await conn.release();
      throw new DbError(e.message, transName);
    }
  },
};

module.exports = utils;
