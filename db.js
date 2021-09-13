const Pool = require("pg").Pool

const pool = new Pool({
  user: "postgres",
  password: "Nana2002",
  host: "localhost",
  port: 5432,
  database: "smartridedatabase",
});

module.exports = pool;