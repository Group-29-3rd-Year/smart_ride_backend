const router = require("express").Router();
const { response } = require("express");
const pool = require("../../db");

router.post("/getuserstart", async(req, res) => {

    try {
        
        const {bus_id} = req.body;

        const loc = await pool.query("SELECT latitude, longitude FROM bus WHERE bus_id = $1",
            [ bus_id ]        
        );

        if( loc.rows.length === 0) {
            return res.status(401).json("Error loading data");
        }

        res.json(loc.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
}); 

router.post("/updateUserCurrentBus", async(req, res) => {

    try {
        
        const {bus_id, passengerID} = req.body;

        const updateP = await pool.query("UPDATE passenger SET active_bus = $1 WHERE pid = $2",
            [ bus_id , passengerID]        
        );

        if(updateP) {
            res.json("Updated");
        }

        

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
}); 


router.post("/gettravelcost", async(req,res) => {
    try {
        
        const {distance} = req.body;

        const fare = await pool.query("SELECT fare_price FROM fare WHERE fare_km = $1", 
            [distance]
        );

        if(fare) {
            return res.json(fare.rows[0]['fare_price']);
        }


    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});


module.exports = router;