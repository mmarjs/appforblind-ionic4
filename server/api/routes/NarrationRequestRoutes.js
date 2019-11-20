'use strict';

module.exports = function(app) {
  var Controller = require('../controllers/NarrationRequestController');

  app.route('/narrations-requests/:videoId')
    .get(Controller.add);

  app.route('/narrations-requests')
    .get(Controller.get_requests);

};
