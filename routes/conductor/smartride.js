const router = require("express").Router();
const pool = require("../../db");
const bcrypt = require("bcrypt");
const validInfo = require("../../middleware/validInfo");
const jwtGenerator = require("../../utils/jwtGenerator");
const authorization = require("../../middleware/authorization");
const authorizationForProfile = require("../../middleware/authorizationForProfile");
const { Router } = require("express");

router.post("/register", validInfo, async (req, res) => {
  try {

    //1. destructure the req.body
    const { name, phone_no, email, password } = req.body;

    //2. check if use exist (id user exist then throw error)
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    if (user.rows.length !== 0) {
      return res.status(401).json("User already exists");
    }
        //3. bcrypt the password
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);

        const bcryptPassword = await bcrypt.hash(password, salt);

        //4. enter new user inside our database
        const newUser = await pool.query(
          "INSERT INTO users (user_name, phone_number, user_email, user_password, is_admin) VALUES ($1,$2,$3,$4, '0') RETURNING *",
          [name, phone_no, email, bcryptPassword]
        );

        //5. generating out twt token
        const token = jwtGenerator(newUser.rows[0].user_id);
        console.log(newUser.rows[0]);
        res.json({ token }); 
    
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//login------------------------------------------------------------

router.post("/login", validInfo, async (req, res) => {
  try {
    //1. destructure the req.body
    const { email, password } = req.body;

    //2. check if user dosen't exist(if not then thrwo error)

    const user = await pool.query("SELECT * FROM users WHERE user_email= $1 AND is_admin='0'", [
      email
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json("Email or Password is incorrect");
    }

    //3. check if incoming password is the same the db password

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );

    if (!validPassword) {
      return res.status(401).json("Email or Password is incorrect");
    }

    //4. give them the jwt token

    const token = jwtGenerator(user.rows[0].user_id);

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

router.get("/is-verify", authorization, async (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error.");
  }
});


router.post("/getId", async(req, res) => {
    try {
      
      const { email } = req.body;

      const user = await pool.query("SELECT user_id FROM users WHERE user_email= $1",
        [ email ]
      );

      if (user.rows.length === 0) {
        return res.status(401).json("Email is incorrect");
      }

      res.json(user.rows[0]);

    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error.");
    }
})

router.put("/update/:conductor_id", async (req, res) => {
  try {
    //   1. destructure the req.body
    const {latitude, longitude } = req.body;

    //   res.json(req.bus.user);
    let id = req.params.conductor_id;

    const updateBus = await pool.query(
      "UPDATE bus SET latitude = $1, longitude = $2  WHERE conductor_id = $3",
      [latitude, longitude, id]
    );

    if (updateBus) { 
      res.json("Bus is updated");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


router.post("/getdata", async (req,res) => {

  try {

    const { id } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [id]);

    if (user.rows.length == 0) {
      res.json("Data not available");
    }

    res.json(user.rows[0]);

    
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports=router;