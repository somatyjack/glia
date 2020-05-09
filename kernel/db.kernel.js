const mysql = require("mysql2/promise");
const { TE } = require("../utils/utils");

module.exports = (CONFIG) => {
  const pool = mysql.createPool({
    host: CONFIG.ms.DB_HOST,
    user: CONFIG.ms.DB_USER,
    password: CONFIG.ms.DB_PASSWORD,
    database: CONFIG.ms.DB_NAME,
    waitForConnections: false,
    connectionLimit: CONFIG.ms.DB_CONN_LIMIT,
    queueLimit: 0,
  });

  if (!pool) TE("Failed to establish db connection");

  return {
    getConnection: async () => {
      return new Promise((resolve, reject) => {
        //return await pool.getConnection();

        pool
          .getConnection()
          .then((connection) => {
            resolve(connection);
          })
          .catch((err) => {
            console.log("DB Error:", err);
            reject(err);
          });
      });
    },
  };
};
