import { fetchWeatherApi } from 'openmeteo';

type FetchWetherParams = {
	latitude: string;
	longitude: string;
	daily?: string | string[];
	timezone?: string;
	forecast_days: number;
	start_date?: string;
};

const url = 'https://api.open-meteo.com/v1/forecast';

export const getSFCWeather = async (start_date: Date) => {
	const params: FetchWetherParams = {
		latitude: '35.38802564602393',
		longitude: '139.4272695032582',
		daily: [
			'temperature_2m_max',
			'temperature_2m_min',
			'precipitation_probability_max',
			'precipitation_probability_min',
			'precipitation_probability_mean',
		],
		timezone: 'Asia/Tokyo',
		forecast_days: 1,
		start_date: start_date.toDateString().slice(0, 10),
	};

	const responses = await fetchWeatherApi(url, params);

	// Helper function to form time ranges
	const range = (start: number, stop: number, step: number) => Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

	// Process first location. Add a for-loop for multiple locations or weather models
	const response = responses[0];

	// Attributes for timezone and location
	const utcOffsetSeconds = response.utcOffsetSeconds();
	const timezone = response.timezone();
	const timezoneAbbreviation = response.timezoneAbbreviation();
	const latitude = response.latitude();
	const longitude = response.longitude();

	const hourly = response.hourly()!;

	// Note: The order of weather variables in the URL query and the indices below need to match!
	const weatherData = {
		hourly: {
			time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
			temperature2m: hourly.variables(0)!.valuesArray()!,
		},
	};

	// `weatherData` now contains a simple structure with arrays for datetime and weather data
	for (let i = 0; i < weatherData.hourly.time.length; i++) {
		console.log(weatherData.hourly.time[i].toISOString(), weatherData.hourly.temperature2m[i]);
	}
};
