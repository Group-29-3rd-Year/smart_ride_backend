const router = require("express").Router();
const { response } = require("express");
const pool = require("../../db");

router.get("/", async (req, res) => {
    try {
      //1. select query for view all busses in our database
      const conductors = await pool.query(
        "SELECT users.user_id, users.user_name, users.phone_number, users.user_email, bus.bus_number FROM users INNER JOIN bus ON (bus.conductor_id = users.user_id) WHERE users.is_admin = '0'"
      ); 
      //console.log(conductors);
      //2. check conductors in the database
      if (conductors.rows.length === 0) {
        //return res.status(401).json("No any conductors in the database.");
        console.log('No any conductors in the database.');
      }
  
      res.json(conductors.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });

router.get("/two", async (req, res) => {
  try {
    //1. select query for view all busses in our database
    const conductors = await pool.query(
      "SELECT users.user_id, users.user_name, users.phone_number, users.user_email FROM users INNER JOIN bus ON (bus.conductor_id <> users.user_id AND bus.conductor_id != 0) WHERE users.is_admin = '0'"
    ); 
    //console.log(conductors);
    //2. check conductors in the database
    if (conductors.rows.length === 0) {
      //return res.status(401).json("No any conductors in the database.");
      console.log('No any conductors in the database.');
    }

    res.json(conductors.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/getbusses", async (req, res) => {
  try {
    //1. select query for view all busses in our database
    const busses = await pool.query(
      "SELECT * FROM  bus "
    ); 
    //console.log(conductors);
    //2. check conductors in the database
    if (busses.rows.length === 0) {
      //return res.status(401).json("No any busses in the database.");
      console.log('No any busses in the database.');
    }

    res.json(busses.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/getsinglecon/:con_id", async (req, res) => {
  try {

    let id = req.params.con_id;
    //1. select query for view all busses in our database
    const conductor = await pool.query(
      "SELECT user_id, user_name, phone_number, user_email FROM  users WHERE user_id = $1;",
      [ id ]
    ); 
    //console.log(conductors);
    //2. check conductors in the database
    if (conductor.rows.length === 0) {
      //return res.status(401).json("No conductor in the database.");
      console.log('No conductor in the database.');
    }

    res.json(conductor.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.put("/update/:con_id", async (req, res) => {
  try {

     //   1. destructure the req.body
     const { busNo } = req.body;

     //   res.json(req.bus.user);
     let id = req.params.con_id;
 
     const updateBus = await pool.query(
       "UPDATE bus SET conductor_id = $1  WHERE bus_id = $2",
       [id, busNo]
     );
 
     if (updateBus) {
       res.json("Bus was updated");
     }
   } catch (err) {
     console.error(err.message);
     res.status(500).send("Server error");
   }
});


router.put("/deleteassign/:con_id", async (req,res) => {

    try {

      let id = req.params.con_id;

      const deleteConUser = await pool.query("DELETE FROM users WHERE user_id = $1", [id]);

      const deleteConBus = await pool.query("UPDATE bus SET conductor_id = 0 WHERE conductor_id = $1", [id]);

      if(deleteConBus && deleteConUser) {
        res.json("Conductor was deleted");
      }
      
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
});


router.put("/deletenotassign/:con_id", async (req,res) => {

  try {

    let id = req.params.con_id;

    const deleteConUser = await pool.query("DELETE FROM users WHERE user_id = $1", [id]);


    if(deleteConUser) {
      res.json("Conductor was deleted");
    }
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


module.exports = router;