const mongoose = require('mongoose');

const WorkoutLogSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  date: {type: Date, required: true},
  routines: {type: Object, required: true, default: {}},
  duration: {type: String, required: true},
  xpGained: {type: Number, required: true}
}, { 
  timestamps: true // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('WorkoutLog', WorkoutLogSchema);