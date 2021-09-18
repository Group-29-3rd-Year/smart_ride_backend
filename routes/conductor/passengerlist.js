const router = require("express").Router();
const pool = require("../../db");
const { Router } = require("express");
//const { response } = require("express");


router.post("/getbusid", async (req, res) => {
  try {
      const {id} = req.body;
    //1. select query for view all busses in our database
    const bus = await pool.query(
      "SELECT bus_id FROM bus WHERE conductor_id = $1",[id]
    ); 
    //console.log(conductors);
    //2. check conductors in the database
    if (bus.rows.length === 0) {
      return res.status(401).json("No any bus in the database.");
    }

    res.json(bus.rows[0]['bus_id']);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


router.post("/", async (req, res) => {
    try {
        const {bus_id} = req.body;
      //1. select query for view all busses in our database
      const passengers = await pool.query(
        "SELECT pid,uname,phone_number,email FROM passenger WHERE active_bus = $1",[bus_id]
      ); 

      //2. check conductors in the database
      if (passengers.rows.length === 0) {
        return res.status(401).json("No any passengers in the database.");
      }
  
      res.json(passengers.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });

module.exports=router;