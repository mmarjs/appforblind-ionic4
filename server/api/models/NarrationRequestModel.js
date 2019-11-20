'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NarrationRequestSchema = new Schema({
  owner:  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  },
  status: String
}, { collection: 'narrationRequest' });

module.exports = mongoose.model('NarrationRequest', NarrationRequestSchema);
