'use strict';

module.exports = function(app) {
  var Controller = require('../controllers/NarrationController');

  app.route('/narrations')
    .post(Controller.add_update_narration);
  
  app.route('/published-narrations')
    .get(Controller.get_published_narrations)

  app.route('/narrations')
    .get(Controller.get_my_narrations)

  app.route('/narrations/delete-audio')
    .get(Controller.get_presigned_url_for_delete_audio_by_key)

  app.route('/narrations/:narrationId')
    .post(Controller.add_update_narration)

  app.route('/narrations/:narrationId')
    .delete(Controller.delete_narration_by_id)

  app.route('/narrations/:narrationId')
    .get(Controller.get_narration_by_id);

  app.route('/narrations/owner/:ownerId')
    .get(Controller.get_narrations_by_owner)


};
