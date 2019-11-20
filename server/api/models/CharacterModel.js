'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CharacterSchema = new Schema({
  name: String,
  description: String,
  order: Number
}, { collection: 'characters' });

module.exports = mongoose.model('Character', CharacterSchema);

