const express = require("express");
const Users = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const keys = require("../../config/keys");
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const router = express.Router();

// @router  GET api/users/test
// @desc    Tests user router
// @access  public

router.get("/test", (req, res) => {
  res.json({
    msg: "Users works"
  });
});

// @router  GET api/users/register
// @desc    Register User
// @access  public

router.post("/register", (req, res) => {
  const { error, isValid } = validateRegisterInput(req.body);

  //check for validation
  if (!isValid) {
    return res.status(400).json(error);
  }
  Users.findOne({
    email: req.body.email
  }).then(
    usre => {
      if (usre) {
        error.email = "Email already exists";
        return res.status(400).json(error);
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: "200", // size
          r: "pg", // Rating
          d: "mm" // Default
        });
        const newUser = new Users({
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(usr => res.json(usr))
              .catch(err => console.log(err));
          });
        });
      }
    },
    err => {
      console.log("Error while calling email verfication.");
    }
  );
});

// @router  GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  public

router.post("/login", (req, res) => {
  const { error, isValid } = validateLoginInput(req.body);

  //check for validation
  if (!isValid) {
    return res.status(400).json(error);
  }
  const email = req.body.email;
  const password = req.body.password;
  Users.findOne({ email }).then(user => {
    // check for user
    if (!user) {
      error.email = "User not found";
      return res.status().json(error);
    }
    //check for password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // user Match
        const payload = { id: user.id, name: user.name, avatar: user.avatar }; // create jwt token
        //sign token
        jwt.sign(payload, keys.screteKey, { expiresIn: 3600 }, (err, token) => {
          res.json({
            success: true,
            token: "Bearer " + token
          });
        });
      } else {
        error.password = "Password is uncorrect.";
        return res.status(400).json(error);
      }
    });
  });
});

// @router  GET api/users/current
// @desc    Return current user
// @access  private

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

module.exports = router;
