const router = require("express").Router();
const { response } = require("express");
const pool = require("../../db");

router.post("/add", async (req, res) => {
  try {
    //1. destructure the req.body
    const { number, start, end } = req.body;

    //2. check if bus exist (if bus exist then throw error)
    const bus = await pool.query("SELECT * FROM bus WHERE bus_number = $1 AND is_running='1'", [
      number,
    ]);

    if (bus.rows.length !== 0) {
      return res.status(401).send("Bus already exists");
    }

    //4. enter new bus inside our database
    const newBus = await pool.query(
      "INSERT INTO bus (bus_number, route_start, route_end, conductor_id, latitude, longitude,  is_running) VALUES ( $1, $2, $3, 0, 0.0 , 0.0 , '1') RETURNING *",
      [number, start, end]
    );

    if(newBus) {
      res.json("Bus was added");
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
    //1. select query for view all busses in our database
    const busses = await pool.query(
      "SELECT bus.bus_id, bus.bus_number, bus.route_start, bus.route_end, users.user_name FROM bus INNER JOIN users ON (bus.conductor_id = users.user_id) WHERE is_running= '1'"
    );
    

    //console.log(busses);
    //2. check busses in the database
    if (busses.rows.length === 0) {
      //return res.status(401).json("No any bus in the database.");
      console.log('No any bus in the database.');
    }

    res.json(busses.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


router.get("/getbusses", async (req, res) => {
  try {
    //1. select query for view all busses in our database
    const busses = await pool.query("SELECT bus_id, bus_number, route_start, route_end FROM bus WHERE is_running= '1' AND conductor_id = 0");
    

    //console.log(busses);
    //2. check busses in the database
    if (busses.rows.length === 0) {
      //return res.status(401).json("No any bus in the database.");
      console.log('No any bus in the database.');
    }

    res.json(busses.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});





router.get("/singlebus/:bus_id", async (req, res) => {
  try {
    //1. select query for view single bus in our database
    let id = req.params.bus_id;

    const busses = await pool.query(
      "SELECT bus_id, bus_number, route_start, route_end, conductor_id FROM bus WHERE bus_id= $1",
      [id]
    ); 
    //console.log(busses); 
    //2. check busses in the database
    if (busses.rows.length === 0) {
      //return res.status(401).json("No any bus in the database.");
      console.log('No any bus in the database.');
    }

    res.json(busses.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  } 
});

router.put("/update/:bus_id", async (req, res) => {
  try {
    //   1. destructure the req.body
    const { number, busNewStart, busNewEnd } = req.body;

    //   res.json(req.bus.user);
    let id = req.params.bus_id;

    const updateBus = await pool.query(
      "UPDATE bus SET bus_number = $1, route_start = $2, route_end = $3  WHERE bus_id = $4",
      [number, busNewStart, busNewEnd,  id]
    );

    if (updateBus) {
      res.json("Bus was updated");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.put("/delete/:bus_id", async (req, res) => {
  try {
    let id = req.params.bus_id;

    const deleteBus = await pool.query(
      "UPDATE bus SET is_running = '0' WHERE bus_id = $1",
      [id]
    );
 
    if (deleteBus) {
      res.json("Bus was deleted");
    } 
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


router.get("/getbuscoor", async (req, res) => {
  try {
    //1. select query for view all busses in our database
    const busses = await pool.query(
      "SELECT bus_id,latitude, longitude FROM bus WHERE is_running= '1'"
    ); 
    //console.log(busses);
    //2. check busses in the database
    if (busses.rows.length === 0) {
      //return res.status(401).json("No any bus in the database.");
      console.log('No any bus in the database.');
    }

    res.json(busses.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
