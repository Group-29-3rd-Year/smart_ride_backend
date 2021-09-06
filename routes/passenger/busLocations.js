const router = require("express").Router();
const { response } = require("express");
const pool = require("../../db");

router.get("/", async (req, res) => {
    try {
      //1. select query for view all locations in our database
      const locations = await pool.query(
        "SELECT bus_id, bus_number, latitude, longitude FROM bus WHERE is_running='t'"
      ); 
      
      //2. check locations in the database
      if (locations.rows.length === 0) {
        return res.status(401).json("No any busses in the database.");
      }
  
      res.json(locations.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
});

module.exports = router;