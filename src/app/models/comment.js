const bcrypt = require('bcrypt');
const mongoose = require('mongooose');
const uniqueValidator = require('mongoose-unique-validator');

const commentSchema = new mongoose.Schema({
  name: String,
  content: String
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
