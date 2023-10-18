const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  apiKey: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    validate: {
      validator: (v) => /\S+@\S+\.\S+/.test(v),
      message: props => `${props.value} is not a valid email!`
    }
  },
  total: {
    type: Number,
    default: 1000
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
