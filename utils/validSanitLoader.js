/*
 * load all validation files and add common validation for each rule within that file
 */

function schemasLoader(basePath, fileType) {
    const schemas = {
        GET: undefined,
        POST: undefined,
        PUT: undefined,
        PATCH: undefined,
        DELETE: undefined,
    };

    const commonRules = require(`${basePath}/common.${fileType}`);

    for (const key in schemas) {
        // try to load file
        let schema = false;
        try {
            schema = require(`${basePath}/${key.toLocaleLowerCase()}.${fileType}`);
        } catch (e) {
            /* do not enforce having a file in directory
        if (e.code === "MODULE_NOT_FOUND") {
        throw e;
      }
      */
        }

        schema = Object.keys(schema).length !== 0 ? schema : {};

        // loop over service validations
        for (const key in schema) {
            // loop over shared rules and add them for each above validation
            for (const rule in commonRules) {
                schema[key][rule] = commonRules[rule];
            }
        }

        schemas[key] = schema;
    }

    return schemas;
}

module.exports = schemasLoader;
