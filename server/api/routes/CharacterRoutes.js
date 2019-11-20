'use strict';

module.exports = function(app) {
  var Controller = require('../controllers/CharacterController');

  app.route('/character')
    .post(Controller.add);

  //app.route('/character/:characterId')
  //  .get(Controller.get_video_by_id);
};
