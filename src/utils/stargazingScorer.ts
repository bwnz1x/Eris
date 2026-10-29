import type { WeatherInfo, MoonInfo, StargazingRating } from "../types/stargazing";

export interface Score {
  score: number;
  rating: StargazingRating;
  summaryNote: string[];
}

function getRating(score: number): StargazingRating {
  const tiers: { minScore: number; rating: StargazingRating }[] = [
    { minScore: 85, rating: 'Excellent' },
    { minScore: 70, rating: 'Great' },
    { minScore: 55, rating: 'Good' },
    { minScore: 40, rating: 'Fair' },
    { minScore: 0, rating: 'Poor' }
  ];

  const matched = tiers.find(tier => score >= tier.minScore);
  return matched ? matched.rating : 'Poor';
}








// Main Score
export function calculateScore(weather: WeatherInfo, moon: MoonInfo): Score {
  let score = 100;
  const notes: string[] = [];

  if (weather.cloudCover < 15) {
    notes.push("Crystal Clear Skies");
  } else if (weather.cloudCover >= 15 && weather.cloudCover < 50) {
    score -= 20;
    notes.push("Passing Clouds");
  } else {
    score -= 60;
    notes.push("High Clouds Cover");
  }

  if (weather.precipitationChance > 15 && weather.precipitationChance <= 35) {
    score -= 15;
    notes.push("Chance of Rain"); 
  } else if (weather.precipitationChance > 35) {
    score -= 30;
    notes.push("High Chance of Rain")
  }

  if (moon.illumination < 0.2) {
    notes.push("Dark skies with minimal Moonlight");
  } else if (moon.illumination > 0.7) {
    score -= 20;
    notes.push("Heavy Moonlight")
  }

  const rating = getRating(score)

  
  return {score, rating, summaryNote: notes}
}