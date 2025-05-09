// Fetch location data
fetch('/api/location')
      .then(res => res.json())
      .then(data => {
            // Uncomment these lines if you want to display location details
            // document.getElementById('ip').textContent = data.ip || 'N/A';
            // document.getElementById('city').textContent = data.city || 'N/A';
            // document.getElementById('district').textContent = data.district || 'N/A';
            // document.getElementById('latitude').textContent = data.latitude || 'N/A';
            // document.getElementById('longitude').textContent = data.longitude || 'N/A';
      })
      .catch(err => {
            console.error('Location fetch error:', err);
      });

// Fetch weather data
fetch('/api/weather')
      .then(res => res.json())
      .then(data => {
            document.getElementById('weather-location').textContent = data.location || 'N/A';
            document.getElementById('temperature').textContent = data.temperature || 'N/A';

            if (data.icon) {
                  const icon = document.getElementById('icon');
                  icon.src = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;
                  icon.alt = data.description;
                  icon.style.display = 'inline';
            }
      })
      .catch(err => {
            console.error('Weather fetch error:', err);
      });