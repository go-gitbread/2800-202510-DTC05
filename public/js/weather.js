// public/js/weather.js

async function fetchWeather() {
      try {
        // Step 1: Get user location via IP
        const ipRes = await fetch('https://ipinfo.io/json?token=73f03c282c05eb');
        const ipData = await ipRes.json();
        const [lat, lon] = ipData.loc.split(',');
    
        // Step 2: Use OpenWeather API directly from frontend
        const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=4f8da96b4cbbc8e843257a06bc273a2b&units=metric`);
        const weather = await weatherRes.json();
    
        // Step 3: Update DOM
        document.getElementById('weather-location').textContent = weather.name;
        document.getElementById('temperature').textContent = Math.round(weather.main.temp);
        document.getElementById('icon').src = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;
        document.getElementById('icon').style.display = 'inline-block';
    
      } catch (err) {
        console.error('Weather widget error:', err);
        document.getElementById('weather-location').textContent = 'Location unavailable';
      }
    }
    
    // Run on page load
    window.addEventListener('DOMContentLoaded', fetchWeather);
    