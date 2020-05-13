const { parseRoutePath } = require("../../kernel/utils.kernel");
const mockedRequest = require("./mockedRequest");

const countries = {
  paramExpected: "countryId",
  batch: "LoadAllCountries",
  singleton: "LoadSingleCountry",
  routeAccess: "external",
};

const regions = {
  paramExpected: "countryId",
  batch: "LoadRegionsByCountryId",
  singleton: "LoadSingleRegion",
  routeAccess: "external",
};

const cities = {
  paramExpected: "regionId",
  batch: "LoadCitiesByRegionId",
  routeAccess: "external",
};

const routes = {
  GET: {
    "/v1/countries": countries,
    "/v1/countries/regions": regions,
    "/v1/countries/regions/cities": cities,
  },
};

describe("utils.kernel", () => {
  let mockedParams = {};

  beforeEach(async () => {
    mockedParams = await mockedRequest();
  });

  it("parseRoutePath - no route/wrong route", () => {
    mockedParams.req.method = "GET";
    mockedParams.req.params = [];
    let routeObj = parseRoutePath(mockedParams.req, routes);
    expect(routeObj).toBe(null);

    mockedParams.req.params = ["/v1"];
    routeObj = parseRoutePath(mockedParams.req, routes);
    expect(routeObj).toBe(null);

    mockedParams.req.params = ["/v1/"];
    routeObj = parseRoutePath(mockedParams.req, routes);
    expect(routeObj).toBe(null);
  });

  it("parseRoutePath - batch", () => {
    mockedParams.req.method = "GET";
    mockedParams.req.params = ["/v1/countries"];
    let routeObj = parseRoutePath(mockedParams.req, routes);
    expect(routeObj.serviceName).toBe("LoadAllCountries");

    mockedParams.req.params = ["/v1/countries/1/regions"];
    routeObj = parseRoutePath(mockedParams.req, routes);
    expect(routeObj.serviceName).toBe("LoadRegionsByCountryId");
  });

  it("parseRoutePath - singleton", () => {
    mockedParams.req.method = "GET";
    mockedParams.req.params = ["/v1/countries/1"];
    let routeObj = parseRoutePath(mockedParams.req, routes);
    expect(routeObj.serviceName).toBe("LoadSingleCountry");

    mockedParams.req.params = ["/v1/countries/1/regions/4"];
    routeObj = parseRoutePath(mockedParams.req, routes);
    expect(routeObj.serviceName).toBe("LoadSingleRegion");
  });
});
