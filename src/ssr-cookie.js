'use strict';

const jwt = require('jsonwebtoken');
const merge = require('lodash.merge');

module.exports = function(app, config) {

  var defaults = {
    endpoint: '/ssr-cookie',
    name: 'feathers-jwt',
    cookie: {
      httpOnly: true
    }
  };
  config = merge(defaults, config);

  /**
   * The `ssr-cookie` middleware receives a token in the POST body and sets up
   * that token in a cookie. The cookie will have the same expiration as that of
   * the token.
   */
  app.post(config.endpoint, function(req, res) {
    var token = req.body && req.body['ssr-token'];
    if (token) {
      jwt.verify(token, app.get('auth').token.secret, function(err, decoded) {
        if (err) {
          return res.status(400).send({
            message: 'Invalid token.',
            err
          });
        }
        config.cookie.expires = new Date(decoded.exp * 1000);
        delete config.cookie.maxAge;
        res.cookie(config.name, token, config.cookie);
        return res.status(200).send({
          message: 'success'
        });
      });

    // No `ssr-token` was received.
    } else {
      return res.status(400).send({
        message: 'Please include a valid token in the request body.'
      });
    }
  });
};
