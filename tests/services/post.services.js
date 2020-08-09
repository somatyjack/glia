//const postModel = require("../models/post.model");
const { ServiceError } = require("../../kernel/error");

module.exports = {
    TestPost: async (data) => {
        console.log("sound........");
        console.log(data);

        throw new ServiceError("Some testing", "TestPost");

        return "";
    },
};
