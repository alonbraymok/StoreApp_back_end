const express = require('express');
const axios = require('axios')
const router = express.Router({ mergeParams: true });
const User = require('../../models/Users');
const Product = require('../../models/Products');
const { errResult, okResult } = require('../../utils/httpResult');
const Supplier = require('../../models/Suppliers');
const get = require('lodash/get')
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

router.put('/:productId', async(req, res) => {
  console.log('here')
  console.log(req.params.productId)
  const productMutated = req.body
  Product.update(
    {_id: req.params.productId},
    { $set: {
      name: req.body.productName,
      type: req.body.productType,
      price: req.body.productPrice,
      picture: req.body.productPicture
    }
  }).then((result, err) => {
    if (err) return res.json(errResult(err))
    else return res.json(okResult(result))
  })  
})


router.post('/', async(req, res) => {
  const {productName, productType, productPrice, productPicture, productSupplier} = req.body
  const supplier = await Supplier.find({name: productSupplier})
  if (!supplier) return res.json(errResult('supplier not exist'))
  const newProduct = new Product(productName, productType, productPrice, productPicture, supplier)
  newProduct.save()
  res.json(okResult(`${newProduct.name} saved.`))
})



router.post('/script', async(req, res) => {
  const result  = await axios.get('https://www.ybitan.co.il/v2/retailers/1131/branches/958/categories/95010/products?appId=4&categorySort=%7B%22priority%22:1,%22sortType%22:2%7D&categorySort=%7B%22priority%22:2,%22sortType%22:5%7D&from=0&languageId=1&minScore=0&names=%D7%97%D7%9C%D7%91+%D7%95%D7%9E%D7%A9%D7%A7%D7%90%D7%95%D7%AA+%D7%97%D7%9C%D7%91&names=Milk+%26+Cream&names=%D7%97%D7%9C%D7%91+%D7%95%D7%91%D7%99%D7%A6%D7%99%D7%9D&names=Dairy++%26+Eggs&size=100')
  console.log(result.data.products[0].localName)
  result.data.products.map(product => {
    console.log(get(product.branch, 'regularPrice', 10))
    const name = product.localName
    const p = new Product({ name, type: "MILKY", supplier: null, price: get(product.branch, 'regularPrice', 10)});
    p.save();
  })
})

router.get('/ping', (req, res) => {
  res.json(okResult('pong'));
});


router.delete('/eliran', (req, res) => {
  console.log('here...')
  Product.deleteMany({}, (err) => {
    if (err) {
      res.json(errResult(err))
    } else {
      res.json(okResult('products deleted ....'))
    }
  })
})


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
