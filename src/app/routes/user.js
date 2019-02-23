const express = require('express');
const app = express();
const mongoose = require('mongoose');
const router = express.Router();

router.get('/test', (req, res) => {
  console.log('On Test');
});

router.post('/signUp', (req, res) => {
  console.log(req.body);
  res.send('POST Request for Signup');
});

module.exports = router;
