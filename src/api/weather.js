
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = "https://api.weatherapi.com/v1";

export async function getWeather(city = "Tbilisi", days = 3) {
  if (!API_KEY) {
    throw new Error("Weather API Key არ არის მითითებული.");
  }

  const params = new URLSearchParams({
    key: API_KEY,
    q: city,
    days: String(days),
    aqi: "no",
    alerts: "no",
    lang: "ka",
  });

  const response = await fetch(
    `${BASE_URL}/forecast.json?${params}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error?.message || "ამინდის მონაცემების მიღება ვერ მოხერხდა."
    );
  }

  return data;
}
