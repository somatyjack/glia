const mockedConfig = require("../mocked/mockedConfig");
const { InitErrorCodes } = require("../../kernel/error.kernel");
InitErrorCodes(mockedConfig.ms.ERROR_CODES);
const logger = require("../../middleware/logger/logger");
logger.init(mockedConfig);

const { hdlServiceChecks } = require("../../kernel/ms.kernel");
const mockedRequest = require("./mockedRequest");

describe("ms.kernel", () => {
  let mockedParams = {};

  beforeEach(async () => {
    mockedParams = await mockedRequest();
  });

  test("testing hdlServiceChecks Validation:On | Sanitization:On", async () => {
    mockedParams.req.method = "GET";
    mockedParams.req.serviceName = "GetTestWithAllArgs";
    mockedParams.req.query = { queryTest: "123" };
    mockedParams.req.params = { paramsTest: "456" };
    mockedParams.req.body = { bodyTest: "789" };

    const data = await hdlServiceChecks(...Object.values(mockedParams));

    expect(data.queryTest).toBe("123");
    expect(data.paramsTest).toBe("456");
    expect(data.bodyTest).toBe("789");
    expect(mockedParams.req.app.kernel.validate).toHaveBeenCalledTimes(1);
    expect(mockedParams.req.app.kernel.sanitize).toHaveBeenCalledTimes(1);
  });

  test("testing hdlServiceChecks Validation:Off | Sanitization:On", async () => {
    mockedParams.req.method = "GET";
    mockedParams.req.serviceName = "GetTestWithQuery";
    mockedParams.req.query = { queryTest: "123" };

    mockedConfig.ms.VALIDATION_ENABLED = false;

    const data = await hdlServiceChecks(...Object.values(mockedParams));

    expect(data.queryTest).toBe("123");
  });

  test("testing hdlServiceChecks Validation:Off | Sanitization:Off", async () => {
    mockedParams.req.method = "GET";
    mockedParams.req.serviceName = "GetTestWithQuery";
    mockedParams.req.query = { queryTest: "123" };

    mockedConfig.ms.SANITIZATION_ENABLED = false;

    const data = await hdlServiceChecks(...Object.values(mockedParams));

    expect(data.queryTest).toBe("123");
  });
});
