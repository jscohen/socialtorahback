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
          userToSend = {'email': userToSave.email,
            'token': userToSave.token, 'id': userToSave._id}
        user ? res.send('User Already exists') : res.send(userToSend)
        })
            .catch((err) => res.send('500'))
      })
      .catch((err) => res.send('500'));
});

router.delete('/signOut', (req, res) => {
  getToken().then((token) =>
    User.findOneAndUpdate({
      token: req.body.token
    }, {
      token
    })
  ).then((user) =>
    user ? res.sendStatus(204) : res.sendStatus('500')
  ).catch((err) => res.send('500'))
});

module.exports = router;
