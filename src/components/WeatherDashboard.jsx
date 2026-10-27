import { useEffect, useState } from "react";
import { getWeather } from "../api/weather";
import "./WeatherDashboard.css";

const CITIES = [
  { name: "თბილისი", value: "Tbilisi" },
  { name: "ბათუმი", value: "Batumi" },
  { name: "ქუთაისი", value: "Kutaisi" },
  { name: "რუსთავი", value: "Rustavi" },
  { name: "გორი", value: "Gori" },
  { name: "ზუგდიდი", value: "Zugdidi" },
  { name: "ფოთი", value: "Poti" },
  { name: "თელავი", value: "Telavi" },
  { name: "ახალციხე", value: "Akhaltsikhe" },
  { name: "ოზურგეთი", value: "Ozurgeti" },
  { name: "სამტრედია", value: "Samtredia" },
  { name: "სენაკი", value: "Senaki" },
  { name: "ზესტაფონი", value: "Zestafoni" },
  { name: "ხაშური", value: "Khashuri" },
  { name: "ბორჯომი", value: "Borjomi" },
  { name: "მარნეული", value: "Marneuli" },
  { name: "ქობულეთი", value: "Kobuleti" },
  { name: "ამბროლაური", value: "Ambrolauri" },
  { name: "ონი", value: "Oni" },
  { name: "ლაგოდეხი", value: "Lagodekhi" },
  { name: "გურჯაანი", value: "Gurjaani" },
  { name: "ყვარელი", value: "Kvareli" },
  { name: "საგარეჯო", value: "Sagarejo" },
  { name: "კასპი", value: "Kaspi" },
  { name: "ჭიათურა", value: "Chiatura" },
  { name: "ტყიბული", value: "Tkibuli" },
  { name: "ხონი", value: "Khoni" },
  { name: "წყალტუბო", value: "Tskaltubo" },
  { name: "მესტია", value: "Mestia" },
  { name: "გუდაური", value: "Gudauri" },
  { name: "ხარაგაული", value: "Kharagauli" }
];

function normalizeCity(value) {
  const input = value.trim().toLocaleLowerCase("ka");

  const match = CITIES.find(
    (item) =>
      item.name.toLocaleLowerCase("ka") === input ||
      item.value.toLocaleLowerCase("en") === input
  );

  return match ? match.value : value.trim();
}

function getTemperature(celsius, unit) {
  if (unit === "F") {
    return Math.round((celsius * 9) / 5 + 32);
  }

  return Math.round(celsius);
}

function getWeatherTheme(current) {
  const code = current.condition.code;

  if ([1087, 1273, 1276, 1279, 1282].includes(code)) {
    return "stormy";
  }

  if (
    [
      1066, 1069, 1072, 1114, 1117, 1147, 1168, 1171, 1204, 1207, 1210, 1213,
      1216, 1219, 1222, 1225, 1237, 1255, 1258, 1261, 1264
    ].includes(code)
  ) {
    return "snowy";
  }

  if (
    [
      1063, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1240,
      1243, 1246, 1249, 1252
    ].includes(code)
  ) {
    return "rainy";
  }

  if ([1030, 1135, 1147].includes(code)) {
    return "foggy";
  }

  if (current.is_day !== 1) {
    return "night";
  }

  if ([1006, 1009, 1003].includes(code)) {
    return "cloudy";
  }

  return "sunny";
}

