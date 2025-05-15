const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const dotenv = require('dotenv');
const User = require('./models/User');
const exerciseSessionRoutes = require('./routes/exerciseSession'); // Load modular route for exercise session
const exercises = require('./public/js/exercises');
const Routine = require('./models/Routine');
const axios = require('axios');
const WorkoutLog = require('./models/WorkoutLog');

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

// Mount the exercise session routes at /exerciseSession
app.use('/exerciseSession', exerciseSessionRoutes);

// Route: Dashboard (index)
// If user is logged in, display dashboard with a random motivational quote
// Otherwise, redirect to login page
app.get('/', (req, res) => {
  if (!req.session.userId) return res.redirect('/login');

  const quotes = [
    "Unleash your inner beast. There's a lion inside every cat.",
    "Don't stop until you're feline fine.",
    "You're making good pawgress. Keep it up!",
    "Fuel your purrformance with a little tuna.",
    "What are you waiting for? The time is meow.",
    "One smol step for cat, one swole leap for catkind.",
    "It's a purrfect day to be swole.",
    "Stay pawsitive. Gains are just a stretch away.",
    "Consistency builds fur-titude.",
    "The road to swole is paved with paw prints.",
    "No more kitten around, it's go time. ",
    "It's never too late to pounce on your goals.",
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  res.render('index', { quote: randomQuote });
});

//register.ejs
app.get('/register', (req, res) => res.render('register'));
app.post('/register', async (req, res) => {
  const { name, catName, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, catName, email, password: hashed });
  await user.save();
  res.redirect('/login');
});

//login.ejs
app.get('/login', (req, res) => res.render('login', { error: null }));
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.render('login', {
      error: `😿 No account found with that email. Purrhaps try <a href="/register" class="alert-link">signing up</a>?`
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.render('login', { error: '🙀 Hiss! That password doesn\'t match our records. Try again.' });
  }

  req.session.userId = user._id;
  req.session.userEmail = user.email;
  res.redirect('/');
});



app.get('/weather', (req, res) => res.render('weather.ejs'));


// home.ejs
app.get('/home', (req, res) => res.render('home.ejs'));

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
app.get('/selectExercise', (req, res) => { res.render('selectExercise', { exercises }) }); // Second argument loads the exercises array so the page can access it
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
});

//Route for profile page
app.get('/profile', (req, res) => {
  if (!req.session.userId) return res.redirect('/login');

  res.render('profile', {
    isOwnProfile: true,
    username: req.session.userEmail.split('@')[0],
    email: req.session.userEmail,
    // joinedDate: new Date().toDateString()
  });
});



// Route for another user's profile page
app.get('/profile/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.render('profile', {
      isOwnProfile: false,
      username: user.name,
      email: user.email,
      // joinedDate: user.createdAt.toDateString()
    });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).send('Internal Server Error');
  }
});

