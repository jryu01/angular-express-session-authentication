/**
 * middleware for securing routes
 *
 */

'use strict';

// generic require signin middleware
exports.requiresSiginin = function (req, res, next) {
  if (!req.isAuthenticated()) {
    var info = {
      success: false,
      info: {message: "requires authentication"}
    };
    return res.send(401, info);
  }
  next();
};
