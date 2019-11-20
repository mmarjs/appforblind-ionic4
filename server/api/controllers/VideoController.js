'use strict';

var mongoose = require('mongoose'),
  Video = mongoose.model('Video'),
  Narration = mongoose.model('Narration'),
  axios = require('axios');


exports.list_videos = function (req, res) {
  Video.find({}, function (err, task) {
    if (err)
      res.send(err);
    res.json(task);
  }).sort([['date', -1]]);
};

exports.get_video_by_id = function (req, res) {
  Video.findById(req.params.videoId, function (err, task) {
    if (err)
      res.send(err);
    res.json(task);
  })
    .populate('characters')
    .populate('locations')
    .populate('scenes');
};

exports.get_narrations = function (req, res) {
  Narration.find({ 'video': req.params.videoId }, { _id: 1, type: 1 }, function (err, narration) {
    if (err)
      res.send(err);
    res.json(narration);
  });
};

exports.add_video = async (request, response) => {
  try {
    const { userId } = request;
    
    if (!userId) {
        return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
    }

    let video = new Video(request.body);
    let result = await video.save();
    response.send(result);
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
}

exports.find_videos = async (req, res) => {
  const { key } = req.query;

  Video.find({
    $or: [
      { title: {'$regex' : key, '$options' : 'i'} },
      { videoUrl: key }
    ]
  }, (err, task) => {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.create_video_from_youtube_id = async (req, res) => {
  try {
    const { userId } = req;
    
    if (!userId) {
        return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
    }

    const { videoUrl, id } = req.body;
    const youtubeResponse = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${process.env.YOOTUBE_API_KEY}`);
    const videoList = youtubeResponse.data;
    const video = videoList.items[0];
    if (video) {
      const title = video.snippet.title;
      const description = video.snippet.description;

      const data = { title, description, videoUrl };
      req.body = data;

      return exports.add_video(req, res);
    }

  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
}


