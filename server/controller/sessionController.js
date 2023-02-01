const Session = require('../models/sessionModel.js');
const User = require('../models/userModel.js');

const sessionController = {
  async verify(req, res, next) {
    try {
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
          console.log('✅ Session verification success sent to cookie ✅');
          return next();
        });
      });
    } catch (e) {
      next({
        log: `Middleware Error occured at sessionController.isLoggedIn`,
        status: 500,
        message: { err: e.message },
      });
    }
  },
  startSession(req, res, next) {
    try {
      Session.create({ userId: res.locals.user.id }, (err, newSession) => {
        if (err)
          return next({
            log: `sessionController.startSession: ${err}`,
            status: 500,
            message: { err: 'An error occurred' },
          });

        if (newSession === null)
          return next({
            log: `sessionController.isLoggedIn: New session is null`,
            status: 500,
            message: { err: 'An error occured.' },
          });

        res.cookie('SSID', newSession._id, {
          maxAge: 1800000, // 30 mins
          httpOnly: true,
        });
        console.log('✅ Session start success sent to cookie ✅');
        return next();
      });
    } catch (e) {
      next({
        log: `Middleware Error occured at sessionController.startSession`,
        status: 500,
        message: { err: e.message },
      });
    }
  },
};

module.exports = sessionController;
