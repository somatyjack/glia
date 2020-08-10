jest.mock("./serviceCheck");

const mockedConfig = require("../tests/mocked/mockedConfig");
const { InitErrorCodes } = require("./error");
InitErrorCodes(mockedConfig.ms.ERROR_CODES);
const logger = require("../middleware/logger/logger");
logger.init(mockedConfig);

const controller = require("./controller");
const mockedRequest = require("../tests/kernel/mockedRequest");
const serviceCheck = require("./serviceCheck");

describe("controller.js", () => {
    let mockedParams = {};
    let sentResult;

    beforeEach(async () => {
        mockedParams = await mockedRequest();
        mockedParams.sendMocked.mockImplementation(
            (mockedResult) => (sentResult = mockedResult)
        );

        sentResult = null;
    });

    test("no error flow", async () => {
        mockedParams.req.method = "GET";
        mockedParams.req.path = "/v1/test-route";

        serviceCheck.mockImplementation(() => [false, ""]);

        await controller(...Object.values(mockedParams));
        expect(sentResult).toEqual({ success: true, response: [] });
    });

    test("route does not exist", async () => {
        mockedParams.req.method = "GET";
        mockedParams.req.path = "/v1/test-rout";

        serviceCheck.mockImplementation(() => [false, ""]);
        await controller(...Object.values(mockedParams));
        expect(sentResult).toEqual({
            success: false,
            message: "route not found",
        });
    });

    test("failed validation", async () => {
        mockedParams.req.method = "GET";
        mockedParams.req.path = "/v1/test-route";

        serviceCheck.mockImplementation(() => [
            true,
            "Parameter must be integer",
        ]);

        await controller(...Object.values(mockedParams));
        expect(sentResult).toEqual({
            success: false,
            message: "Parameter must be integer",
        });
    });

    test("runtime error within service block", async () => {
        mockedParams.req.method = "GET";
        mockedParams.req.path = "/v1/runtime-route";

        serviceCheck.mockImplementation(() => [false, ""]);
        await controller(...Object.values(mockedParams));
        expect(mockedParams.next.mock.calls.length).toBe(1);
    });

    test("error while executing service block", async () => {
        mockedParams.req.method = "GET";
        mockedParams.req.path = "/v1/service-error";

        serviceCheck.mockImplementation(() => [false, ""]);
        await controller(...Object.values(mockedParams));
        expect(mockedParams.next.mock.calls.length).toBe(1);
    });
});
