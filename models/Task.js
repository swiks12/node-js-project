const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const taskSchema = new Schema({
  task: {
    required:true,
    type: String,
    lowercase: true,
  },
  dateAssigned: {
    required: true,
    type: Date,
  },
  
  dueDate: {
    required: true,
    type: Date,
 },
 client: {
  required: true,
  type: String,
  lowercase: true,
},
username:{
  required: true,
  type: String,
  lowercase: true,
},
});

const User = mongoose.model("Task", taskSchema);

module.exports = User;
