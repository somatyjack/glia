/* routetype
 * 	internal - service must be used only between micro services(TRANSFER) and not accessible by "DIRECT" access
 * 	external - service can be access "DIRECTLY" from the frontend
 */

/*
const routes = {
  "service-categories-by-type-id": {
    service: "LoadServiceCatsByTypeId",
    routeType: "internal",
  },
  "regions-by-country-id": {
    service: "LoadRegionsByCountryId",
    routeType: "both",
  },
  "cities-per-region": {
    service: "LoadCitiesGroupedByRegion",
    routeType: "both",
  },
  "cities-by-region-id": {
    service: "LoadCitiesByRegionId",
    routeType: "both",
  },
  "all-countries/:id/regions/:regionId/cities/:cityId": {
    service: "LoadAllCountries",
    routeType: "both",
  },
  "all-service-types": {
    service: "LoadAllServiceTypes",
    routeType: "internal",
  },
  "all-service-categories": {
    service: "LoadAllServiceCategories",
    routeType: "external",
  },
  "service-categories-with-ids": {
    service: "LoadCategoriesWithIds",
    routeType: "internal",
  },
  "service-types-with-ids": {
    service: "LoadServiceTypeWithIds",
    routeType: "internal",
  },
  "all-time-zones": {
    service: "LoadAllTimeZones",
    routeType: "internal",
  },
  "time-zone": {
    service: "LoadTimeZone",
    routeType: "internal",
  },
  "time-zone-id": {
    service: "LoadTimeZoneId",
    routeType: "internal",
  },
  "service-type-by-id": {
    service: "LoadServiceTypeById",
    routeType: "internal",
  },
};
*/

const routes = {
  countries: {
    paramName: "countryId",
    batch: "LoadAllCountries",
    singleton: "",
    routeType: "both",
    regions: {
      paramName: "regionId",
      batch: "LoadRegionsByCountryId",
      singleton: "",
      routeType: "both",
      cities: {
        paramName: "cityId",
        batch: "LoadCitiesByRegionId",
        singleton: "",
        routeType: "both",
      },
    },
  },
};

module.exports = routes;
