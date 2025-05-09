const express = require('express');
const router = express.Router();

// GET /exerciseSession - Show the exercise page with log
router.get('/', (req, res) => {
  if (!req.session.userId) return res.redirect('/login');

  if (!req.session.workouts) req.session.workouts = [];

  res.render('exerciseSession', { workouts: req.session.workouts });
});

// POST /exerciseSession - Add a new workout record
router.post('/', (req, res) => {
  const { exercise, sets, reps, duration } = req.body;

  const record = {
    exercise,
    sets: sets || null,
    reps: reps || null,
    duration: duration || null
  };

  if (!req.session.workouts) req.session.workouts = [];
  req.session.workouts.push(record);

  res.redirect('/exerciseSession');
});

module.exports = router;
