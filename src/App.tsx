import { useState, useEffect } from 'react';
import type { WeatherInfo, MoonInfo } from './types/stargazing';
import { calculateScore } from './utils/stargazingScorer';
import { fetchWeather } from './services/weatherService';
import './App.css'

function App() {
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeather(49.2497, -123.1193)
      .then((data) => {
        setWeather(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);
  
  const moon: MoonInfo = {
    currPhase: "Waxing Crescent",
    illumination: 0.15,
    moonRise: "6:30 PM",
    moonSet: "11:15 PM"
  };
  if (loading || !weather) {
    return (
      <main style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif', padding: '20px' }}>
        <h1>Eris</h1>
        <p style={{ color: '#aaa' }}>Scanning the skies for tonight's forecast...</p>
      </main>
    );
  }
  
  // Below this 'if', TypeScript now KNOWS weather is 100% not null!
  
  const result = calculateScore(weather, moon);

  
  return (
    <main style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif', padding: '20px' }}>
      <h1>Eris</h1>
      <p style={{ color: '#888' }}>Tonight's Stargazing Forecast</p>

      {/* Score Card */}
      <div style={{
        background: '#1a1c23',
        color: '#fff',
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid #333',
        marginTop: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '48px', fontWeight: 'bold' }}>{result.score}</div>
            <div style={{ color: '#aaa', fontSize: '14px' }}>Stargazing Index</div>
          </div>
          <div style={{
            fontSize: '18px',
            padding: '6px 16px',
            borderRadius: '20px',
            background: result.rating === 'Excellent' ? '#10b981' : '#f59e0b',
            color: '#000',
            fontWeight: 'bold'
          }}>
            {result.rating}
          </div>
        </div>

        <hr style={{ borderColor: '#333', margin: '20px 0' }} />

        {/* Live Weather Stats */}
        <div style={{ marginBottom: '20px', display: 'flex', gap: '16px', color: '#ccc' }}>
          <div>Clouds: <strong>{weather.cloudCover}%</strong></div>
          <div>Rain: <strong>{weather.precipitationChance}%</strong></div>
          <div>Temp: <strong>{weather.temperatureCelsius}°C ({weather.temperatureFarenheit}°F)</strong></div>
        </div>

        {/* Reasons & Notes */}
        <div>
          <h4>Sky Conditions:</h4>
          <ul>
            {result.summaryNote.map((note, index) => (
              <li key={index} style={{ marginBottom: '4px' }}>{note}</li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}

export default App
