const express = require('express');

const router = express.Router({ mergeParams: true });
const User = require('../../models/Users');
const Product = require('../../models/Products');
const { errResult, okResult } = require('../../utils/httpResult');
const Supplier = require('../../models/Suppliers');

router.get('/', (req, res) => {
  Product.find({})
    .populate('supplier')
    .exec((err, products) => {
      if (err) {
        res.json(errResult(err));
      } else {
        res.json(okResult(products));
      }
    });
});

router.get('/ping', (req, res) => {
  res.json(okResult('pong'));
});

router.put('/product', (req, res) => {
  const { name, type, supplierName } = req.body;
  Supplier.findOne({ name: supplierName }, (err, supplierExist) => {
    if (err) {
      res.json(errResult(err));
    } else {
      const product = new Product({ name, type, supplier: supplierExist._id });
      product.save();
      res.json(okResult('product added: ', product));
    }
  });
});

router.delete('/:productId', (req, res) => {
  Product.deleteOne({ _id: req.params.productId }, (err) => {
    if (err) {
      res.json(errResult(err));
    } else {
      res.json(okResult('product deleted'));
    }
  });
});

router.patch('/:productId', (req, res) => {
  const { productId } = req.params;
  Product.findOneAndUpdate({ _id: productId }, req.newData, { upsert: true }, (err, doc) => {
    if (err) {
      res.json(errResult(err));
    } else {
      res.json('Changed to: ', doc);
    }
  });
});

module.exports = router;
