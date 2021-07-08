const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const addressSchema = new Schema({
  houseNumber: String,
  aptNumber: String,
  streetName: String,
  city: String,
  state: String,
  zip: Number,
}, {
  timestamps: true,
});

const Address = mongoose.model('Address', addressSchema);
module.exports = Address;
