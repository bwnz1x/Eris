import type { LocationCoord } from "../types/stargazing";

export async function searchCities(query: string): Promise<LocationCoord[]> {
  // Too short of a query
  if (query.trim().length < 2) {
    return [];
  }
  
  const apiLink = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=10&language=en&format=json`
  const response = await fetch(apiLink);
  const data = await response.json();

  // No City Matches
  if (!data.results) {
    return [];
  }

  return data.results.map((item: any) => ({
    latitude: item.latitude,
    longitude: item.longitude,
    location_name: item.country
      ? `${item.name}, ${item.admin1}, ${item.country}`
      : item.name
  }))
  
  
}