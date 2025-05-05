const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const app = express();

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


// leaderboard.ejs
app.get('/leaderboard', (req, res) => res.render('leaderboard'));

app.listen(3000, () => console.log('Server running on http://localhost:3000'));