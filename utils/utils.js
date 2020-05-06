"use strict";

const logger = require("../middleware/logger/logger");
// const CONFIG = require('../config/config');
// const axios = require("axios");

// abstraction function to avoid writing try/catch in each service
const utils = {
  TE: (message, where) => {
    /*
        if(CONFIG.enableLogs)
			logger.log("error",message,where);
        */

    throw new Error(`${message}`);
  },
  //wrapping function, as it may be changed to queues in the future
  GetData: async (url, params) => {
    return new Promise((resolve, reject) => {
      let newParams = params;
      newParams["routeType"] = "internal";

      axios
        .get(url, { params: newParams })
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          if (error.code == "ECONNREFUSED")
            console.log("Refused to connect to:" + url);

          reject(error.response.data);
        });
    });
  },
  //wrapping function, as it may be changed to queues in the future
  PostData: async (url, params) => {
    return new Promise((resolve, reject) => {
      let newParams = params;
      newParams["routeType"] = "internal";

      axios({
        method: "post",
        url: url,
        data: newParams,
        config: { headers: { "Content-Type": "multipart/form-data" } },
      })
        .then(function (res) {
          resolve(res.data);
        })
        .catch((error) => {
          if (error.code == "ECONNREFUSED")
            console.log("Refused to connect to:" + url);

          reject(error.response.data);
        });
    });
  },
  DeleteData: async (url, params) => {
    return new Promise((resolve, reject) => {
      let newParams = params;
      newParams["routeType"] = "internal";

      axios
        .delete(url, {
          data: newParams,
        })
        .then(function (res) {
          resolve(res.data);
        })
        .catch((error) => {
          if (error.code == "ECONNREFUSED")
            console.log("Refused to connect to:" + url);

          reject(error.response.data);
        });
    });
  },
  ConvertToHoursMins: (time) => {
    if (time < 1) return "00:00";

    let hours = Math.floor(time / 60);
    hours = hours < 10 ? "0" + hours : hours;

    let minutes = time % 60;
    minutes = minutes > 10 ? minutes : minutes + "0";

    return hours + ":" + minutes;
  },
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
  // wrapping function, as it may be changed to queues in the future
  // function used for user logging and activities
  PostAndForget: function (url, params) {
    let newParams = params;
    newParams["routeType"] = "internal";

    axios({
      method: "post",
      url: url,
      data: newParams,
      config: { headers: { "Content-Type": "multipart/form-data" } },
    }).catch((error) => {
      if (error.code == "ECONNREFUSED")
        console.log("Refused to connect to:" + url);

      console.log(error);
    });
  },
};

module.exports = utils;
