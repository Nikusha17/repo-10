
import { useState } from "react";

import Header from "./components/Header";
import WeatherDashboard from "./components/WeatherDashboard";
import Footer from "./components/Footer";

import "./index.css";

function App() {
  const [unit, setUnit] = useState("C");
  const [city, setCity] = useState("Tbilisi");

  return (
    <>
      <Header
        onSearch={setCity}
        onUnitChange={setUnit}
      />

      <WeatherDashboard
        city={city}
        unit={unit}
      />

      <Footer />
    </>
  );
}

export default App;
