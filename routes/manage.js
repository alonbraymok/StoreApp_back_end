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

module.exports = router;
