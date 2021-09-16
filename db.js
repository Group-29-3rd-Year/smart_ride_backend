const Pool = require("pg").Pool

const pool = new Pool({
  user: "postgres",
  password: "hiruni@123W",
  host: "localhost",
  port: 5432,
  database: "smartridedatabase",
});

module.exports = pool;