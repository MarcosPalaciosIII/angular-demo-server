const express = require("express");
// const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const bcryptSalt = 10;

router.post("/login", (req, res, next) => {
  User.findOne({ username: req.body.username })
    .then((userFromDb) => {
      if (userFromDb === null) {
        res.json({ error: { message: "Username is invalid" } });
        return;
      }
      const isPasswordGood = bcrypt.compareSync(req.body.password, userFromDb.password);

      if (isPasswordGood === false) {
        res.json({ error: { message: "Password is invalid" } });
        return;
      }
      req.login(userFromDb, (err) => {
        userFromDb.password = undefined;

        res.status(200).json({ user: userFromDb, success: true });
      });
    })
    .catch((err) => {
      console.log("POST/login ERROR!");
      console.log(err);

      res.json({ error: { message: "Log in database error" } });
    });
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username === "" || password === "") {
    res.json({ error: { message: "Indicate username and password" } });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.json({ error: { message: "The username already exists" } });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save()
      .then((newlyCreatedUser) => {
        res.json({ user: newlyCreatedUser, success: true });
      })
      .catch(err => {
        res.json({ error: { message: "Something went wrong" } });
      })
  });
});

router.get('/checklogin', (req, res, next) => {
  if (req.user) {
    req.user.password = undefined;

    res.status(200).json(req.user);
  }
  else {
    res.status(200).json(null);
  }
});

router.get('/user-address/:userId', (req, res, next) => {
  User.findById(req.params.userId).populate('address')
    .then(userDetailsFromDb => {
      res.json({ user: userDetailsFromDb, success: true });
    }).catch(error => res.json(error))
})

router.delete("/logout", (req, res) => {
  req.logout();
  res.json({ message: "User has been logged out!", success: true });
});

module.exports = router;
