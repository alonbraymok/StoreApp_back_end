const express = require('express');
const router = express.Router({ mergeParams: true });
const jwt = require('jwt-simple');
const User = require('../models/Users');
const Product = require('../models/Products');
const { errResult, okResult } = require('../utils/httpResult');

// get all products
router.get('/', (req, res) => {
  Product.find({}, (err, products) => {
    if (err) {
      res.json(errResult(err));
    } else {
      res.json(okResult(products));
    }
  });
});

router.get('/:type', async(req, res) => {
  console.log(req.params.type);
   await Product.find({type: req.params.type}, (err, products) => {
    if (err) {
      res.json(errResult(err));
    } else {
      res.json(okResult(products));
    }
  })
})

// get a specific product ( by name )
router.get(':productName', (req, res) => {
  const { productName } = req.params;
  if (productName) {
    Product.find({ name: productName }, (err, product) => {
      if (err) {
        res.json(errResult(err));
      } else {
        res.json(okResult(product));
      }
    });
  }
});
// min / max prices for searching toolbar
router.get(':minPrice&:maxPrice', (req, res) => {
  const { minPrice, maxPrice } = req.params;
  if (minPrice < maxPrice) {
    Product.find({ price: { $gt: minPrice, $lt: maxPrice } }, (err, products) => {
      if (err) {
        res.json(errResult(err));
      } else {
        res.json(okResult(products));
      }
    });
  } else {
    res.json(errResult('prices are invalid'));
  }
});

module.exports = router;
