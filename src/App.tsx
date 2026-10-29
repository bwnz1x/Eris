import { useState } from 'react';
import type { WeatherInfo, MoonInfo } from './types/stargazing';
import { calculateScore } from './utils/stargazingScorer';
import './App.css'

function App() {
  const [cloudCover, setCloudCover] = useState<number>(10);
  const weather: WeatherInfo = {
    cloudCover: cloudCover,
    precipitationChance: 5,
    temperatureCelsius: 14,
    temperatureFarenheit: 57
  };
  const moon: MoonInfo = {
    currPhase: "Waxing Crescent",
    illumination: 0.15,
    moonRise: "6:30 PM",
    moonSet: "11:15 PM"
  };

  const result = calculateScore(weather, moon);

  
  return (
    <main style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif', padding: '20px' }}>
      <h1>Project Eris</h1>
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
            <div style={{ color: '#aaa', fontSize: '14px' }}>Stargazing Index / 100</div>
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

        {/* Cloud Cover Slider */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>
            Simulate Cloud Cover: <strong>{cloudCover}%</strong>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={cloudCover}
            onChange={(e) => setCloudCover(Number(e.target.value))}
            style={{ width: '100%' }}
          />
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
