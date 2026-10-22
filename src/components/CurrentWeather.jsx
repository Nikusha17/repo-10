
import "./CurrentWeather.css";
import { MapPin, Sun, Cloud } from "lucide-react";

export default function CurrentWeather({ unit = "C" }) {
  const temperatureC = 22;

  const temperature =
    unit === "F"
      ? Math.round((temperatureC * 9) / 5 + 32)
      : temperatureC;

  return (
    <section className="current-weather">
      <div className="current-weather-content">
        <div className="current-weather-location">
          <MapPin size={13} />
          <span>ამჟამინდელი ამინდი</span>
        </div>

        <div className="current-temperature">
          {temperature}
          <span>°{unit}</span>
        </div>

        <h2>ნაწილობრივ მოღრუბლული</h2>

        <p className="weather-feels-like">
          შეგრძნებით {unit === "F" ? "21°F" : "21°C"}
          <span className="weather-dot">•</span>
          მაქს. {unit === "F" ? "24°F" : "24°C"}
          <span className="weather-dot">•</span>
          მინ. {unit === "F" ? "15°F" : "15°C"}
        </p>

        <p className="current-weather-description">
          სასიამოვნო ამინდია, ცაზე პერიოდულად ღრუბლები გამოჩნდება.
        </p>
      </div>

      <div
        className="weather-illustration"
        aria-label="მზე და ღრუბლები"
        role="img"
      >
        <div className="weather-sun">
          <Sun size={65} strokeWidth={1.2} />
        </div>

        <div className="weather-cloud weather-cloud-back">
          <Cloud size={76} strokeWidth={1.1} />
        </div>

        <div className="weather-cloud weather-cloud-front">
          <Cloud size={100} strokeWidth={1.1} />
        </div>

        <span className="weather-condition-badge">
          ნაწილობრივ მოღრუბლული
        </span>
      </div>
    </section>
  );
}
