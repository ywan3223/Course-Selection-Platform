const database_config = require("../secrets.json");
const mysql = require("mysql");
const pool = mysql.createPool(database_config);

function exec(sql) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, con) => {
      
      if (err) {
        reject(err);
        return;
      }

      con.query(sql, (err, res) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(res);
        con.release();
      });

    });
  });
}

module.exports = {
  exec
}
