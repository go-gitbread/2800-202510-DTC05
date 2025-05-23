# 🐾 SwoleCat

## 📝 Project Description

**SwoleCat** is a gamified fitness tracking web app that turns exercise into an adventure. As users complete workouts, they help their virtual cat companion evolve from a lazy couch potato to the ultimate gym machine. By combining real-world fitness tracking with rewarding RPG-style progression, SwoleCat aims to keep users consistent, motivated, and engaged in their health journey.

---

## 🛠 Technologies Used

### Frontend
- HTML  
- CSS  
- Bootstrap  

### Backend
- JavaScript (Node.js)  
- Express.js  
- [Axios](https://axios-http.com/docs/intro) – for making HTTP requests to external APIs
- [OpenWeather API](https://openweathermap.org/api) – real-time weather info  
- [IPGeo API](https://ipgeolocation.io/) – autofill user location  
- [OpenAI API](https://platform.openai.com/) – chatbot advice and tips  

### Database
- [MongoDB Atlas](https://www.mongodb.com/atlas/database)

---

## 📁 Folder Structure Overview

```
1. /
├── 1.1 server.js                 # Main Express server file
├── 1.2 package.json             # Project metadata and dependencies
├── 1.3 package-lock.json        # Auto-generated lockfile for npm installs
├── 1.4 README.md                # Project documentation
├── 1.5 text.txt                 # Temporary or placeholder file (not part of app)
├── 1.6 .env                     # Environment variables (not included in repo)
│
├── 2. public/                   # Static frontend assets
│   ├── 2.1 about.css
│   ├── 2.2 coachOffice.css
│   ├── 2.3 dashboard.css
│   ├── 2.4 exerciseSession.css
│   ├── 2.5 friends.css
│   ├── 2.6 history.css
│   ├── 2.7 home.css
│   ├── 2.8 images/              # App icons and cat evolution sprites
│   │   ├── 2.8.1 1couchPotato.png         # First evolution stage
│   │   ├── 2.8.2 2gymAmatuer.png
│   │   ├── 2.8.3 3gymBro.png
│   │   ├── 2.8.4 4ultimateGymMachine.png  # Final evolution stage
│   │   ├── 2.8.5 plus.png, garbageBin.png, link.png, etc.  # UI icons
│   ├── 2.9 index.css
│   ├── 2.10 leaderboard.css
│   ├── 2.11 login.css
│   ├── 2.12 navbar.css
│   ├── 2.13 newRoutine.css
│   ├── 2.14 profile.css
│   ├── 2.15 register.css
│   ├── 2.16 routines.css
│   ├── 2.17 selectExercise.css
│   ├── 2.18 weather.css
│   ├── 2.19 js/                 # Frontend logic
│   │   ├── 2.19.1 coachOffice.js          # Handles AI chat logic
│   │   ├── 2.19.2 compareExercises.js     # Exercise comparison logic
│   │   ├── 2.19.3 exercises.js            # Stores exercise data
│   │   ├── 2.19.4 exerciseSession.js      # Logs sessions
│   │   ├── 2.19.5 navbar.js               # Navbar toggle behavior
│   │   └── 2.19.6 weather.js              # Fetches and displays weather
│
├── 3. routes/
│   └── 3.1 exerciseSession.js   # Route handler for workout sessions
│
└── 4. views/                    # EJS templates for each page
    ├── 4.1 about.ejs
    ├── 4.2 coachOffice.ejs      # Chatbot UI
    ├── 4.3 dashboard.ejs
    ├── 4.4 editProfile.ejs
    ├── 4.5 exerciseSession.ejs
    ├── 4.6 friends.ejs
    ├── 4.7 history.ejs
    ├── 4.8 home.ejs

```

---

## 🔧 How to Install or Run the Project

### Prerequisites

- [Node.js (v18+)](https://nodejs.org/)
- [MongoDB Atlas](https://www.mongodb.com/atlas/database) or local MongoDB
- [Git](https://git-scm.com/)
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- **IDE**: Visual Studio Code or any modern text editor
- Chrome or another modern browser

---

### APIs & Services Used

- [OpenWeather API](https://openweathermap.org/api)  
- [IPGeo API](https://ipgeolocation.io/)  
- [OpenAI API](https://platform.openai.com/)  
- [MongoDB Atlas](https://www.mongodb.com/atlas/database)

**All API keys must be added to a `.env` file.**

---

### Required Environment Variables

Create a `.env` file in the root directory with:

```
MONGO_URI=your_mongodb_connection_string
OPENWEATHER_API_KEY=your_openweather_key
IPGEO_API_KEY=your_ipgeo_key
OPENAI_API_KEY=your_openai_key
```

---

### Installation Steps

1. **Install prerequisites**
2. **Clone the repo**
   ```bash
   git clone https://github.com/go-gitbread/2800-202510-DTC05.git
   cd 2800-202510-DTC05
   ```
3. **Install dependencies**
   ```bash
   npm install
   ```
4. **Create a `.env` file** in the root and add the environment variables listed above
5. **Start the development server**
   ```bash
   node server.js
   ```
6. **Visit the app**

   Open `http://localhost:3000` in your browser

---

## ✅ Testing Plan

[📄 View the Testing Log](https://docs.google.com/spreadsheets/d/1701iC26XvUd-vWbiwc_XtGoMBJCNExGtMWBHQqE0p7M/edit?gid=394496370#gid=394496370)

---

## 🚀 Features

- 🕹 **Routine Management** – Create, edit, and reuse workout routines  
- 💪 **Workout Logging** – Log reps, sets, and optional weight  
- 📈 **Progress Dashboard** – View daily stats, history, XP and level  
- 🐱 **Gamified Cat Evolution** – Evolve your cat through 4 stages  
- 🏆 **Leaderboards & Friends** – Compete with friends and compare stats  
- 🧠 **AI Fitness Coach** – Get motivational advice and tips from the Coach Office  
- ☁️ **Weather Integration** – Real-time local weather

---

## 👥 Credits

**Developed by Team DTC-05**
- Roger Vanderheyden  
- Steve Xie  
- Jia Yin (Jossie) Yan  
- Mahyar Golestanpour  
- Anthony Herradura

**Special thanks**  
- BCIT CST Faculty & Mentors  

**Inspired by**  
- Fitness gamification trends  
- Pet simulation games

---

## 📄 License

This project is for **educational use only**.  
No license is granted for commercial use.  
All rights reserved © 2025.

---

## 🤖 Use of APIs & AI

- **OpenAI API**  
  Used in the Coach Office, where users chat with an AI fitness coach for tips and motivation. It does **not** use user progress data.

- **OpenWeather API**  
  Displays local weather and temperature based on IP location.

- **IPGeo API**  
  Estimates user’s location for weather data.

---

## 📬 Contact

**Name**: Jossie Yan  
**Email**: jyan72@my.bcit.ca  
**GitHub**: [go-gitbread](https://github.com/go-gitbread)
