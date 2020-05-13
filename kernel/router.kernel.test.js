const mockedConfig = require("../tests/mocked/mockedConfig");
const { InitErrorCodes } = require("./error.kernel");
InitErrorCodes(mockedConfig.ms.ERROR_CODES);
const mockedRequest = require("../tests/kernel/mockedRequest");

const cities = {
  paramExpected: "regionId",
  batch: "LoadCitiesByRegionId",
  routeAccess: "both",
};

const routes = {
  GET: {
    "/v1/countries/regions/cities": cities,
  },
};

const LoadCitiesByRegionId = async (data) => {
  return [];
};

const services = {
  GET: {
    LoadCitiesByRegionId,
  },
};

jest.mock("./controller.kernel");
jest.mock("./token.kernel");

const controller = require("./controller.kernel");
const token = require("./token.kernel");

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
  });

  it("route to controller - ", () => {
    mockedParams.req.method = "GET";
    mockedParams.req.params = ["/v1/countries/1/regions/12/cities"];
    validateRoute(...Object.values(mockedParams));
    expect(controller).toHaveBeenCalledTimes(1);
    //expect(token).toHaveBeenCalledTimes(1);
  });
});
