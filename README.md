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
├── package-lock.json
├── package.json
├── public
│   ├── css
│   │   ├── about.css
│   │   ├── coachOffice.css
│   │   ├── dashboard.css
│   │   ├── exerciseSession.css
│   │   ├── friends.css
│   │   ├── history.css
│   │   ├── leaderboard.css
│   │   ├── login.css
│   │   ├── navbar.css
│   │   ├── newRoutine.css
│   │   ├── profile.css
│   │   ├── register.css
│   │   ├── routines.css
│   │   ├── selectExercise.css
│   │   ├── weather.css
│   │   └── workoutGuide.css
│   ├── images
│   │   ├── 1couchPotato.png
│   │   ├── 2gymAmatuer.png
│   │   ├── 3gymBro.png
│   │   ├── 4ultimateGymMachine.png
│   │   ├── back.png
│   │   ├── diskette.png
│   │   ├── garbageBin.png
│   │   ├── link.png
│   │   ├── plus.png
│   │   └── profile.jpg
│   └── js
│       ├── coachOffice.js
│       ├── compareExercises.js
│       ├── exercises.js
│       ├── exerciseSession.js
│       ├── navbar.js
│       └── weather.js
├── README.md
├── server.js
└── views
    ├── about.ejs
    ├── coachOffice.ejs
    ├── dashboard.ejs
    ├── editProfile.ejs
    ├── exerciseSession.ejs
    ├── friends.ejs
    ├── history.ejs
    ├── leaderboard.ejs
    ├── login.ejs
    ├── newRoutine.ejs
    ├── partials
    │   └── navbar.ejs
    ├── profile.ejs
    ├── register.ejs
    ├── routines.ejs
    ├── selectExercise.ejs
    └── workoutGuide.ejs

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
