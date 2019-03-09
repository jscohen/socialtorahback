const express = require('express');
const app = express();
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

app.get('/test', (req, res) => {
  console.log('On Test');
});

app.post('/signUp', (req, res) => {
  const userToSave = req.body;
  let userToSend = {};

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

app.post('/signIn', (req, res) => {
  const userSent = req.body;

  User.findOne({email: userSent.email})
      .then((user) => {
        !user ? res.send('Invalid username or password, or this user doesn\'t exist') : ''
        user ? user.comparePassword(userSent.password)
              : Promise.reject(new HttpError(404))
        getToken().then((token) => {
          user.token = token
          return user.save()
        })
        user = user.toObject()
        delete user.password
        res.json(user)
      })
      .catch((err) => res.send(err))
});

app.delete('/signOut', (req, res) => {
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

module.exports = app;
