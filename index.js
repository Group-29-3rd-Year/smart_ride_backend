const express = require("express");
const app =  express();
const cors = require("cors");
  
app.use(express.json());
app.use(cors());
 
//ADMIN ROUTES///////////////////////////////////////////////////////////   
//register and login
app.use("/admin/smartride", require("./routes/admin/smartride"));

//dashboard
app.use("/admin/dashboard", require("./routes/admin/dashboard"));
 
//crud for busses 
app.use("/admin/busses", require("./routes/admin/busses"));

// crud for routes
app.use("/admin/halts", require("./routes/admin/halts"));

// crud for fares
app.use("/admin/fares", require("./routes/admin/fares"));
 
// crud for routes 
app.use("/admin/conductors", require("./routes/admin/conductors"));

//stat
//stat
app.use("/admin/stat", require("./routes/admin/stat"));


//CONDUCTOR ROUTES//////////////////////////////////////////////////////// 
//register and login
app.use("/conductor/smartride", require("./routes/conductor/smartride"));

//stat module
app.use("/conductor/stat", require("./routes/conductor/stat"));

//passengerlist
app.use("/conductor/passengerlist", require('./routes/conductor/passengerlist'));

//PASSENEGR ROUTES////////////////////////////////////////////////////////
//register and login 
app.use("/passenger/add", require('./routes/passenger/passenger'));

//login 
//app.use("/passenger/login", require('./routes/passenger/passenger'));

//fare rates
app.use("/passenger/fare", require('./routes/passenger/fareRate'));

//past travels
app.use("/passenger/pasttravels", require('./routes/passenger/pastTravel'));

//bus locations
app.use("/passenger/buslocations", require('./routes/passenger/busLocations'));

//ongoin map
app.use("/passenger/ongoingmap", require('./routes/passenger/ongoingmap'));




app.listen(5000, () => { 
    console.log("server is running on port 5000");
});