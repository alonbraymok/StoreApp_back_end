const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router = require('./routes/router');

mongoose.connect('mongodb://elikos1:qwe123@ds125181.mlab.com:25181/supersuisa');
const app = express();
const PORT = process.env.PORT || 8000;
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(router);
app.get('/', (req, res) => {
  // there we should deploy the 'front - end'
  console.log('request is there');
  res.send('hello world bye bye');
});

app.listen(PORT, (req, res) => {
  console.log('running on port: ', PORT);
});

module.exports = app;
