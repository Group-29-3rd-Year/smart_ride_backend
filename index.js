const express = require("express");
const app =  express();
const cors = require("cors");
  
app.use(express.json());
app.use(cors());
 
//ADMIN ROUTES//   
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

//CONDUCTOR ROUTES// 
//register and login
app.use("/conductor/smartride", require("./routes/conductor/smartride"));

app.listen(5000, () => { 
    console.log("server is running on port 5000");
});