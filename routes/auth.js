const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const auth = require("../middlewares/auth");
const authRouter = express.Router();

authRouter.post("/api/signup", async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "User with same email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 8); //password to be encrypted and a salt(8) which randomicly inserts string in the pass to encrypt it
    let user = new User({
      name,
      email,
      password: hashedPassword,
    });
    user = await user.save();
    res.send(user);
  } catch (e) {
    res.status(500).json({
      error: e.message,
    });
  }
});

authRouter.post("/api/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(email,password)
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ msg: "User does not exist. Signup instead." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    //to compare entered pass with hashed pass
    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect Password ." });
    }
    const token = jwt.sign({ id: user._id }, "passwordKey");
    //token is generated for unique ids with a secret key(passwordKey) so that to authenticate the user, we have the private key
    //the token generated would be stored in memory of app
    res.json({ token, ...user._doc }); //... used for destructuring the user data
    //and now the response is sent like {token:token_something, _id:.., name: ,email : }
    //so we didnt have to write all things separately and it got destructured
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

authRouter.post("/isTokenValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    console.log(token);
    if (!token) return res.json(false);
    const verified = jwt.verify(token, "passwordKey"); //returns an object if verified
    console.log("1 " + verified.id);

    if (!verified) return res.json(false);
    //if token is verified, we again confirm if that token is linked to a user too
    const user = await User.findById(verified.id);
    if (!user) return res.json(false);

    res.json(true);
  } catch (e) {
    res.status(500).json({ error: "Fuck"+e.message });
  }
});

//get user data

authRouter.get("/", auth, async (req, res) => {
  try {
    //here auth is the middleware that mkes sure that you re authorized ,
    //  that mens only you have the capbility to access this route if you are signed in
    const user = await User.findById(req.user);
    // console.log(req.user,req.token)
    res.json({ token: req.token,...user._doc}  );
    //now we have found the user using the id that we got by
    // calling the auth mmiddleware and the data that we got are sending back asjson res
  } catch (e) {
    res.status(500).json({ error: "A fucking server error " + e.message });
  }
});

module.exports = authRouter;
