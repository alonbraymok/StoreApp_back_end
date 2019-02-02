const express = require('express');

const router = express.Router({ mergeParams: true });
const jwt = require('jwt-simple');
const User = require('../models/Users');
const Order = require('../models/Orders');
const { okResult, errResult } = require('../utils/httpResult');
const Product = require('../models/Products');

router.get('/ordersHistory', (req, res) => {
  const { user } = req;
  res.json(okResult(user.ordersHistory));
});
// /users/prodcuts (with headers that includes jwt token)
router.get('/currentCart', (req, res) => {
  const { user } = req;
  res.json(okResult(user.currentCart));
});

router.get('/allUsers', (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      res.json(errResult('error with get all users function'))
    } else if (users) {
      const newUsers = users.map(user => ({id: user._id, firstname: user.firstname, username: user.username, email: user.email}))
      res.json(okResult(newUsers))
    }
  })
})

router.patch('/addToCart/:productId', (req, res) => {
  const { user } = req;
  if (validateProduct(req.params.productId)) {
    user.currentCart.push(productId);
    user.save();
    res.json(okResult('product added'));
  } else {
    res.json(errResult(`error occoured with: ${req.params.productId}`));
  }
});

router.delete('/productFromCart/:productId', (req, res) => {
  const { user } = req;
  if (validateProduct(req.params.productId)) {
    user.currentCart.pull(productId);
    user.save();
    res.json(okResult('product deleted'));
  }
});

router.delete('/cart', (req, res) => {
  clearCurrentCart(req.user);
  res.json(okResult('cart initilized'));
});

router.post('/finishOrder', (req, res) => {
  // belongs, date, arrayOfProducts
  const belongsTo = req.user._id;
  const products = req.user.currentCart;
  const order = new Order(belongsTo, Date.now(), products);
  order.save();
  req.user.ordersHistory.push(order._id);
  clearCurrentCart(user);
  res.json(okResult('order completed'));
});

const validateProduct = async (productId) => {
  if (productId) {
    await Product.findOne({ _id: productId }).exec((err, exist) => {
      if (err) {
        return false;
      }
      return true;
    });
  } else {
    return false;
  }
};

const clearCurrentCart = (user) => {
  if (user) {
    User.update({ username: user.username }, { $set: { currentCart: [] } }, (err, affected) => {
      if (err) {
        console.log(err);
      } else if (affected) {
        console.log(affected);
      }
    });
  }
};

module.exports = router;