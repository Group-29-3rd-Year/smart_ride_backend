const router = require("express").Router();
const pool = require("../../db");
const { Router } = require("express");


router.get("/", async (req,res) => {
     try {
         
        const list = await pool.query("SELECT COUNT(DISTINCT passenger_id) FROM ride_details WHERE date = cast(now() as Date)");

        res.json(list.rows[0]['count']);

     } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
     }   
});

router.get("/todayincome", async (req,res) => {
    try {
        
       const income = await pool.query("SELECT SUM(cost) FROM ride_details WHERE date = cast(now() as Date)");

       res.json(income.rows[0]['sum']);

    } catch (err) {
       console.error(err.message);
       res.status(500).send("Server error");
    }   
});


router.post("/conname", async (req,res) => {
   try {
      
      const {id} = req.body;

      const user = await pool.query("SELECT user_name from users WHERE user_id = $1", [id]);

      if(user.rows.length === 0 ) {
         return res.status(401).json("Name not found");
      }

      res.json(user.rows[0]['user_name']);

   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error.");
   }
});

router.post("/busname", async (req,res) => {
   try {
      
      const {id} = req.body;

      const user = await pool.query("SELECT bus_number from bus WHERE conductor_id = $1", [id]);

      if(user.rows.length === 0 ) {
         return res.status(401).json("Name not found");
      }

      res.json(user.rows[0]['bus_number']);

   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error.");
   }
});

router.get("/previousincome", async (req,res) => {
   try {
      
      const previncome = await pool.query("SELECT SUM(cost) FROM ride_details WHERE date = current_date - INTEGER '1'");

      res.json(previncome.rows[0]['sum']);

   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error.");
   }
})

module.exports=router;