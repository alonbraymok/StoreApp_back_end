const express = require('express');
const router = express.Router({ mergeParams: true });
const mProducts = require('./admin/mProducts');
const mUsers = require('./admin/mUsers');
const mSuppliers = require('./admin/mSuppliers');
const { okResult } = require('../utils/httpResult');

router.get('/ping', (req, res) => {
  res.json(okResult('pong'));
});
router.use('/products', mProducts);
router.use('/users', mUsers);
router.use('/suppliers', mSuppliers);


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


module.exports = router;
