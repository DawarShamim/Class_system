const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  classCode:{type:String,
    required:true,
    unique:true
  },
  name: {
    type: String,
    required: true,
  },createdBy:{
    type:String,
  },
  faculty: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    required: true,
  }],
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Class = mongoose.model("Class", classSchema);
module.exports = Class;
