const mockedConfig = require("../mocked/mockedConfig");
const mockedRouter = require("../mocked/mockedRouter");
const mockedRouteMap = require("../mocked/mockedRouteMap");
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
                    router: mockedRouter,
                    routeMap: mockedRouteMap,
                    sanitize: jest
                        .fn()
                        .mockImplementation((req, serviceName, data) => data),
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
