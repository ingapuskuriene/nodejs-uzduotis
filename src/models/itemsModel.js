const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemsSchema = new Schema({
  owner: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('items', itemsSchema);
