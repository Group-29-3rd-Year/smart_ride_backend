const router = require("express").Router();
const { response } = require("express");
const pool = require("../../db");
const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {

    try {
        
        const { uname, phone_number, email, password } = req.body;

       
        const userExist = await pool.query(
          "SELECT * FROM passenger WHERE email = $1",
          [email]
        );

        if (userExist.rows.length !== 0) {
          return res.status(401).send("Paasenger already exists");
        }
        else{
          // bcrypt the password
          const saltRound = 10;
          const salt = await bcrypt.genSalt(saltRound);

          const bcryptPassword = await bcrypt.hash(password, salt);

          const newPassenger = await pool.query(
            "INSERT INTO passenger (uname, phone_number, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
            [uname, phone_number, email, bcryptPassword]
          );

          if (newPassenger) {
            res.json("Success");
          }
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }

});

router.post("/login", async (req, res) => {
  try {
    //1. destructure the req.body
    const { email, password } = req.body;

    //2. check if user dosen't exist(if not then thrwo error)
    const user = await pool.query("SELECT * FROM passenger WHERE email= $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      res.json("Error");
    } 

    //3. check if incoming password is the same the db password
    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!validPassword) {
      res.json("Error");
    }
    else {
      res.json(user.rows[0].pid);
    }
    // const userExist = await pool.query(
    //   "SELECT * FROM passenger WHERE email = $1 AND password = $2",
    //   [email, password]
    // );

    // if (userExist.rows.length !== 0) {
    //   res.json("Success");
    // } else {
    //   res.json("Error");
    // }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/getpid", async (req,res) => {

  try {
    const { email } = req.body;

    const uid = await pool.query("SELECT pid FROM passenger WHERE email = $1",
        [ email ]  
    );

    if (uid.rows.length === 0) {
      return res.status(401).json("Haven't match passenger for selected email.");
    }

    res.json(uid.rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


router.post("/getuserdet", async (req,res) => {

  try {
    const { passengerID } = req.body;

    const uid = await pool.query("SELECT uname,email FROM passenger WHERE pid = $1",
        [ passengerID ]  
    );

    if (uid.rows.length === 0) {
      return res.status(401).json("Haven't match passenger for selected pid.");
    }

    res.json(uid.rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;