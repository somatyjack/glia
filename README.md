# Glia

Lightweight Microservice Framework

[![npm (scoped)](https://img.shields.io/npm/v/glia)](https://github.com/somatyjack/glia)

[![codecov](https://codecov.io/gh/somatyjack/glia/branch/master/graph/badge.svg)](https://codecov.io/gh/somatyjack/glia)

## For those, who want to go real web bananas

> All you should care at the end of the day is your business logic

# Getting started in 4 simple steps

## Configure your service

> Database
> Paths for Logs/Validation/Sanitization/Configs (Althought default values are available)

## Setup routing

`
const timeZones = {
paramExpected: "timeZoneId", // param being passed with url
batch: "LoadTimeZones", // service function to be called
routeType: "internal", // how service is exposed internal | external
};

const routes = {
"/v1/time-zones": timeZones, // each endpoint can be version, by default all enpoints use v1  
}
`

## Define service - Business Logic

> all params will be available within data object
> `LoadTimeZones: async (data) => { let timeZones timeZones = await getModel.GetTimeZones(data); return timeZones; }`

## Define model - ( RAW | Sequelizer )

> Raw MySQL access example
> `
> GetTimeZones: async function (data) {

    const q = `SELECT * FROM time_zone WHERE active = 1`;

    const conn = await getConnection();
    const result = (await conn.query(q))[0];
    conn.release();

    if (result.length < 1)
      throw new DbError(
        "Time zone table does not contain any data",
        "GetTimeZones"
      );

    return result;

},
`

List of features:

- Pure JavaScript control over the BusinessLogic - you get input and you return output
- DB Layer - Sequelizer, Raw Queries(to support what Sequelizer struggles to do)
- Custom sanitizer provider with an option to override
- @hapi/joi fields validator with an option to plug your own
- Nested error handling. Option to customize response override
- Easy service pathnames processing

<!--
# What do you want to see as a next feature:

/polls "Error extension" 'Option 2' "Option 3"

[![](https://api.gh-polls.com/poll/01BY7ECS60GG8F9AR1VMR8745S/Error%20extension)](https://api.gh-polls.com/poll/01BY7ECS60GG8F9AR1VMR8745S/Error%20extension/vote)
[![](https://api.gh-polls.com/poll/01BY7ECS60GG8F9AR1VMR8745S/Option%202)](https://api.gh-polls.com/poll/01BY7ECS60GG8F9AR1VMR8745S/Option%202/vote)
[![](https://api.gh-polls.com/poll/01BY7ECS60GG8F9AR1VMR8745S/Option%203)](https://api.gh-polls.com/poll/01BY7ECS60GG8F9AR1VMR8745S/Option%203/vote)
-->
