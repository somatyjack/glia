const CONFIG = require("./mockedConfig");
const sanitizationSchemas = require("../../utils/validSanitLoader")(
  CONFIG.ms.SANITIZATION_SCHEMAS_PATH,
  "sanit"
);

module.exports = function (method, serviceName, data) {
  // get list of fields need to be sanitized
  const fields = sanitizationSchemas[method][serviceName];

  // if schema is not defined for request/method skip
  if (!fields) return data;

  // sanitize each using defined schema
  Object.keys(fields).forEach((field) => {
    data[field] = fields[field](data[field]);
  });

  return data;
};
