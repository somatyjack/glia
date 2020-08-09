const mockedConfig = require("../mocked/mockedConfig");
const mockedRoutes = require("../mocked/mockedRoutes");
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
                    routes: mockedRoutes,
                    validate: jest.fn(),
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
