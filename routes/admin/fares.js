const router = require("express").Router();
const { response } = require("express");
const pool = require("../../db");

router.post("/add", async (req, res) => {
  try {
    //1. destructure the req.body
    const { fare_price,fare_km } = req.body;

    //2. check if fare exist (if fare exist then throw error)
    const fare = await pool.query("SELECT * FROM fare WHERE fare_km = $1", [
        fare_km,
    ]);

    if (fare.rows.length !== 0) {
      return res.status(401).send("Fare already exists");
    }

    //4. enter new fare inside our database
    const newFare = await pool.query(
      "INSERT INTO fare (fare_price, fare_km) VALUES ( $1, $2) RETURNING *",
      [fare_price,fare_km]
    );

    if(newFare) {
      res.json("Fare was added");
    }

    //5. generating out twt token
    // const token = jwtGenerator(newBus.rows[0].bus_id);

    // res.json({ token });
     
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/", async (req, res) => {
  try {
    //1. select query for view all fares in our database
    const fares = await pool.query(
      "SELECT fare_id, fare_price, fare_km FROM fare ORDER BY fare_id ASC"
    ); 
    //console.log(busses);
    //2. check fares in the database
    if (fares.rows.length === 0) {
      //return res.status(401).json("No any fare in the database.");
      console.log('No any fare in the database.');
    }

    res.json(fares.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/getsinglefare/:fare_id", async (req, res) => {
  try {
    //1. select query for view single bus in our database
    let id = req.params.fare_id;

    const fares = await pool.query("SELECT fare_id, fare_km, fare_price FROM fare WHERE fare_id= $1",
      [id]
    ); 
     
    //2. check fares in the database
    if (fares.rows.length === 0) {
      //return res.status(401).json("No any fare in the database.");
      console.log('No any fare in the database.');
    }

    res.json(fares.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  } 
});

router.put("/update/:fare_id", async (req, res) => {
  try {
    //   1. destructure the req.body
    const {fareNewPrice } = req.body;

    //   res.json(req.bus.user);
    let id = req.params.fare_id;

    const updateFare = await pool.query(
      "UPDATE fare SET fare_price = $1  WHERE fare_id = $2",
      [fareNewPrice,id]
    );

    if (updateFare) {
      res.json("Fare is updated");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.put("/delete/:fare_id", async (req, res) => {
   try {
     let id = req.params.fare_id;

     const deleteFare = await pool.query(
       "DELETE FROM fare WHERE fare_id = $1",
      [id]
    );
 
    if (deleteFare) {
      res.json("Fare was deleted");
    } 
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
