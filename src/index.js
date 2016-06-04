'use strict';

const merge = require('lodash.merge');
const cookieParser = require('cookie-parser');

module.exports = function(app, config) {

  var defaults = {
    name: 'feathers-jwt'
  };
  config = merge(defaults, config);

  // Remove the CORS headers for SSR requests. Require same-origin.
  app.use(function(req, res, next){
    delete res._headers['access-control-allow-origin'];
    delete res._headerNames['access-control-allow-origin'];
    next();
  });
  app.use(cookieParser());

  /**
   * If a <config.name> cookie is received, take the token and
   * set it up in the Authorization header.
   */
  return function(req, res, next) {
    let token = req.cookies[config.name];
    if (token) {
      req.headers.authorization = `Bearer ${token}`;
    }
    next();
  };
};
