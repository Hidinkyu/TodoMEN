// TODO: requrire all dependencies
const express = require('express');
const router = express.Router();

// TODO: requrire all controllers
const authController = require('../controller/authController');
const sessionController = require('../controller/sessionController');

// TODO: import Schema
const user = require('../models/userModel');

// TODO: Create : Register an account to DB
router.post(
  '/signup',
  authController.signUp,
  authController.verifyUser,
  sessionController.startSession,
  (_, res) => {
    res.status(200).json(res.locals.user);
  },
);

router.post(
  '/login',
  authController.verifyUser,
  sessionController.startSession,
  (_, res) => {
    res.status(200).json(res.locals.user);
  },
);

module.exports = router;
