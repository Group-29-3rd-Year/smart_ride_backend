module.exports = (req, res, next) => {

    const { name, phone_no, email, password } = req.body;
  
    function validEmail(userEmail) {
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
    }

    function validatePhoneNo(phoneNo) {
      var phoneno = /^\d{10}$/;
      if(phoneNo.value.match(phoneno)) {
        return true;
      }
    }
  
    if (req.path === "/register") {
      console.log(phone_no.length);
      console.log(typeof(phone_no));
      if (![name, phone_no, email, password].every(Boolean)) {
        return res.status(401).json("Missing Credentials");
      } else if (!validEmail(email)) {
        return res.status(401).json("Invalid Email");
      } else if (phone_no.length !== 10) {
        return res.status(401).json("Invalid Phone No");
      } 

    } else if (req.path === "/login") {
      if (![email, password].every(Boolean)) {
        return res.status(401).json("Missing Credentials");
      } else if (!validEmail(email)) {
        return res.status(401).json("Invalid Email");
      }
    }
  
    next();
};