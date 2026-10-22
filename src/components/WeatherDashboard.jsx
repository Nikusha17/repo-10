
import "./WeatherDashboard.css";
import CurrentWeather from "./CurrentWeather";
import Forecast from "./Forecast";
import {
  Droplets,
  Wind,
  Sun,
  Eye,
  Gauge,
  Sunrise,
  Compass,
} from "lucide-react";

const metrics = [
  {
    title: "ჰაერის ხარისხი",
    value: "32",
    unit: "AQI",
    description: "კარგი ხარისხის ჰაერი",
    icon: Wind,
    color: "#63B99A",
  },
  {
    title: "ულტრაიისფერი ინდექსი",
    value: "3",
    unit: "",
    description: "ზომიერი ინტენსივობა",
    icon: Sun,
    color: "#69A9DC",
  },
  {
    title: "ქარის სიჩქარე",
    value: "12",
    unit: "კმ/სთ",
    description: "ჩრდილო-დასავლეთის ქარი",
    icon: Compass,
    color: "#398BD5",
  },
  {
    title: "ტენიანობა",
    value: "64",
    unit: "%",
    description: "ჰაერის ტენიანობა",
    icon: Droplets,
    color: "#398BD5",
  },
  {
    title: "მზის ამოსვლა და ჩასვლა",
    value: "07:29",
    unit: "18:20",
    description: "ამოსვლა / ჩასვლა",
    icon: Sunrise,
    color: "#E9B44C",
  },
  {
    title: "ხილვადობა და წნევა",
    value: "10",
    unit: "კმ",
    secondValue: "1016",
    secondUnit: "ჰპა",
    description: "ატმოსფერული მონაცემები",
    icon: Eye,
    secondIcon: Gauge,
    color: "#398BD5",
  },
];

export default function WeatherDashboard({
  city = "თბილისი, საქართველო",
  unit = "C",
}) {
  const currentTime = new Intl.DateTimeFormat("ka-GE", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());

  const currentDate = new Intl.DateTimeFormat("ka-GE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <main className="weather-dashboard">
      <section className="dashboard-heading">
        <div>
          <h1>{city}</h1>
          <p>{currentDate}</p>
        </div>

        <div className="dashboard-clock">
          <time>{currentTime}</time>
          <span>ადგილობრივი დრო</span>
        </div>
      </section>

      <section className="weather-overview">
        <div className="weather-main-column">
          <CurrentWeather unit={unit} />
          <Forecast type="hourly" unit={unit} />
        </div>

        <aside className="weather-side-column">
          <Forecast type="weekly" unit={unit} />
        </aside>
      </section>

      <section className="weather-metrics-section">
        <div className="metrics-heading">
          <h2>დამატებითი მონაცემები</h2>
          <span>ამინდის დეტალები</span>
        </div>

        <div className="weather-metrics-grid">
          {metrics.map((metric) => {
            const Icon = metric.icon;

            return (
              <article
                className="weather-metric-card"
                key={metric.title}
              >
                <div className="metric-title">
                  <Icon
                    size={16}
                    color={metric.color}
                    strokeWidth={2}
                  />
                  <h3>{metric.title}</h3>
                </div>

                <div className="metric-values">
                  <div className="metric-primary">
                    <strong>{metric.value}</strong>
                    {metric.unit && (
                      <span>{metric.unit}</span>
                    )}
                  </div>

                  {metric.secondValue && (
                    <div className="metric-secondary">
                      <strong>{metric.secondValue}</strong>
                      <span>{metric.secondUnit}</span>
                    </div>
                  )}
                </div>

                <p>{metric.description}</p>

                {metric.title === "ჰაერის ხარისხი" && (
                  <div
                    className="air-quality-bar"
                    aria-label="ჰაერის ხარისხის ინდიკატორი"
                  >
                    <span />
                  </div>
                )}

                {metric.title === "ტენიანობა" && (
                  <div
                    className="humidity-bar"
                    role="progressbar"
                    aria-label="ტენიანობა"
                    aria-valuenow={64}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <span style={{ width: "64%" }} />
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