export default function WeatherDashboard({
  city: selectedCity = "Tbilisi",
  unit: selectedUnit = "C"
}) {
  const [city, setCity] = useState(selectedCity);
  const [unit, setUnit] = useState(selectedUnit);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    setCity(selectedCity);
  }, [selectedCity]);

  useEffect(() => {
    setUnit(selectedUnit);
  }, [selectedUnit]);

  useEffect(() => {
    let cancelled = false;

    async function loadWeather() {
      setLoading(true);
      setError("");

      try {
        const data = await getWeather(city, 3);

        if (!cancelled) {
          setWeather(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "ამინდის მონაცემების მიღება ვერ მოხერხდა."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadWeather();

    return () => {
      cancelled = true;
    };
  }, [city, retry]);

  const theme = weather ? getWeatherTheme(weather.current) : "sunny";

  useEffect(() => {
    document.documentElement.dataset.weatherTheme = theme;
  }, [theme]);

  function handleSearch(searchCity) {
    const normalizedCity = normalizeCity(searchCity);

    const foundCity = CITIES.find(
      (item) => item.value.toLowerCase() === normalizedCity.toLowerCase()
    );

    if (!foundCity) {
      setError(
        "ეს ქალაქი სიაში არ არის. აირჩიე საქართველოს მხარდაჭერილი ქალაქი."
      );
      return;
    }

    setError("");
    setCity(foundCity.value);
  }

  const temp = (value) => getTemperature(value, unit);
  const unitLabel = unit === "C" ? "°C" : "°F";

  const cityName = CITIES.find((item) => item.value === city)?.name ?? city;

  if (loading && !weather) {
    return (
      <div className="weather-loading-screen">
        <div className="weather-loader">
          <div className="weather-loader-icon">🌤️</div>
          <div className="weather-spinner" />
          <h2>ამინდი იტვირთება</h2>
          <p>გთხოვ, მოიცადე...</p>
        </div>
      </div>
    );
  }

  if (error && !weather) {
    return (
      <div className="weather-loading-screen">
        <div className="weather-loader">
          <h2>მონაცემების მიღება ვერ მოხერხდა</h2>
          <p role="alert">{error}</p>
          <button type="button" onClick={() => setRetry((value) => value + 1)}>
            ხელახლა ცდა
          </button>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  const { location, current, forecast } = weather;

  const today =
    forecast.forecastday.find(
      (day) => day.date === location.localtime.slice(0, 10)
    ) ?? forecast.forecastday[0];

  const currentHour = Number(location.localtime.slice(11, 13));

  const hourlyForecast = today.hour
    .filter((hour) => Number(hour.time.slice(11, 13)) >= currentHour)
    .filter((_, index) => index % 3 === 0)
    .slice(0, 6);

  return (
    <main className="weather-dashboard">
      {loading && (
        <div className="weather-refresh-overlay">
          <div className="weather-refresh-card">
            <div className="weather-loader-icon">🌤️</div>
            <div className="weather-spinner" />
            <h2>ამინდი ახლდება...</h2>
            <p>{cityName} — ახალი მონაცემების მიღება</p>
          </div>
        </div>
      )}

      <div className="dashboard-heading">
        <div>
          <h1>
            {location.name}, {location.country}
          </h1>
          <p>{location.localtime}</p>
        </div>

        <div className="city-selector">
          <label htmlFor="city-select">აირჩიე ქალაქი</label>

          <select
            id="city-select"
            value={city}
            onChange={(event) => {
              setError("");
              setCity(event.target.value);
            }}
            disabled={loading}
          >
            {CITIES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="weather-error-message" role="alert">
          <p>{error}</p>
          <button type="button" onClick={() => setRetry((value) => value + 1)}>
            ხელახლა ცდა
          </button>
        </div>
      )}

      <section className="current-weather">
        <div className="current-weather-content">
          <div className="current-weather-location">{location.name}</div>

          <div className="current-temperature">
            {temp(current.temp_c)}
            {unit === "C" ? "°C" : "°F"}
          </div>

          <h2>{current.condition.text}</h2>

          <p className="weather-feels-like">
            შეგრძნებით {temp(current.feelslike_c)}
            {unitLabel}
            <span className="weather-dot">•</span>
            ტენიანობა {current.humidity}%
          </p>

          <p className="current-weather-description">
            ქარი: {current.wind_kph} კმ/სთ
          </p>
        </div>

        <div className="weather-illustration">
          <img
            src={`https:${current.condition.icon}`}
            alt={current.condition.text}
            width="100"
            height="100"
          />
        </div>
      </section>

      <section className="forecast-card">
        <div className="forecast-heading">
          <div>
            <h2>საათობრივი პროგნოზი</h2>
            <p>დღევანდელი ამინდი საათების მიხედვით</p>
          </div>
        </div>

        <div className="hourly-list">
          {hourlyForecast.map((hour) => (
            <div className="hourly-item" key={hour.time}>
              <span className="hourly-time">{hour.time.slice(11, 16)}</span>

              <img
                src={`https:${hour.condition.icon}`}
                alt={hour.condition.text}
                width="36"
                height="36"
              />

              <span className="hourly-temp">
                {temp(hour.temp_c)}
                {unit === "C" ? "°C" : "°F"}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="forecast-card weekly-forecast">
        <div className="forecast-heading">
          <div>
            <h2>დღიური პროგნოზი</h2>
            <p>მომდევნო დღეების ამინდი</p>
          </div>
        </div>

        <div className="weekly-list">
          {forecast.forecastday.map((day) => (
            <div className="weekly-row" key={day.date}>
              <span className="weekly-day">{day.date}</span>

              <img
                src={`https:${day.day.condition.icon}`}
                alt={day.day.condition.text}
                width="30"
                height="30"
              />

              <div className="weekly-temperatures">
                <span className="weekly-min">{temp(day.day.mintemp_c)}°</span>

                <span className="weekly-max">{temp(day.day.maxtemp_c)}°</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}