const mongoose = require("mongoose")


// Define the User schema
const userSchema = new mongoose.Schema({
    name: {
    type: String,
    required:true 
    },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the User model based on the schema
const User = mongoose.model('User', userSchema);
module.exports = User;