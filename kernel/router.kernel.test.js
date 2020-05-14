const mockedConfig = require("../tests/mocked/mockedConfig");
const { InitErrorCodes } = require("./error.kernel");
InitErrorCodes(mockedConfig.ms.ERROR_CODES);
const mockedRequest = require("../tests/kernel/mockedRequest");

const cities = {
  paramExpected: "regionId",
  batch: "LoadCitiesByRegionId",
  routeAccess: "external",
};

const regions = {
  paramExpected: "countryId",
  batch: "LoadRegionsInternal",
  routeAccess: "internal",
};

const routes = {
  GET: {
    "/v1/countries/regions": regions,
    "/v1/countries/regions/cities": cities,
  },
};

const services = {
  GET: {
    LoadCitiesByRegionId: jest.fn(),
    LoadRegionsInternal: jest.fn(),
  },
};

jest.mock("./controller.kernel");
jest.mock("./token.kernel");
let controller = require("./controller.kernel");
let token = require("./token.kernel");

const { validateRoute } = require("./router.kernel");

describe("router.kernel", () => {
  let mockedParams = {};

  beforeEach(async () => {
    mockedParams = await mockedRequest();
    mockedParams.req.app = {
      kernel: {
        config: mockedConfig,
        routes: routes,
        services: services,
      },
    };

    //controller.clearAllMocks();
    jest.clearAllMocks();
  });

  it("route to controller - external call check", () => {
    mockedParams.req.method = "GET";
    mockedParams.req.queries = {};
    mockedParams.req.params = ["/v1/countries/1/regions/12/cities"];
    validateRoute(...Object.values(mockedParams));
    expect(controller).toHaveBeenCalledTimes(1);
  });

  it("route to controller - internal call && requestType is specified", () => {
    mockedParams.req.method = "GET";
    mockedParams.req.query = { requestType: "internal" };
    mockedParams.req.params = ["/v1/countries/1/regions"];
    validateRoute(...Object.values(mockedParams));
    expect(controller).toHaveBeenCalledTimes(1);
  });

  it("route to token - internal call && requestType is NOT specified", () => {
    mockedParams.req.method = "GET";
    mockedParams.req.query = {};
    mockedParams.req.params = ["/v1/countries/1/regions"];
    validateRoute(...Object.values(mockedParams));
    expect(token).toHaveBeenCalledTimes(1);
  });
});
