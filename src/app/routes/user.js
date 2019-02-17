const express = require('express');
const app = express();
const mongoose = require('mongoose');

app.post('/signUp', (req, res) => {
  console.log(req.body);
});
