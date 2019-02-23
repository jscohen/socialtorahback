const express = require('express');
const app = express();
const port = 5000;
const userRoute = require('./src/app/routes/user');

app.get('/', (req, res) => res.send('Hello World!'));

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, X-Auth-Token');
  res.header('Access-Control-Allow-Methods',
      'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next();
});

app.post('/signUp', (req, res) => {
  console.log(req.body);
  res.send('POST Request for Signup');
});

app.use('/user', userRoute);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
