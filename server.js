const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const dotenv = require('dotenv');
const User = require('./models/User');
const exercises = require('./public/js/exercises');
const Routine = require('./models/Routine');

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
// static file for the style
app.use(express.static("public"));

app.use(session({
  secret: 'secretKey',
  resave: false,
  saveUninitialized: true
}));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// Middleware to expose user to all views
app.use((req, res, next) => {
  res.locals.username = req.session.userEmail;
  next();
});

// Routes
app.get('/', (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  res.render('index');
});

//register.ejs
app.get('/register', (req, res) => res.render('register'));
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashed });
  await user.save();
  res.redirect('/login');
});

//login.ejs
app.get('/login', (req, res) => res.render('login'));
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.userId = user._id;
    req.session.userEmail = user.email;
    res.redirect('/');
  } else {
    res.send('Login failed');
  }
});

// home.ejs
app.get('/home', (req, res) => res.render('home'));

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});
// //Route to go to the Routines page
// app.get('/routines', (req, res) => res.render('routines'));
//Route to go to the Create New Routine page
app.get('/newRoutine', (req, res) => {
  const routine = req.session.routine || []; // This is the new routine draft. If no exercises have been added, show an empty list
  res.render('newRoutine', { routine }); // Second argument loads the routine draft array so the page can access it & populate the list
});
//Route to go to the Exercise Selection page
app.get('/selectExercise', (req, res) => { res.render('selectExercise', {exercises})}); // Second argument loads the exercises array so the page can access it
//Route for the back button
app.get('/back', (req, res) => res.redirect('home'));

//Route to Add an Exercise to a new routine
app.get('/addExercise', (req, res) => {
  const exerciseName = req.query.exercise;
  if (!exerciseName) return res.redirect('/selectExercise');
  if (!req.session.routine) {   
    req.session.routine = []; // Initialize routine array in session if empty
  }
  if (!req.session.routine.includes(exerciseName)) {       // Prevent duplicates
    req.session.routine.push(exerciseName); //Only add a new exercise if it's not already included 
  }
  res.redirect('/newRoutine'); // Redirect back to Routine creation page after clicking to add an exercise
});

//Route for deleting an exercise from a new routine
app.post('/deleteExercise', (req, res) => {
  const { exerciseName } = req.body;
  if (req.session.routine) {
    req.session.routine = req.session.routine.filter(name => name !== exerciseName);
  }
  res.sendStatus(200);
});

// Route to save a routine to the Database , linked by userId
app.post('/saveRoutine', async (req, res) => { //When the saveRoutine route is triggered...
  const { routineName, exercises } = req.body; //Get the routine name & exercises
  const userId = req.session.userId;  // Get the userId from the session
  
  //Error handling in case user is not signed in
  if (!userId) {
    return res.status(401).send('User is not logged in');
  }
  
  // Create a new routine document
  const routine = new Routine({
    routineName, // Save the name of the new routine
    exercises, //Save the exercises to the new routine
    userId,  // Associate the routine with the logged-in user
  });

  try {
    await routine.save();     // Save the routine to the database
    req.session.routine = []; // Clear the routine from the session after saving
    res.status(200).send('Routine saved successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to save routine');
  }
});

// Route to display all routines for the logged-in user
app.get('/routines', async (req, res) => {
  const userId = req.session.userId;  // Get the userId from the session
  
  if (!userId) {
    return res.status(401).send('User is not logged in');  // Ensure user is logged in
  }

  try {
    // Fetch routines associated with the current user from the database
    const routines = await Routine.find({ userId });  

    // Render the routines page and pass the routines data to the template
    res.render('routines', { routines });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching routines');
  }
});//Route for profile page
app.get('/profile', (req, res) => {
  if (!req.session.userId) return res.redirect('/login');

  res.render('profile', {
    username: req.session.userEmail.split('@')[0], 
    email: req.session.userEmail,
    joinedDate: new Date().toDateString()
  });
});

// use async to get the email
app.get('/leaderboard', async (req, res) => {
  const data = await User.find().select('email');
  res.render('leaderboard', { usersList: data });
  // try {
  //   const data = await User.find().select('email');
  //   res.render('leaderboard', { usersList: data });
  // } catch (err) {
  //   console.error(err);
  //   res.status(500).send("Error retrieving users");
  // }
});

// about page 
app.get('/about', (req, res) => {
  res.render('about');
})



app.get('/workoutGuide', (req, res) => {
    res.render('workoutGuide');
})


app.listen(3000, () => console.log('Server running on http://localhost:3000'));