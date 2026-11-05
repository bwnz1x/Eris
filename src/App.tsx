import { useState, useEffect } from 'react';
import { type WeatherInfo, type MoonInfo, type LocationCoord } from './types/stargazing';
import { calculateScore } from './utils/stargazingScorer';
import { fetchWeather } from './services/weatherService';
import Gauge from './component/Gauge';
import './App.css'
import SearchBox from './component/LocationSearch';

function App() {
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<LocationCoord>({
    latitude: 49.2497,
    longitude: -123.1193,
    location_name: "Vancouver"
  })

  useEffect(() => {
    fetchWeather(location.latitude, location.longitude)
      .then((data) => {
        setWeather(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [location.latitude, location.longitude]);

  const moon: MoonInfo = {
    currPhase: "Waxing Crescent",
    illumination: 0.15,
    moonRise: "6:30 PM",
    moonSet: "11:15 PM"
  };
  if (loading || !weather) {
    return (
      <main>
        <h1>Eris</h1>
        <p>Scanning the skies for tonight's forecast...</p>
      </main>
    );
  }

  // Below this 'if', TypeScript now KNOWS weather is 100% not null!

  const result = calculateScore(weather, moon);


  return (
    <main>
      <h1>Eris</h1>
      <p>Tonight's Stargazing Forecast</p>
      <p>Location: {location.location_name}</p>

      {/* Score Card */}
      <div>
        <div>
          <div>
            <div>{result.score}</div>
            <div>Stargazing Index</div>
          </div>
          <div>
            {result.rating}
          </div>
          <Gauge value={result.score}></Gauge>
        </div>
        <SearchBox onSelectLocation={setLocation} />
        <hr />

        {/* Live Weather Stats */}
        <div>
          <div>Clouds: <strong>{weather.cloudCover}%</strong></div>
          <div>Rain: <strong>{weather.precipitationChance}%</strong></div>
          <div>Temp: <strong>{weather.temperatureCelsius}°C ({weather.temperatureFarenheit}°F)</strong></div>
        </div>

        {/* Reasons & Notes */}
        <div>
          <h4>Sky Conditions:</h4>
          <ul>
            {result.summaryNote.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}

export default App
