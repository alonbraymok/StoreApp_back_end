const express = require('express');
const router = express.Router({ mergeParams: true });
const Supplier = require('../../models/Suppliers');
const { errResult, okResult } = require('../../utils/httpResult');

router.get('/', (req, res) => {
  Supplier.find({}, (err, suppliers) => {
    if (err) {
      res.json(errResult(err));
    } else {
      res.json(okResult(suppliers));
    }
  });
});
router.put('/supplier', (req, res) => {
  const { name, email, phone } = req.body;
  if (!validateFields(name, email, phone)) {
    res.json(errResult('invalid supplier fields'));
    return;
  }
  const supplier = new Supplier({ name, email, phone });
  supplier.save();
  res.json(okResult('Supplier Saved'));
});

router.delete('/:supplierName', (req, res) => {
  Supplier.remove({ name: req.params.supplierName }, (err, ok) => {
    if (err) {
      res.json(errResult(err));
    } else if (!ok) {
      res.json(errResult('supplier not exist'));
    } else {
      res.json(okResult('supplier deleted'));
    }
  });
});

router.patch('/:supplierName', (req, res) => {
  const name = req.params.supplierName;
  Supplier.findOneAndUpdate({ name });
});

const validateFields = (name, email, phone) => {
  if (!name || !email || !phone) {
    return false;
  }
  return true;
};

const validateSupplier = async (supplierName) => {
  if (supplierName) {
    await Supplier.findOne({ name: supplierName }).exec((err, exist) => {
      if (!err) {
        return true;
      }
    });
  }
  return false;
};

module.exports = router;
