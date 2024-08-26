const mongoose = require('mongoose');
const validator = require('validator')

const TaskSchema = new mongoose.Schema({
  description: {
    required: true,
    trim: true,
    type: String
  },
  completed: {
    required: true,
    default: false,
    type: Boolean
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  } 
}, {
  timestamps: true
})

const Task = mongoose.model('Task', TaskSchema)

module.exports = Task