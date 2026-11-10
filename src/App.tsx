import { useState, useEffect } from 'react';
import { type WeatherInfo, type MoonInfo, type LocationCoord, type LightInfo } from './types/stargazing';
import { calculateScore } from './utils/stargazingScorer';
import { fetchWeather } from './services/weatherService';
import Gauge from './component/Gauge';
import './App.css'
import SearchBox from './component/LocationSearch';
import { fetchLightPol } from './services/lightPolService';

function App() {
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [light, setLight] = useState<LightInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<LocationCoord>({
    latitude: 49.2497,
    longitude: -123.1193,
    location_name: "Vancouver"
  })
  // Fallback data light
  const DEFAULT_LIGHT: LightInfo = {
    bortleClass: 5,   // Suburban sky
    sqmValue: 19.5,
  };

  useEffect(() => {
    setLoading(true);

    Promise.allSettled([
      fetchWeather(location.latitude, location.longitude),
      fetchLightPol(location.latitude, location.longitude)
    ]).then(([weatherRes, lightRes]) => {
      // for weather
      if (weatherRes.status === 'fulfilled') {
        setWeather(weatherRes.value);
      } else {
        console.error("Weather failed:", weatherRes.reason)
      }
      // for Light Pol 
      if (lightRes.status === 'fulfilled') {
        setLight(lightRes.value)
      } else {
        console.warn("Light pollution scale failed, using fallback:")
        setLight(DEFAULT_LIGHT);
      }

      setLoading(false);
    })
    
  }, [location.latitude, location.longitude]);

  const moon: MoonInfo = {
    currPhase: "Waxing Crescent",
    illumination: 0.15,
    moonRise: "6:30 PM",
    moonSet: "11:15 PM"
  };
  if (loading || !weather || !light) {
    return (
      <main>
        <h1>Eris</h1>
        <p>Scanning the skies for tonight's forecast...</p>
      </main>
    );
  }

  // Below this 'if', TypeScript now KNOWS weather is 100% not null!

  const result = calculateScore(weather, moon, light);


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
          <div>SQM: <strong>{light.sqmValue}</strong></div>
          <div>Bortle Class: <strong>Class {light.bortleClass}</strong></div>
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
        <a href='https://darkskysites.com/'>Light Pollution API provided by darkskysites</a>
      </div>
    </main>
  );
}

export default App
