const router = require("express").Router();
const pool = require("../../db");

router.post("/add", async (req, res) => {
  try {
    //1. destructure the req.body
    const { halt_name } = req.body;
    console.log(req.body);

    halt_name_new = halt_name.toLowerCase();
    //2. check if bus exist (if bus exist then throw error)
    const halt = await pool.query("SELECT * FROM halt WHERE halt_name = $1", [
      halt_name_new, 
    ]);  
 
    if (halt.rows.length !== 0) {
      return res.status(401).send("Halt already exists");
    }
 
    //4. enter new bus inside our database
    const newHalt = await pool.query(
      "INSERT INTO halt (halt_name) VALUES ( $1 ) RETURNING *",
      [halt_name]
    ); 

    if (newHalt) {
      res.json("Halt was added.");
    }
  } catch (err) { 
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/", async (req, res) => {
  try {
    //1. select query for view all busses in our database
    const halts = await pool.query("SELECT halt_id, halt_name FROM halt ORDER BY halt_id ASC");

    //2. check busses in the database
    if (halts.rows.length === 0) {
      return res.status(401).json("No any halts in the database.");
    }

    res.json(halts.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


router.get("/:halt_id", async (req, res) => {
  try {
    //   res.json(req.bus.user);
    let id = req.params.halt_id;

    //1. select query for view all busses in our database
    const halt = await pool.query("SELECT halt_name FROM halt WHERE halt_id = $1",
        [ id ]  
    );

    //2. check busses in the database
    if (halt.rows.length === 0) {
      return res.status(401).json("Haven't match halt for selected bus.");
    }

    res.json(halt.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.put("/delete/:halt_id", async (req, res) => {
  try {
    //   res.json(req.bus.user);
    let id = req.params.halt_id;

    const deleteHalt = await pool.query(
      "DELETE FROM halt WHERE halt_id = $1",
      [id]
    );

    if (deleteHalt) {
      res.json("Halt was deleted");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
