const router = require("express").Router();
const pool = require("../../db");
const bcrypt = require("bcrypt");
const validInfo = require("../../middleware/validInfo");
const jwtGenerator = require("../../utils/jwtGenerator");
const authorization = require("../../middleware/authorization");
const authorizationForProfile = require("../../middleware/authorizationForProfile");

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
          "INSERT INTO users (user_name, phone_number, user_email, user_password, is_admin) VALUES ($1,$2,$3,$4, '1') RETURNING *",
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

router.post("/login", validInfo, async (req, res) => {
  try {
    //1. destructure the req.body
    const { email, password } = req.body;

    //2. check if user dosen't exist(if not then thrwo error)

    const user = await pool.query("SELECT * FROM users WHERE user_email= $1 AND is_admin='1'", [
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

router.put("/profile/:user_id", authorizationForProfile, async (req, res) => {
  try {
    let id = req.user.user;

    //1. select query for view all busses in our database
    const user = await pool.query(
      "SELECT user_name, phone_number, user_email FROM users WHERE user_id = $1",
      [id]
    );

    //2. check busses in the database
    if (user.rows.length === 0) {
      return res.status(401).json("No this user in the database.");
    }

    res.json(user.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.put("/profileUpdate/:user_id", authorizationForProfile, validInfo, async (req, res) => {
    try {
      const { name, phone_no, email } = req.body;

      let id = req.user.user;

      //2. check if use exist (id user exist then throw error)
      const user = await pool.query(
        "SELECT * FROM users WHERE user_email = $1 AND user_id != $2",
        [email, id]
      );

      if (user.rows.length !== 0) {
        return res.status(401).json("This email is already exists");
      }

      //1. select query for view all busses in our database
      // const user = await pool.query(
      //   "SELECT user_name, phone_number, user_email FROM users WHERE user_id = $1",
      //   [id]
      // );

      // //2. check busses in the database
      // if (user.rows.length === 0) {
      //   return res.status(401).json("No this user in the database.");
      // }

      // res.json(user.rows);

      const updateUser = await pool.query(
        "UPDATE users SET user_name = $1, phone_number = $2, user_email = $3 WHERE user_id = $4",
        [name, phone_no, email, id]
      );

      if (updateUser) {
        res.json("Your details was updated");
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);


router.post("/getdata", async (req,res) => {

    try {

      const { adminId } = req.body;

      const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [adminId]);

      if (user.rows.length == 0) {
        res.json("Data not available");
      }

      res.json(user.rows[0]);

      
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
});

module.exports = router;
