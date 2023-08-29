const express = require("express");
const router = express.Router();
// const userdata = require("../models/User");
const { query, validationResult, body } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const JTW_SECRET = "mukeshpancholi@isgoodboy";
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

// Routes -> 1 : create a User using POST "/api/auth/createuser, no login required "
router.post(
  "/createuser",
  [
    body("name", "Enter valid name").isLength({ min: 3 }),
    body("email", "Enter valid Email").isEmail(),
    body("password", "Password must be atleast 4 charactor").isLength({
      min: 5,
    }),
  ],

  async (req, resp) => {
    //if there are arrors, return bad request and the errors

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return resp.status(400).json({ errors: errors.array() });
    }
    //Check whete user with email is exsiting already
    try {
      let user = await User.findOne({ email: req.body.email });

      if (user) {
        return resp
          .status(400)
          .json({ error: "Sorry a user with this email already exist.." });
      }
      const salt = await bcrypt.genSalt(10);
      const secpass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secpass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JTW_SECRET);

      resp.json(authtoken);
    } catch (error) {
      console.error(error.message);
      resp.status(500).send("Some error occurd");
    }
  }
);

//Routes -> 2 : authanticate a user using : POST "/api/auth/login"

router.post(
  "/login",
  [
    body("email", "Enter valid Email").isEmail(),
    body("password", "Password cant be blank").exists(),
    body("password", "Password must be atleast 4 charactor").isLength({
      min: 5,
    }),
  ],
  async (req, resp) => {
    console.log("this is user name and password", req.body);

    const errors = validationResult(req);
    console.log("this is validation error ", errors);
    if (!errors.isEmpty()) {
      return resp.status(400).json({ errors: errors.array() });
      resp.send("done");
    } else {
      const { email, password } = req.body;
      let user = await User.findOne({ email });
      if (!user) {
        return resp.status(400).json({
          error: "please enter correct user name and password",
        });
      }

      const passwordCompare = bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return resp.status(400).json({
          error: "Please enter correct user name and password",
        });
      }
      const data = {
        user: {
          id: user.id,
        },
      };

      const authtoken = jwt.sign(data, JTW_SECRET);
      console.log(authtoken);

      resp.json(authtoken);
      resp.send(req.body);
    }
  }
);

//Routes -> 3 : get loggedin user detail using : get "/api/auth/getuser", login required.

router.post("/getuser", fetchuser, async (req, resp) => {
  try {
    userid = req.user._id;
    console.log(userid);
    const user = await User.findOne(userid).select("-password");
    console.log(user);
    resp.send(user);
  } catch (error) {
    console.error(error.message);
  }
});

module.exports = router;
