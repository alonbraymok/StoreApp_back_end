const express = require('express');
const router = express.Router({ mergeParams: true });
const jwt = require('jwt-simple');
const User = require('../models/Users');
const Product = require('../models/Products');
const { errResult, okResult } = require('../utils/httpResult');

// get all products
router.get('/', (req, res) => {
  console.log('here!!!')
  Product.find({}, (err, products) => {
    if (err) {
      res.json(errResult(err));
    } else {
      res.json(okResult(products));
    }
  });
});
router.get('/search', async(req, res) => {
  const { minval, maxval, category } = req.query
  const products = await Product.find({type: category, price: {$gte: parseInt(minval), $lte: parseInt(maxval)}})
  return products !== [] 
  ? res.json(okResult(products)) 
  : res.json(errResult('no products'))
})

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

router.get('/categories', async(req, res) => {
  const types = []
  const products = await Product.find({})
  products.forEach(product => {
    if (!types.includes(product.type)) {
      types.push(product.type)
    }
  });
  return res.json(okResult(types))
})


router.get('/:category', async(req, res) => {
  if (req.params.category === 'all') {
    await Product.find({}, (err, products) => {
      if (err) {
        return res.json(errResult(err))
      } else {
        return res.json(okResult(products))
      }
    })
  } else {
    await Product.find({type:req.params.category.toUpperCase()}, (err, products) => {
      if (err) {
        return res.json(errResult(err));
      } else {
        return res.json(okResult(products));
      }
  })
}})

router.get('/categoryToChart/:category', async(req, res) => {
  if (req.params.category === 'all') {
    await Product.find({}, (err, products) => {
      if (err) {
        return res.json(errResult(err))
      } else {
        return res.json(okResult(products))
      }
    })
  } else {
    await Product.find({type:req.params.category}, (err, products) => {
      if (err) {
        return res.json(errResult(err));
      } else {
        console.log(req.params.category)
        return res.json(okResult(products));
      }
  })
}})

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
