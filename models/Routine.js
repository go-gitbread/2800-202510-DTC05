const mongoose = require('mongoose');

const routineSchema = new mongoose.Schema({
  routineName: { type: String, required: true },  // Routine name
  exercises: [{ type: String }],    //Array of selected exercises
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to the user who owns this routine
});

module.exports = mongoose.model('Routine', routineSchema);