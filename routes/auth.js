
const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../models/Users');
const { userEncoder } = require('../utils/jwtHandler');
const { errResult, okResult } = require('../utils/httpResult');
const usernameValidator = async (username) => {
  await User.findOne({ username }).exec((err, userExist) => {
    if (err || userExist) {
      return false;
    }
    return true;
  });
};
const mailValidator = async (email) => {
  await User.findOne({ email }).exec((err, exist) => {
    if (err || exist) {
      return false;
    }
    return true;
  });
};


router.post('/login', (req, res) => {
  console.log(req.body)
  const { username, password } = req.body;
  User.findOne({ username, password }, (err, user) => {
    if (err) {
      res.json(errResult(err));
    } else if (user) {
      const jwtToken = userEncoder(username, password);
      const { firstname, email } = user;
      res.cookie('jwtToken',jwtToken, { maxAge: 900000, httpOnly: true })
      res.json(okResult({
        firstname, email, username, jwtToken,
      }));
    } else {
      res.json(errResult('wrong input'));
    }
  });
});

router.post('/register', (req, res) => {
  const {
    username, password, email, isAdmin,
  } = req.body;
  if (!usernameValidator(username) || !mailValidator(email)) {
    res.json('error there');
  } else {
    const userFields = {
      username,
      password,
      email,
      createdat: Date.now(),
      firstname: 'eliran eliko',
      isAdmin,
    };
    const user = new User(userFields);
    user.save();
    res.json(okResult('register completed'));
  }
});

module.exports = router;
