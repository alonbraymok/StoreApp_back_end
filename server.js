const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router = require('./routes/router');
const app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

mongoose.connect('mongodb://elikos1:qwe123@ds125181.mlab.com:25181/supersuisa');

const PORT = process.env.PORT || 8000;
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(router);

io.on("connection", socket => {
  console.log('socket io connected !')
  let previousId;
  const safeJoin = currentId => {
    socket.leave(previousId);
    socket.join(currentId);
    previousId = currentId;
  };

  socket.on("getDoc", docId => {
    safeJoin(docId);
    socket.emit("document", documents[docId]);
  });

  socket.on("addDoc", doc => {
    documents[doc.id] = doc;
    safeJoin(doc.id);
    io.emit("documents", Object.keys(documents));
    socket.emit("document", doc);
  });

  socket.on("editDoc", doc => {
    documents[doc.id] = doc;
    socket.to(doc.id).emit("document", doc);
  });

  io.emit("documents", Object.keys(documents));
});


app.get('/', (req, res) => {
  // there we should deploy the 'front - end'
  console.log('request is there');
  res.send('hello world bye bye');
});
app.listen(PORT, (req, res) => {
  console.log('running on port: ', PORT);
});


module.exports = app;
