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

router.delete('/:username', (req, res) => {
  console.log(req.params.username);
  User.deleteOne({ username: req.params.username }, (err) => {
    if (err) {
      res.json(errResult('delete user failed'));
    } else {
      res.json(okResult('user deleted.'));
    }
  });
});

module.exports = router;
