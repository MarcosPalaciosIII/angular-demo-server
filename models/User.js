const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  address: [{ type: Schema.Types.ObjectId, ref: 'Address'}],
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);
module.exports = User;
