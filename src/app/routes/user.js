const express = require('express');
const app = express();
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../models/user');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const getToken = () =>
  new Promise((resolve, reject) =>
    crypto.randomBytes(16, (err, data) =>
      err ? reject(err) : resolve(data.toString('base64'))
    )
  )

const encryptPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}


router.get('/test', (req, res) => {
  console.log('On Test');
});

router.post('/signUp', (req, res) => {
  const userToSave = req.body;
  let userToSend = {};

  const pwToSave = encryptPassword(userToSave.password);

  userToSave.password = pwToSave;
  console.log(pwToSave);

  getToken()
      .then((token) => {
        userToSave.token = token
      })
      .then(() => {
        User.findOne({email: req.body.email}).then((user) => {
          if (user === null) {
            new User(userToSave).save().then((user) => {
              userToSend = {'email': userToSave.email,
                'token': userToSave.token, 'id': user._id}
              res.send(userToSend);
            }).catch((err) => res.send('500'));
          } else {
            res.send('User Already exists')
          }
        })
            .catch((err) => res.send('500'))
      })
      .catch((err) => res.send('500'));
});

router.delete('/signOut', (req, res) => {
  console.log(req.query);
  getToken().then((token) =>
    User.findOneAndUpdate({
      _id: req.query.id,
      token: req.query.token
    }, {
      token
    })
  ).then((user) =>
    user ? res.sendStatus(204) : res.sendStatus('500')
  ).catch((err) => res.send('500'))
});

module.exports = router;
