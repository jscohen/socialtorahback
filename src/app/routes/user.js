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
  })
      .then((user) => {
        user !== null ? res.send('User Already exists').
            json({'message': 'User Already exists'}) : ''
      })
      .then((user) => user === null ? res.send('200') : '')
      .catch((err) => res.send('500'));
});

module.exports = router;
