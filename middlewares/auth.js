const jwt = require("jsonwebtoken");
//basiclly we need to pass the web token and verify it

const auth = async (req, res, next) => {
  //so auth is a function and not a route
  try {
    const token = req.header("x-auth-token");
    if (!token){
      console.log('yep im the cause of this error')
      return res.status(401).json({ msg: "No auth token ,access denied" });}
    const verified = jwt.verify(token, "passwordKey"); //returns a token object if verified
    if (!verified)
      return res
        .status(401)
        .json({ msg: "Token verification failed, authorization denied" });

    req.user=verified.id;//adding the id that we got from verified object to the req and that can be accessed now as req.user
    req.token=token; //similarly, passing token that we got to the request
    next();//the next callback function 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports=auth;