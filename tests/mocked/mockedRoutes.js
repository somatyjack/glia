const countries = {
  paramExpected: "countryId",
  batch: "LoadAllCountries",
  singleton: "LoadSingleCountry",
  routeAccess: "both",
};

const regions = {
  paramExpected: "countryId",
  batch: "LoadRegionsByCountryId",
  singleton: "LoadSingleRegion",
  routeAccess: "both",
};

const cities = {
  paramExpected: "regionId",
  batch: "LoadCitiesByRegionId",
  routeAccess: "both",
};

const routes = {
  GET: {
    "/v1/countries": countries,
    "/v1/countries/regions": regions,
    "/v1/countries/regions/cities": cities,
  },
};

module.exports = routes;
