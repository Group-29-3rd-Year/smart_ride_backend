const router = require("express").Router();
const { response } = require("express");
const pool = require("../../db");

router.get("/regpascount", async (req, res) => {
  try {
    //1. select query for view count of all busses in our database
    const regpas = await pool.query(
      "SELECT COUNT(pid) FROM passenger"
    ); 
    

    res.json(regpas.rows[0]['count']);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


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
          
        "SELECT SUM(cost) FROM ride_details WHERE date = cast(now() as Date)"
      ); 
      
  
      res.json(todayincome.rows[0]['sum']);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });

  router.get("/passengercount", async (req,res) => {
    try {
        
       const list = await pool.query("SELECT COUNT(DISTINCT passenger_id) FROM ride_details WHERE date = cast(now() as Date)"
       );

       res.json(list.rows[0]['count']);

    } catch (err) {
       console.error(err.message);
       res.status(500).send("Server error");
    }   
  });

  router.get("/haltcount", async (req,res) => {
    try {
        
       const list = await pool.query("SELECT COUNT(halt_id) FROM halt"
       );

       res.json(list.rows[0]['count']);

    } catch (err) {
       console.error(err.message);
       res.status(500).send("Server error");
    }   
  });

  router.get("/usercount", async (req,res) => {
    try {
        
       const list = await pool.query("SELECT COUNT(user_id) FROM users"
       );

       res.json(list.rows[0]['count']);

    } catch (err) {
       console.error(err.message);
       res.status(500).send("Server error");
    }   
  });

  router.get("/routescount", async (req,res) => {
    try {
        
       const list = await pool.query("SELECT COUNT(DISTINCT route_start) FROM bus WHERE is_running= '1'"
       );

       res.json(list.rows[0]['count']);

    } catch (err) {
       console.error(err.message);
       res.status(500).send("Server error");
    }   
  });



  module.exports = router;