const mockedConfig = require("../mocked/mockedConfig");
const logger = require("../../middleware/logger/logger");
logger.init(mockedConfig);

const {
  InitErrorCodes,
  ServiceError,
  ServiceInfo,
  DbError,
  ValidationError,
  ServiceSuccess,
  KernelError,
  NotFoundError,
  handleResponse,
} = require("../../kernel/error.kernel");
InitErrorCodes(mockedConfig.ms.ERROR_CODES);

const codes = require("../mocked/errorCodes");

const mockedRequest = require("./mockedRequest");

describe("error.kernel", () => {
  let mockedParams = {};

  beforeEach(async () => {
    mockedParams = await mockedRequest();
  });

  test("testing handleResponse", async () => {
    const mockedError = {
      httpCode: 200,
      customCode: "success",
      message: "",
    };

    await handleResponse(mockedError, mockedParams.res);
    expect(mockedParams.jsonMocked.mock.calls.length).toBe(1);
  });

  test("testing ServiceError", async () => {
    try {
      throw new ServiceError("ServiceError Test", "TestUnit");
    } catch (e) {
      expect(e.httpCode).toBe(codes.ServiceError.httpCode);
      expect(e.customCode).toBe(codes.ServiceError.customCode);
      expect(e.errLocation).toBe("TestUnit");
      expect(e.message).toBe("ServiceError Test");
    }

    try {
      throw new ServiceError("ServiceError Test");
    } catch (e) {
      expect(e.errLocation).toBe("");
    }
  });

  test("testing ServiceSuccess", async () => {
    try {
      throw new ServiceSuccess("ServiceSuccess");
    } catch (e) {
      expect(e.httpCode).toBe(codes.ServiceSuccess.httpCode);
      expect(e.customCode).toBe(codes.ServiceSuccess.customCode);
      expect(e.message).toBe("ServiceSuccess");
    }
  });

  test("testing ServiceInfo", async () => {
    try {
      throw new ServiceInfo("ServiceInfo");
    } catch (e) {
      expect(e.httpCode).toBe(codes.ServiceInfo.httpCode);
      expect(e.customCode).toBe(codes.ServiceInfo.customCode);
      expect(e.message).toBe("ServiceInfo");
    }
  });

  test("testing DbError", async () => {
    try {
      throw new DbError("DbError", "TestUnit");
    } catch (e) {
      expect(e.httpCode).toBe(codes.DbError.httpCode);
      expect(e.customCode).toBe(codes.DbError.customCode);
      expect(e.message).toBe("DbError");
      expect(e.errLocation).toBe("TestUnit");
    }

    try {
      throw new DbError("DbError");
    } catch (e) {
      expect(e.errLocation).toBe("");
    }
  });

  test("testing ValidationError", async () => {
    try {
      throw new ValidationError("ValidationError", "TestUnit");
    } catch (e) {
      expect(e.httpCode).toBe(codes.ValidationError.httpCode);
      expect(e.customCode).toBe(codes.ValidationError.customCode);
      expect(e.message).toBe("ValidationError");
    }
  });

  test("testing NotFoundError", async () => {
    try {
      throw new NotFoundError("NotFoundError", "TestUnit");
    } catch (e) {
      expect(e.httpCode).toBe(codes.NotFoundError.httpCode);
      expect(e.customCode).toBe(codes.NotFoundError.customCode);
      expect(e.message).toBe("NotFoundError");
    }
  });

  test("testing KernelError", async () => {
    try {
      throw new KernelError("KernelError", "TestUnit");
    } catch (e) {
      expect(e.httpCode).toBe(codes.KernelError.httpCode);
      expect(e.customCode).toBe(codes.KernelError.customCode);
      expect(e.message).toBe("KernelError");
    }
  });
});
