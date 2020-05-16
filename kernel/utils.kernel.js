/**
 * Glia utils
 */

const utils = {
  corsOptions: (whitelist) => {
    return {
      origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
    };
  },

  // extract nested routes
  // TODO: Optimize more?
  parseRoutePath: (req, routes) => {
    if (req.params.length == 0) return null;
    const paramString = req.params[0];
    const params = paramString.split("/");
    if (params.length <= 2) return null;

    let pathName = `/${params[1]}/${params[2]}`;
    //
    const subRoute = routes[req.method][pathName];
    if (params.length === 3) {
      if (!subRoute) return null;

      subRoute.pathName = pathName;

      return {
        route: subRoute,
        serviceName: subRoute.batch,
      };
    }

    // check if no.of params is even or odd
    const isSingleton = params.length % 2 === 0 ? true : false;

    if (params.length > 1) {
      // this allows to identify is we are dealing with singleton or butch processing
      const startIndex = isSingleton ? params.length - 2 : params.length - 1;

      // get all routes for current method
      let currentSubRoute = routes[req.method];

      // extract every second param
      // example /countries/2/regions/14/cities/367
      // if nothing is sent array[0] = '/'
      for (let idx = 4; idx <= params.length - 1; idx += 2) {
        pathName += `/${params[idx]}`;
      }

      // starting from the end, extract service name
      let idx = startIndex;
      currentSubRoute = currentSubRoute[pathName];
      currentSubRoute.pathName = pathName;

      const paramExpected = currentSubRoute.paramExpected;

      if (paramExpected !== "") {
        // if singleton
        if (params[idx + 1]) req.params[paramExpected] = params[idx + 1];
        else req.params[paramExpected] = params[idx - 1]; // batch
      }

      return {
        route: currentSubRoute,
        serviceName: isSingleton
          ? routes[req.method][pathName].singleton
          : routes[req.method][pathName].batch,
      };
    }
  },
  /*
 TO DELETE: ??
  wrapWithTransaction: async function (conn, qHandle, transName) {
    try {
      await conn.beginTransaction();

      await qHandle();

      await conn.commit();
      await conn.release();
    } catch (e) {
      await conn.rollback();
      await conn.release();
      throw new DbError(e.message, transName);
    }
  },
  */
};

module.exports = utils;
