const router = require("express").Router();
const { response } = require("express");
const pool = require("../../db");

router.get("/", async (req, res) => {
    try {
      //1. select query for view all fares in our database
      const fares = await pool.query(
        "SELECT fare_km, fare_price FROM fare ORDER BY fare_km ASC"
      ); 
      //console.log(busses);
      //2. check fares in the database
      if (fares.rows.length === 0) {
        return res.status(401).json("No any fare rates in the database.");
      }
  
      res.json(fares.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
});

module.exports = router;