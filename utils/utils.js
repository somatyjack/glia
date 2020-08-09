const logger = require("glia/middleware/logger/logger");
const axios = require("axios");

// abstraction functions to avoid writing try/catch in each service
const utils = {
    //wrapping function, as it may be changed to queues in the future
    GetData: async (url, params = {}) => {
        let newParams = params;

        try {
            const { data } = await axios.get(url, { params: newParams });
            if (!data.success) return false;
            else return data.response;
        } catch (e) {
            logger.log("error", e.message, `GetData - ${url}`);
        }
    },
    //wrapping function, as it may be changed to queues in the future
    PostData: async (url, params = {}) => {
        let newParams = params;

        try {
            const { data } = await axios({
                method: "post",
                url: url,
                data: newParams,
                config: { headers: { "Content-Type": "multipart/form-data" } },
            });
            if (!data.success) return false;
            // if not data returned, return true
            else return data.response || true;
        } catch (e) {
            logger.log("error", e.message, `PostData - ${url}`);
        }
    },
    DeleteData: async (url, params = {}) => {
        let newParams = params;

        try {
            const { data } = await axios.delete(url, {
                data: newParams,
            });
            if (!data.success) return false;
            else return data.response;
        } catch (e) {
            logger.log("error", e.message, `PostData - ${url}`);
        }
    },
    ConvertToHoursMins: (time) => {
        if (time < 1) return "00:00";

        let hours = Math.floor(time / 60);
        hours = hours < 10 ? "0" + hours : hours;

        let minutes = time % 60;
        minutes = minutes > 10 ? minutes : minutes + "0";

        return hours + ":" + minutes;
    },
    // wrapping function, as it may be changed to queues in the future
    // function used for user logging and activities
    PostAndForget: function (url, params = {}) {
        let newParams = params;
        newParams["requestType"] = "internal";

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
