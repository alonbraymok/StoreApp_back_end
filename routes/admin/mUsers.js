const express = require('express');

const router = express.Router({ mergeParams: true });
const User = require('../../models/Users');
const Product = require('../../models/Products');
const { errResult, okResult } = require('../../utils/httpResult');

router.get('/ping', (req, res) => {
  res.json(okResult('pong'));
});

router.get('/', (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      res.json(errResult(err));
    } else {
      res.json(okResult(users));
    }
  });
});

router.get('/allUsers', (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      res.json(errResult('error with get all users function'))
    } else if (users) {
      const newUsers = users.map(user => ({id: user._id, firstname: user.firstname, username: user.username, email: user.email}))
      debugger
      res.json(okResult(newUsers))
    }
  })
})

router.delete('/:email', (req, res) => {
  console.log(req.params.email);
  User.deleteOne({ email: req.params.email }, (err) => {
    if (err) {
      res.json(errResult('delete user failed'));
    } else {
      res.json(okResult('user deleted.'));
    }
  });
});

module.exports = router;
