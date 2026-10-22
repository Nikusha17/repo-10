
import { useState } from "react";
import {
  Sun,
  Search,
  MapPin,
  Settings2,
  UserRound,
} from "lucide-react";
import "./Header.css";

export default function Header({
  onSearch,
  onUnitChange,
}) {
  const [city, setCity] = useState("");
  const [unit, setUnit] = useState("C");

  function handleSearch(event) {
    event.preventDefault();

    const value = city.trim();

    if (value && onSearch) {
      onSearch(value);
    }
  }

  function handleUnitChange(value) {
    setUnit(value);
    onUnitChange?.(value);
  }

  return (
    <header className="app-header">
      <a className="header-brand" href="/" aria-label="მთავარი">
        <span className="brand-icon">
          <Sun size={19} strokeWidth={2} />
        </span>

        <span className="brand-name">ამინდი</span>
      </a>

      <form
        className="header-search"
        onSubmit={handleSearch}
      >
        <Search size={16} className="search-icon" />

        <input
          type="search"
          placeholder="მოძებნე ქალაქი ან რეგიონი"
          value={city}
          onChange={(event) => setCity(event.target.value)}
          aria-label="ქალაქის ძიება"
        />

        <button
          type="submit"
          className="search-location"
          aria-label="მოძებნა"
        >
          <MapPin size={15} />
        </button>
      </form>

      <div className="header-actions">
        <div
          className="unit-switch"
          aria-label="ტემპერატურის ერთეული"
        >
          <button
            type="button"
            className={unit === "C" ? "active" : ""}
            onClick={() => handleUnitChange("C")}
            aria-pressed={unit === "C"}
          >
            °C
          </button>

          <button
            type="button"
            className={unit === "F" ? "active" : ""}
            onClick={() => handleUnitChange("F")}
            aria-pressed={unit === "F"}
          >
            °F
          </button>
        </div>

        <button
          type="button"
          className="header-icon-button"
          aria-label="პარამეტრები"
        >
          <Settings2 size={17} />
        </button>

        <button
          type="button"
          className="header-icon-button"
          aria-label="მომხმარებლის პროფილი"
        >
          <UserRound size={17} />
        </button>
      </div>
    </header>
  );
}
