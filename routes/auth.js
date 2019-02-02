
const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../models/Users');
const { userEncoder } = require('../utils/jwtHandler');
const { errResult, okResult } = require('../utils/httpResult');

const usernameValidator = async(username) => {
  const findUser = await User.findOne({ username })
  return findUser !== null
};

const mailValidator = async (email) => {
  const findUser = await User.findOne({email})
  return findUser !== null
};


router.post('/login', (req, res) => {
  console.log(req.body)
  const { username, password } = req.body;
  console.log('username: ', username, 'password: ', password)
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

router.post('/register', async(req, res) => {
  const {
    username, password, email, address, fullname
  } = req.body;
  const usernameValidate = await usernameValidator(username)
  const emailValidate = await mailValidator(email)

  if (usernameValidate || emailValidate) {
    return res.json(errResult('username or email already exist'))
  } else {
    const userFields = {
      username,
      password,
      email,
      address,
      fullname,
    };
    console.log(userFields)
    const user = new User(userFields);
    user.save();
    res.json(okResult(user));
  }
});

module.exports = router;
