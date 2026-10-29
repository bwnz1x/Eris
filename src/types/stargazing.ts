export interface LocationCoord {
  latitude: number;
  longitude: number;
  location_name?: string;
}

export interface MoonInfo {
  currPhase: string;
  illumination: number;
  moonRise: string | null;
  moonSet: string | null;
}

export interface WeatherInfo {
  cloudCover: number;
  precipitationChance: number;
  temperatureCelsius: number;
  temperatureFarenheit: number;
}

export type StargazingRating = 'Excellent' | 'Great' | 'Good' | 'Fair' | 'Poor'

export interface NightForecast {
  date: string;
  score: number;
  summaryNote: string[];
  weather: WeatherInfo;
  moon: MoonInfo;
  rating: StargazingRating;
}