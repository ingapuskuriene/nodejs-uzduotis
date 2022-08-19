const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requestsSchema = new Schema({
  requestor: {
    type: Schema.Types.Mixed,
    required: true,
  },
  owner: {
    type: Schema.Types.Mixed,
    required: true,
  },
  success: {
    type: Boolean,
    required: true,
  },
  complete: {
    type: Boolean,
    required: true,
  },
  requestedItems: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model('requests', requestsSchema);
