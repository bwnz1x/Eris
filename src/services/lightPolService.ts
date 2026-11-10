import type { LightInfo } from "../types/stargazing";

export async function fetchLightPol(
  lat: number,
  long: number
): Promise<LightInfo> {
  const response = await fetch(`https://darkskysites.com/api/sqm?lat=${lat}&lng=${long}`, {
    headers: { 'x-api-key': import.meta.env.VITE_DARKSKY_API }
  });

  if (!response.ok) {
    throw new Error(`Dark Sky API Error!: ${response.status}`);
  }
  
  const data = await response.json()

  return {
    sqmValue: data.result.sqm,
    bortleClass: data.result.bortle.class
  };

  
  
}