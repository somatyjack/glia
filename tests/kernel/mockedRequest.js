const mockedConfig = require("../mocked/mockedConfig");
const mockedRoutes = require("../mocked/mockedRoutes");
const mockedValidator = require("../mocked/mockedValidator");
const mockedSanitizer = require("../mocked/mockedSanitizer");
const mockedErrResponder = require("../mocked/mockedErrResponder");
const mockedServices = require("../services");

const mockedRequest = () => {
  let sendMocked = jest.fn();
  let jsonMocked = jest.fn();

  const params = {
    req: {
      method: "",
      serviceName: "",
      params: {},
      query: {},
      body: {},
      app: {
        kernel: {
          config: mockedConfig,
          errResponder: mockedErrResponder,
          routes: mockedRoutes,
          validate: mockedValidator,
          sanitize: mockedSanitizer,
          services: mockedServices,
        },
      },
    },
    res: {
      status: (code) => {
        return {
          send: sendMocked,
          json: jsonMocked,
        };
      },
    },
    next: jest.fn(),
    sendMocked,
    jsonMocked,
  };

  return params;
};

module.exports = mockedRequest;