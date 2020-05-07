const mockedConfig = require("../mocked/mockedConfig");
const { InitErrorCodes } = require("../../kernel/error.kernel");
InitErrorCodes(mockedConfig.ms.ERROR_CODES);
const logger = require("../../middleware/logger/logger");
logger.init(mockedConfig);

const controller = require("../../kernel/controller.kernel");
const mockedRequest = require("./mockedRequest");

describe("controller.kernel", () => {
  let mockedParams = {};

  beforeEach(async () => {
    mockedParams = await mockedRequest();
  });

  test("testing controller success response - External Route", async () => {
    mockedParams.req.method = "GET";
    mockedParams.req.serviceName = "GetTest";
    await controller(...Object.values(mockedParams));
    // called when controller responds with data from service
    // res.status(200).send(response);
    expect(mockedParams.sendMocked.mock.calls.length).toBe(1);
  });

  test("testing controller success response - Internal Route", async () => {
    mockedParams.req.method = "GET";
    mockedParams.req.query = { routeType: "internal" };
    mockedParams.req.serviceName = "GetTest";

    await controller(...Object.values(mockedParams));

    // called when controller responds with data from service
    // res.status(200).send(response);
    expect(mockedParams.sendMocked.mock.calls.length).toBe(1);
  });

  test("testing controller runtime error response", async () => {
    mockedParams.req.method = "GET";
    mockedParams.req.serviceName = "GetTestRuntimeError";

    await controller(...Object.values(mockedParams));
    // called when error occurs in service
    expect(mockedParams.next.mock.calls.length).toBe(1);
  });

  test("testing controller custom error response", async () => {
    mockedParams.req.method = "GET";
    mockedParams.req.serviceName = "GetTestError";

    await controller(...Object.values(mockedParams));
    // called when error occurs in service
    expect(mockedParams.next.mock.calls.length).toBe(1);
  });
});
