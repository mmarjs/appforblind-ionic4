'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NarrationSchema = new Schema({
  owner:  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: String,
  language: String,
  published: Boolean,
  created: Date,
  updated: Date,
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  },
  characters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Character'
  }],
  locations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location'
  }],
  scenes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scene'
  }]
}, { collection: 'narrations' });

module.exports = mongoose.model('Narration', NarrationSchema);
