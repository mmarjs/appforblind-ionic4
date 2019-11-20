'use strict';

module.exports = function(app) {
  var Controller = require('../controllers/VideoController');

  app.route('/videos')
    .get(Controller.list_videos);

  app.route('/videos')
    .post(Controller.add_video);

  app.route('/videos/find')
    .get(Controller.find_videos)

  app.route('/videos/:videoId')
    .get(Controller.get_video_by_id);

  app.route('/videos/youtube')
    .post(Controller.create_video_from_youtube_id);

  app.route('/videos/:videoId/narrations')
    .get(Controller.get_narrations);
};
