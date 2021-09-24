const Pool = require("pg").Pool

const pool = new Pool({
  user: "sglvdjtkhncwvd",
  password: "222c34f5be46dbe07efc478d10b967a6b643382ae7344687c31e9905a66952cf",
  host: "ec2-35-171-171-27.compute-1.amazonaws.com",
  port: 5432,
  database: "daa4lbpne1ojld",
});

module.exports = pool;