// this leaderboard function was aided with the help of stackoverflow and chatgpt
app.get('/leaderboard', async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = 8; // 8 users per page

  try {
    const totalUsers = await User.countDocuments();
    const usersList = await User.find()
      .select('name')
      .select('level')
      .select('streak')
      .skip((page - 1) * limit)
      .limit(limit);

    const hasNextPage = page * limit < totalUsers;
    const hasPrevPage = page > 1;

    res.render('leaderboard', {
      usersList,
      currentPage: page,
      hasNextPage,
      hasPrevPage
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving users");
  }
});

// about page 
app.get('/about', (req, res) => {
  res.render('about');
})

//WEATHER
app.get('/weather', (req, res) => {
  res.render('weather');
})
// grab API keys from .env & set to variables
const GEO_API_KEY = process.env.GEO_API_KEY;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

// Helper function to fetch geolocation from IP
async function getGeoLocation(ipAddress) {

  const response = await axios.get('https://api.ipgeolocation.io/ipgeo', {  //Axios automatically transforms JSON responses, so you don't need to manually parse the response
    params: {
      apiKey: GEO_API_KEY,
      ip: ipAddress
    }
  });
  return response.data;
}

// Endpoint: Get IP-based location
app.get('/api/location', async (req, res) => {
  try {
    const ipAddress = (req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').replace('::1', '8.8.8.8');

    const locationData = await getGeoLocation(ipAddress);
    res.json({
      ip: locationData.ip,
      city: locationData.city,
      district: locationData.district || locationData.state_prov,
      latitude: locationData.latitude,
      longitude: locationData.longitude
    });
  } catch (err) {
    console.error('Location fetch error:', err.message);
    res.status(500).json({ error: 'Failed to get location' });
  }
});

// Endpoint: Get weather for IP-based location
app.get('/api/weather', async (req, res) => {
  try {
    const ip =
      (req.headers['x-real-ip'] ||
        req.headers['x-forwarded-for'] ||
        req.socket.remoteAddress || '').replace('::1', '8.8.8.8');

    ipArray = ip.split(",")
    ipFirst = ipArray[0]


    console.log(ipFirst);  // Log IP address for debugging

    const locationData = await getGeoLocation(ipFirst);
    console.log("Location Data:", locationData);  // Log the fetched geolocation

    const { latitude, longitude } = locationData;

    const weatherRes = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        lat: latitude,
        lon: longitude,
        appid: WEATHER_API_KEY,
        units: 'metric'
      }
    });

    console.log("Weather Data:", weatherRes.data);  // Log the weather data response

    res.json({
      temperature: weatherRes.data.main.temp,
      description: weatherRes.data.weather[0].description,
      icon: weatherRes.data.weather[0].icon,
      location: weatherRes.data.name
    });
  } catch (err) {
    console.error('Weather fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});



// app.get('/ip', (request, response) => {
//   const ip =
//     request.headers['x-real-ip'] ||
//     request.headers['x-forwarded-for'] ||
//     request.socket.remoteAddress || '';

//   ipArray = ip.split(",")
//   ipFirst = ipArray[0]

//   return response.json({
//     ipFirst
//   })
// });

//Route linking routine to session page after clicking a routine
app.get('/routine/:id/session', async (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  const routineId = req.params.id; //Grab the id from the URL >>> /routine/:id/session
  const userId = req.session.userId; //Grab the userID from the session
  try {
    // Find the specific routine by ID and ensure it belongs to the current user
    const routine = await Routine.findOne({ _id: routineId, userId: userId });
    if (!routine) {
      return res.status(404).send('Routine not found');
    }
    const workouts = []; //Initialize workouts as an empty array
    // Render the exerciseSession.ejs template, passing it the routine & workouts associated 
    res.render('exerciseSession', {
      routine: routine,
      workouts: workouts,
      userId: userId
    });
  } catch (err) {
    console.error('Error loading exercise session:', err);
    res.status(500).send('Error fetching routine details');
  }
});



const workoutLogs = {}; // e.g., { routineId1: [workout1, workout2], routineId2: [...] }

//Route for logging an exercise (Submitting the form)
app.post('/routine/:id/session', async (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }

  const routineId = req.params.id; //Grab the id from the URL >>> /routine/:id/session
  const userId = req.session.userId;//Grab the userID from the session
  const { exercise, sets, reps, duration } = req.body; //Grab the workout details from the form submission


  try {
    // Find the specific routine by ID and ensure it belongs to the current user 
    const routine = await Routine.findOne({ _id: routineId, userId });
    if (!routine) {
      return res.status(404).send('Routine not found');
    }
    // Create a new workout entry using the form data
    const newWorkout = {
      exercise,
      sets,
      reps,
      duration
    };
    // If no workouts have been logged yet, initialize an empty array
    if (!workoutLogs[routineId]) {
      workoutLogs[routineId] = [];
    }
    //Add the new workout entry to the workout log 
    workoutLogs[routineId].push(newWorkout);

    // Re-render the session page with updated workout log
    res.render('exerciseSession', {
      routine: routine,
      workouts: workoutLogs[routineId] || []
    });
  } catch (err) {
    console.error('Error saving workout:', err);
    res.status(500).send('Error saving workout');
  }
});

//Ai assisted routes for linking routines together in a single session
// Route for fetching a routine to add in the exercise session page
app.get('/api/routine/:id', async (req, res) => {
  console.log('Fetching routine with ID:', req.params.id);
  const routine = await Routine.findById(req.params.id);
  if (!routine) return res.status(404).json({ error: 'Not found' });
  res.json(routine);
});
//Route for fetching all routines associated with the user to select
app.get('/api/routines', async (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.status(401).json({ error: 'User not logged in' });
  }
  try {
    const routines = await Routine.find({ userId });
    res.json(routines);
  } catch (err) {
    console.error('Error fetching routines:', err);
    res.status(500).json({ error: 'Error fetching routines' });
  }
});
//Route for retrieving the exercises from the selected routine
app.post('/api/add-exercises/:id', async (req, res) => {
  const { exercises } = req.body;
  const routineId = req.params.id;
  if (!req.session.tempExercises) req.session.tempExercises = {};
  if (!req.session.tempExercises[routineId]) req.session.tempExercises[routineId] = [];
  req.session.tempExercises[routineId] = [...new Set([...req.session.tempExercises[routineId], ...exercises])];
  res.status(200).json({ message: 'Exercises added to session' });
});
//Route for merging the exercises from a selected routine into the current routine
app.get('/routine/:id/session', async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  const routineId = req.params.id; //Grab the id from the URL >>> /routine/:id/session
  const userId = req.session.userId; //Grab the userID from the session
  try {
    const routine = await Routine.findOne({ _id: routineId, userId });
    // Find the specific routine by ID and ensure it belongs to the current user
    if (!routine) return res.status(404).send('Routine not found');
    const workouts = workoutLogs[routineId] || []; //Initialize workouts as an empty array if none are logged yet
    const tempExercises = (req.session.tempExercises && req.session.tempExercises[routineId]) || [];
    const allExercises = [...new Set([...routine.exercises, ...tempExercises])]; // Merge all exercises and deduplicate
    res.render('exerciseSession', {
      routine: { ...routine.toObject(), exercises: allExercises },
      workouts
    });
  } catch (err) {
    console.error('Error loading exercise session:', err);
    res.status(500).send('Error fetching routine details');
  }
});

//Route for saving workout to the database
app.post('/api/log-workout/:routineId', async (req, res) => {
  try {
    const { userId, date, routines, duration, xpGained } = req.body;
    const mainRoutineId = req.params.routineId;

    // Validate required fields
    if (!userId || !date || !routines || !duration || xpGained === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create new workout log
    const workoutLog = new WorkoutLog({
      userId,
      date: new Date(date),
      routines, // Store routines object as-is
      duration,
      xpGained
    });

    // Save to database
    await workoutLog.save();

    // Send success response
    res.status(201).json({ message: 'Workout logged successfully', workoutLog });
  } catch (error) {
    console.error('Error saving workout log:', error);
    res.status(500).json({ error: 'Failed to save workout log' });
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));