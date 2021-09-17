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

module.exports=router;