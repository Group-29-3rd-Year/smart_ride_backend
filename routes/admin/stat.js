const router = require("express").Router();
const { response } = require("express");
const pool = require("../../db");

router.get("/buscount", async (req, res) => {
    try {
      //1. select query for view count of all busses in our database
      const busses = await pool.query(
        "SELECT COUNT(bus_id) FROM bus WHERE is_running= '1'"
      ); 
      
  
      res.json(busses.rows[0]['count']);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });

  router.get("/conductorcount", async (req, res) => {
    try {
      //1. select query for view count of all busses in our database
      const busses = await pool.query(
        "SELECT COUNT(users.user_id) FROM users INNER JOIN bus ON (bus.conductor_id = users.user_id) WHERE users.is_admin = '0';"
      ); 
      
  
      res.json(busses.rows[0]['count']);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });

  router.get("/monthlyincome", async (req, res) => {
    try {
      //1. select query for view sum of all costs in our database
      const income = await pool.query(
        "SELECT SUM(cost) FROM ride_details"
      ); 
      
  
      res.json(income.rows[0]["sum"]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });

  router.get("/todayincome", async (req, res) => {
    try {
      //1. select query for view sum of all costs in our database
      //const day = GETDATE();

      const todayincome = await pool.query(
          
        "SELECT cost FROM ride_details WHERE date = cast(now() as Date)"
      ); 
      
  
      res.json(todayincome.rows[0]["cost"]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });

  module.exports = router;