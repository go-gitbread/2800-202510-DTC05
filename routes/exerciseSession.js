const express = require('express');
const exercises = require('../exercises.js');
const router = express.Router();

// GET /exerciseSession - Show the exercise page with log
router.get('/', (req, res) => {
  if (!req.session.userId) return res.redirect('/login');

  if (!req.session.workouts) req.session.workouts = [];
  if (!req.session.routine) {
    req.session.routine = {
      exercises: exercises.map(ex => ex.name) 
  };
}

  res.render('exerciseSession', { workouts: req.session.workouts, routine: req.session.routine });
});

module.exports = router;
