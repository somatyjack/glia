module.exports = {
    GET: {
        "/v1/test-route": {
            service: "GetTest",
            schema: {},
        },
        "/v1/service-error": {
            service: "GetTestError",
            schema: {},
        },
        "/v1/runtime-route": {
            service: "GetTestRuntimeError",
            schema: {},
        },
    },
};
