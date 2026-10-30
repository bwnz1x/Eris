import { fetchWeatherApi } from "openmeteo";
import type { WeatherInfo } from "../types/stargazing";

export async function fetchWeather(
  lat: number,
  long: number
): Promise<WeatherInfo> {

  const params = {
	latitude: lat,
	longitude: long,
	hourly: ["temperature_2m", "cloud_cover", "precipitation_probability"],
  };
  const url = "https://api.open-meteo.com/v1/forecast";
  const responses = await fetchWeatherApi(url, params);

  const response = responses[0];
  const hourly = response.hourly()!;
  const utcOffsetSeconds = response.utcOffsetSeconds();
  
  // Note: The order of weather variables in the URL query and the indices below need to match!
  const weatherData = {
	hourly: {
		time: Array.from(
			{ length: (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval() }, 
			(_ , i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
		),
		temperature_2m: hourly.variables(0)!.valuesArray(),
		cloud_cover: hourly.variables(1)!.valuesArray(),
		precipitation_probability: hourly.variables(2)!.valuesArray(),
	},
  };
  const nightHour = 22;
  const tempC = weatherData.hourly.temperature_2m![nightHour];
  const tempF = tempC * 9/5 + 32
  
  return {
    precipitationChance: weatherData.hourly.precipitation_probability![nightHour],
    cloudCover: weatherData.hourly.cloud_cover![nightHour],
    temperatureCelsius: Math.round(tempC),
    temperatureFarenheit: Math.round(tempF)
    
    
}
}




