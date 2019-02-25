const express = require('express');
const app = express();
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../models/user');

router.get('/test', (req, res) => {
  console.log('On Test');
});

router.post('/signUp', (req, res) => {
  const userToSave = req.body;
  User.findOne({email: req.body.email}).then((user) => {
    if (user === null) {
      new User(userToSave).save();
    }
    user ? res.send('User Already exists') : res.send(userToSave)
  })
      .catch((err) => res.send('500'));
});

module.exports = router;
