'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VideoSchema = new Schema({
  title: String,
  videoUrl: String,
  language: String,
  description: String
}, { collection: 'videos' });

module.exports = mongoose.model('Video', VideoSchema);
