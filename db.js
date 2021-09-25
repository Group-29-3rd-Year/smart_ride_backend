const Pool = require("pg").Pool

const pool = new Pool({
  user: "mfaarylnzdqpog",
  password: "2d1150ef7acdf233e16ca3294f298867a30dd39838f25aa1a2f885d3fc93fc19",
  host: "ec2-34-233-187-36.compute-1.amazonaws.com",
  port: 5432,
  database: "d2qu6dvt42fsor",
});

module.exports = pool;

