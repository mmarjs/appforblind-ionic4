'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LocationSchema = new Schema({
  name: String,
  description: String,
  order: Number
}, { collection: 'locations' });

module.exports = mongoose.model('Location', LocationSchema);

