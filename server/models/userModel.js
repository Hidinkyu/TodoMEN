// TODO: Require all dependencies
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const { SALT_WORK_FACTOR } = process.env;

// TODO: create a schema for user
const userSchema = new Schema({
  email: {
    type: String,
    require: false,
    default: null,
  },
  userName: {
    type: String,
    require: false,
    unique: true,
  },
  password: {
    type: String,
    require: false,
    default: null,
  },
  todo: {
    type: Array(String),
    require: false,
    default: [],
  },
});

userSchema.pre('save', (next) => {
  bcrypt.hash(this.password, process.env.SALT_WORK_FACTOR, (_, hash) => {
    this.password = hash;
    next();
  });
});

const User = mongoose.model('User', userSchema);

module.exports = User;
