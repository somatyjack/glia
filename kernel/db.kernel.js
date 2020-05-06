const mysql = require("mysql2/promise");
const { TE } = require("../utils/utils");

//const promisePool = pool.promise();

/*

const db = {
	getConnection: async () => {
		console.log("blaaa");
		return new Promise((resolve,reject) => {
			console.log("3242343");
			pool.getConnection((error, connection) => {
				console.log(error);
				console.log("sdkjfnsjdnfjsk");
				if (error) reject(error);
				resolve(connection);
			});
		});
	},
	//pool.query() is shortcut for pool.getConnection() + connection.query() + connection.release()
	runQuery:async (connection,query) => {
		
		return new Promise((resolve,reject) => {
			connection.query(query, (error, results, fields) => {
				if (error) reject(error);
				resolve(results);
			});
		});
	},
	beginTransaction:async(connection) => {
		return new Promise((resolve,reject) => {
			connection.beginTransaction((error) => {
				if (error) reject(error);
				resolve();
			});
		});		
	},
	commit:async(connection) => {
		return new Promise((resolve,reject) => {
			connection.commit((error) => {
				if (error) reject(connection.rollback((error) => {
					if(error) throw new Error(error);
				}));
				resolve();
			});
		});		
	},
	rollTransaction:async(connection) => {
		return new Promise((resolve,reject) => {
			connection.rollback((error) => {
				if (error) reject(error);
				resolve();
			});
		});		
	}	
}
*/
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
            console.log(err);
            reject(err);
          });
      });
    },
  };
};
