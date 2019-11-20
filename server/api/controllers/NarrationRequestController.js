'use strict';

var mongoose = require('mongoose'),
  NarrationRequest = mongoose.model('NarrationRequest');


exports.add = async (request, response) => {
  const { userId } = request;

  if (!userId) {
    return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
  }

  const narrationReq = new NarrationRequest({ video: request.params.videoId, owner: userId, status: 'OPEN' });
  const result = await narrationReq.save();

  response.send(narrationReq);
};

exports.get_requests = async (request, response) => {
  NarrationRequest.find({ status: 'OPEN' }, function (err, task) {
    if (err) {
      response.send(err);
    }
    response.json(task);
  })
    .populate('video')
    .populate('owner');
};
