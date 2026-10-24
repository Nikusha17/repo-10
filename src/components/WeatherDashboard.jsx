import { useEffect, useState } from "react";
import { getWeather } from "../api/weather";
import "./WeatherDashboard.css";

// ამინდის მიხედვით ფერების თემის არჩევა
function getWeatherTheme(current) {
  const code = current.condition.code;
  const isDay = current.is_day === 1;

  // ჭექა-ქუხილი
  if ([1087, 1273, 1276, 1279, 1282].includes(code)) {
    return "stormy";
  }

  // თოვლი და ყინული
  if (
    [
      1066, 1069, 1072, 1114, 1117, 1147, 1168, 1171, 1204, 1207, 1210, 1213,
      1216, 1219, 1222, 1225, 1237, 1255, 1258, 1261, 1264,
    ].includes(code)
  ) {
    return "snowy";
  }

  // წვიმა და ნალექი
  if (
    [
      1063, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1240,
      1243, 1246, 1249, 1252,
    ].includes(code)
  ) {
    return "rainy";
  }

  // ნისლი
  if ([1030, 1135, 1147].includes(code)) {
    return "foggy";
  }

  // ღამე
  if (!isDay) {
    return "night";
  }

  // მოღრუბლული
  if ([1006, 1009].includes(code)) {
    return "cloudy";
  }

  // მზიანი ან ნაწილობრივ მოღრუბლული
  return "sunny";
}

export default function WeatherDashboard() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("Tbilisi");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  // ამინდის მონაცემების წამოღება
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
              : "ამინდის მონაცემების მიღება ვერ მოხერხდა.",
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

  // თემის განსაზღვრა მიღებული ამინდის მიხედვით
  const theme = weather ? getWeatherTheme(weather.current) : "sunny";

  // თემის მიბმა მთელ საიტზე
  useEffect(() => {
    document.documentElement.dataset.weatherTheme = theme;

    return () => {
      delete document.documentElement.dataset.weatherTheme;
    };
  }, [theme]);

  // საწყისი ჩატვირთვის ლოუდერი
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

  // შეცდომის შეტყობინება და ხელახლა ცდა
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

  // ქალაქის ქართული სახელწოდება
  const cityNames = {
    Tbilisi: "თბილისი",
    Batumi: "ბათუმი",
    Kutaisi: "ქუთაისი",
    Kharagauli: "ხარაგაული",
  };

  // საათობრივი პროგნოზი
  const currentHour = Number(location.localtime.slice(11, 13));

  const hourlyForecast = (
    forecast.forecastday.find(
      (day) => day.date === location.localtime.slice(0, 10),
    ) ?? forecast.forecastday[0]
  ).hour
    .filter((hour) => {
      const hourTime = Number(hour.time.slice(11, 13));
      return hourTime >= currentHour;
    })
    .filter((_, index) => index % 3 === 0)
    .slice(0, 6);

  return (
    <main className="weather-dashboard">
      {/* ქალაქის შეცვლისას ლოუდერი */}
      {loading && (
        <div className="weather-refresh-overlay">
          <div className="weather-refresh-card">
            <div className="weather-loader-icon">🌤️</div>
            <div className="weather-spinner" />
            <h2>ამინდი ახლდება...</h2>
            <p>{cityNames[city] ?? city} — ახალი მონაცემების მიღება</p>
          </div>
        </div>
      )}

      {/* სათაური და ქალაქის არჩევა */}
      <div className="dashboard-heading">
        <div>
          <h1>
            {location.name}, {location.country}
          </h1>
          <p>{location.localtime}</p>
        </div>

        <select
          value={city}
          onChange={(event) => setCity(event.target.value)}
          aria-label="აირჩიე ქალაქი"
          disabled={loading}
        >
          <option value="Tbilisi">თბილისი</option>
          <option value="Batumi">ბათუმი</option>
          <option value="Kutaisi">ქუთაისი</option>
          <option value="Kharagauli">ხარაგაული</option>
        </select>
      </div>

      {/* მიმდინარე ამინდი */}
      <section className="current-weather">
        <div className="current-weather-content">
          <div className="current-weather-location">{location.name}</div>

          <div className="current-temperature">
            {Math.round(current.temp_c)}°
          </div>

          <h2>{current.condition.text}</h2>

          <p className="weather-feels-like">
            შეგრძნებით {Math.round(current.feelslike_c)}°C
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

      {/* საათობრივი პროგნოზი */}
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

              <span className="hourly-temp">{Math.round(hour.temp_c)}°</span>
            </div>
          ))}
        </div>
      </section>

      {/* დღიური პროგნოზი */}
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
                <span className="weekly-min">
                  {Math.round(day.day.mintemp_c)}°
                </span>

                <span className="weekly-max">
                  {Math.round(day.day.maxtemp_c)}°
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
