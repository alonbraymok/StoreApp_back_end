const express = require('express');
const axios = require('axios')
const router = express.Router({ mergeParams: true });
const User = require('../../models/Users');
const Product = require('../../models/Products');
const { errResult, okResult } = require('../../utils/httpResult');
const { get } = require('lodash')
const Order = require ('../../models/Orders')

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

router.get('/:userName', (req, res) => {
  const user = await User.find({username: req.params.userName})
  if (!user) return res.json(errResult('id: ' + req.params.userName + ' not exist'))
  return res.json({okResult(user)}) 
})

router.post('/:email', async(req, res) => {
  const ids = req.body.map(p => p._id)
  const user = await User.find({email: req.params.email})
  if (!user) return res.json(errResult('user is not exist'))
  const response = ids.map(async(id) => {
    const product = await Product.find({_id: id})
    if (!product) return res.json(errResult(`product with ID: ${id} is not exists`))
    return product
  })
  const eliran = await Promise.all(response)
  const products = eliran.map(product => product[0])
  const order = new Order({belongsTo: user[0],products})
  order.save()
  user[0].ordersHistory.push(order)
  user[0].save()
  // eliran.then(async(res) => {
  //   const productIds = res.map(p => p._id)
  //   const order = new Order(user, res)
  //   console.lof(user)
  //   user.ordersHistory.push(order)
  //   const result = await user.save()
  //   res.json(okResult(res))
  // })
  return

})

router.put('/:userId', async(req, res) => {
  console.log('here')
  console.log(req.params.userId)
  const userMutated = req.body
  User.update(
    {_id: req.params.userId},
    { $set: {
      username: req.body.username,
      address: req.body.address,
      email: req.body.email,
      password: req.body.password
    }
  }).then((result, err) => {
    if (err) return res.json(errResult(err))
    else return res.json(okResult(result))
  })  
})

router.post('/script', async(req, res) => {
  for (let i = 0 ; i < 200 ; i ++) {
    const result = await axios.get('https://randomuser.me/api')
    const username = get(result.data, 'results[0].login.username')
    const password = get(result.data, 'results[0].login.password')
    const address = get(result.data, 'results[0].location.street')
    const email = get(result.data, 'results[0].email')
    console.log(username, password, address, email)
    if (username && password && address && email) {
      console.log('exists!')
      const newUser = new User({username, password, email, address})
      console.log(newUser)
      newUser.save()
  }
}
  return res.json(okResult('ok!'))
})

router.delete('/:email', (req, res) => {
  console.log(req.params.email);
  User.deleteOne({ email: req.params.email }, (err) => {
    if (err) {
      res.json(errResult('delete user failed'));
    } else {
      res.json(okResult('user deleted.'));
    }
  });
});

module.exports = router;
