'use strict';

var mongoose = require('mongoose'),
Character = mongoose.model('Character');
Location = mongoose.model('Location');

exports.add = async (request, response) => {
  try {
    request.body.locations.each(location => {
      const locationObject = new Location(location);
      location = locationObject._id;
    })
    console.log(request.body);
    var character = new Character(request.body);
    var result = await character.save();
    response.send(result);
  } catch (error) {
    response.status(500).send(error);
  }
};
