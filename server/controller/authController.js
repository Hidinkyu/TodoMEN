const User = require('../models/userModel.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const authController = {
  // TODO: create signup middleware
  async signUp(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        console.log('new user created');
        await User.create({ email, password });
      }
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
    const { email, password } = req.body;
    try {
      if (!email || !password)
        throw new Error('No email, userName, or Password provided');
      User.findOne({ email }, (err, account) => {
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
        res.locals.user = {
          email: account.email,
          id: account._id,
          todo: account.todo,
        };
        return next();
      });
    } catch (e) {
      return next({
        log: `Error verifying user: ${e}`,
        status: 500,
        message: { err: e.message },
      });
    }
  },
};

module.exports = authController;
