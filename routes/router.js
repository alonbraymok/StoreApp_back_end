const express = require('express');
const users = require('./users');
const products = require('./products');
const auth = require('./auth');
const manage = require('./manage');
const mUsers = require('./admin/mUsers')
const { adminMiddleware } = require('../middlewares/authMiddleware');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router({ mergeParams: true });

router.use('/api/auth', auth); // login / register
router.use('/api/manage', manage); // for admin panel authMiddleware, adminMiddleware are missing
router.use('/api/users', users); // users area  authMiddleware is missing
router.use('/api/products', products); // products area


// router.use('/order', verifyUserMiddleware, order)
// router.use('/suppliers', verifyAdminUser, suppliers)

module.exports = router;
