
import "./Forecast.css";
import {
  Sun,
  Cloud,
  CloudSun,
  CloudRain,
  CloudSnow,
  Moon,
} from "lucide-react";

const hourlyForecast = [
  { time: "ახლა", temp: 22, icon: "sun" },
  { time: "17:00", temp: 23, icon: "cloudSun" },
  { time: "18:00", temp: 21, icon: "cloudSun" },
  { time: "19:00", temp: 19, icon: "cloud" },
  { time: "20:00", temp: 17, icon: "moon" },
  { time: "21:00", temp: 16, icon: "moon" },
];

const weeklyForecast = [
  { day: "ორშაბათი", min: 15, max: 24, icon: "sun" },
  { day: "სამშაბათი", min: 16, max: 23, icon: "cloudSun" },
  { day: "ოთხშაბათი", min: 14, max: 20, icon: "cloudRain" },
  { day: "ხუთშაბათი", min: 13, max: 19, icon: "cloud" },
  { day: "პარასკევი", min: 15, max: 22, icon: "sun" },
  { day: "შაბათი", min: 17, max: 25, icon: "cloudSun" },
  { day: "კვირა", min: 16, max: 24, icon: "sun" },
];

const weatherIcons = {
  sun: Sun,
  cloud: Cloud,
  cloudSun: CloudSun,
  cloudRain: CloudRain,
  cloudSnow: CloudSnow,
  moon: Moon,
};

function convertTemperature(temp, unit) {
  return unit === "F"
    ? Math.round((temp * 9) / 5 + 32)
    : temp;
}

function WeatherIcon({ type, size = 22 }) {
  const Icon = weatherIcons[type] || CloudSun;

  return (
    <Icon
      size={size}
      strokeWidth={1.7}
      className={`forecast-icon forecast-icon-${type}`}
      aria-hidden="true"
    />
  );
}

export default function Forecast({
  type = "hourly",
  unit = "C",
}) {
  if (type === "weekly") {
    return (
      <section className="forecast-card weekly-forecast">
        <div className="forecast-heading">
          <div>
            <h2>7 დღის პროგნოზი</h2>
            <p>ამინდი მთელი კვირის განმავლობაში</p>
          </div>
        </div>

        <div className="weekly-list">
          {weeklyForecast.map((day) => (
            <div className="weekly-row" key={day.day}>
              <span className="weekly-day">{day.day}</span>

              <WeatherIcon type={day.icon} size={21} />

              <div className="weekly-temperatures">
                <span className="weekly-min">
                  {convertTemperature(day.min, unit)}°
                </span>

                <div className="weekly-temperature-bar">
                  <span />
                </div>

                <span className="weekly-max">
                  {convertTemperature(day.max, unit)}°
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="forecast-card hourly-forecast">
      <div className="forecast-heading">
        <div>
          <h2>საათობრივი პროგნოზი</h2>
          <p>ამინდის ცვლილება დღის განმავლობაში</p>
        </div>
      </div>

      <div className="hourly-list">
        {hourlyForecast.map((hour) => (
          <div className="hourly-item" key={hour.time}>
            <span className="hourly-time">{hour.time}</span>

            <WeatherIcon type={hour.icon} size={23} />

            <span className="hourly-temp">
              {convertTemperature(hour.temp, unit)}°
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
