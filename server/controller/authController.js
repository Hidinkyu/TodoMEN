const User = require('../models/userModel.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const authController = {
  // TODO: create signup middleware
  async signUp(req, res, next) {
    try {
      const { email, userName, password } = req.body;
      if (!email || !userName || !password)
        return new Error('No email, userName, or Password provided');
      await User.create({ email, userName, password });
      next();
    } catch (e) {
      return next({
        log: 'Middleware error caught in authController - signUp failed',
        status: 500,
        message: { err: e.message },
      });
    }
  },
  async verifyUser(req, res, next) {
    const { email, userName, password } = req.body;
    try {
      if (!email || !userName || !password)
        throw new Error('No email, userName, or Password provided');
      User.findOne({ email, userName }, (err, account) => {
        if (err) {
          return next({
            log: `Middleware error caught in authController - login failed: ${err}`,
            status: 500,
          });
        }
        const hashPass = account.password;
        bcrypt.compare(password, hashPass, (err, res) => {
          if (!res) return new Error('Incorrect password');
        });
        const user = {
          email: account.email,
          id: account._id,
          todo: account.todo,
        };
        res.locals.user = user;
        return next();
      });
    } catch (e) {
      return next({
        log: `Error verifying user: ${err}`,
        status: 500,
      });
    }
  },
};

module.exports = authController;
