const express = require('express');
const app = express();
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../models/user');
const crypto = require('crypto');

const getToken = () =>
  new Promise((resolve, reject) =>
    crypto.randomBytes(16, (err, data) =>
      err ? reject(err) : resolve(data.toString('base64'))
    )
  )

router.get('/test', (req, res) => {
  console.log('On Test');
});

router.post('/signUp', (req, res) => {
  const userToSave = req.body;
  let userToSend = {};
  getToken()
      .then((token) => {
        userToSave.token = token
      })
      .then(() => {
        User.findOne({email: req.body.email}).then((user) => {
          if (user === null) {
            new User(userToSave).save();
          }
          userToSend = {'email': userToSave.email, 'token': userToSave.token}
        user ? res.send('User Already exists') : res.send(userToSend)
        })
            .catch((err) => res.send('500'))
      })
      .catch((err) => res.send('500'));
});

module.exports = router;
