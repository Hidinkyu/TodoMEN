const Session = require('../models/sessionModel.js');
const User = require('../models/userModel.js');

const sessionController = {
  isLoggedIn(req, res, next) {
    const { SSID } = req.cookies;
    if (!SSID) {
      return next({
        log: `sessionController.isLoggedIn: No session found.`,
        status: 401,
        message: { err: 'No SSID session found.' },
      });
    }
    Session.findOne({ _id: SSID }, async (err, records) => {
      if (err)
        return next({
          log: `sessionController.isLoggedIn: ${err}`,
          status: 500,
          message: { err: 'An error occurred' },
        });
      if (records === null || records?.userId === null)
        return next({
          log: `sessionController.isLoggedIn: Records is null`,
          status: 401,
          message: { err: 'No session found.' },
        });
      User.findOne({ _id: records.userId }, (err, user) => {
        if (err)
          return next({
            log: `sessionController.isLoggedIn: ${err}`,
            status: 500,
            message: { err: 'An error occurred' },
          });

        res.locals.user = user;
        return next();
      });
    });
  },
};
