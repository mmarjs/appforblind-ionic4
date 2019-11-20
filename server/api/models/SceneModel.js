'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SceneSchema = new Schema({
  name: String,
  description: String,
  order: Number,
  from: String,
  to: String
}, { collection: 'scenes' });

module.exports = mongoose.model('Scene', SceneSchema);

