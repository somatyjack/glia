const { ServiceError } = require("../../kernel/error.kernel");

module.exports = {
  GetTest: async (data) => {
    const categories = [];
    return categories;
  },
  GetTestWithQuery: async (data) => {
    const categories = [];
    return categories;
  },
  GetTestError: async (data) => {
    throw new ServiceError("Testing Error Response", "GetTestError");
  },
  GetTestRuntimeError: async (data) => {
    undefinedfunction();
    return "";
  },
};
