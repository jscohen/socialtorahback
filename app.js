const express = require('express');
const app = express();
const port = 5000;
const userRoute = require('./src/app/routes/user');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/socialTorah');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connection to Mongo successful');
});

app.get('/', (req, res) => res.send('Hello World!'));

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, X-Auth-Token');
  res.header('Access-Control-Allow-Methods',
      'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next();
});

app.use(bodyParser.json());
app.use('/user', userRoute);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
