import { useState } from "react";
import { Sun, Search, MapPin, Settings2, UserRound } from "lucide-react";
import "./Header.css";

export default function Header({ onSearch, onUnitChange, unit = "C" }) {
  const [city, setCity] = useState("");

  function handleSearch(event) {
    event.preventDefault();

    const value = city.trim();

    if (value && typeof onSearch === "function") {
      onSearch(value);
      setCity("");
    }
  }

  return (
    <header className="app-header">
      <a className="header-brand" href="/" aria-label="მთავარი">
        <span className="brand-icon">
          <Sun size={20} strokeWidth={2} />
        </span>
        <span className="brand-name">ამინდი</span>
      </a>

      <form className="header-search" onSubmit={handleSearch}>
        <Search size={17} className="search-icon" />

        <input
          type="search"
          placeholder="მოძებნე საქართველოს ქალაქი"
          value={city}
          onChange={(event) => setCity(event.target.value)}
          aria-label="ქალაქის ძიება"
        />

        <button type="submit" className="search-location" aria-label="მოძებნა">
          <MapPin size={16} />
        </button>
      </form>

      <div className="header-actions">
        <div className="unit-switch" aria-label="ტემპერატურის ერთეული">
          <button
            type="button"
            className={unit === "C" ? "active" : ""}
            onClick={() => onUnitChange?.("C")}
            aria-pressed={unit === "C"}
          >
            °C
          </button>

          <button
            type="button"
            className={unit === "F" ? "active" : ""}
            onClick={() => onUnitChange?.("F")}
            aria-pressed={unit === "F"}
          >
            °F
          </button>
        </div>

        <button
          type="button"
          className="header-icon-button"
          aria-label="პარამეტრები"
          onClick={() => window.alert("პარამეტრები")}
        >
          <Settings2 size={18} />
        </button>

        <button
          type="button"
          className="header-icon-button"
          aria-label="მომხმარებლის პროფილი"
          onClick={() => window.alert("მომხმარებლის პროფილი")}
        >
          <UserRound size={18} />
        </button>
      </div>
    </header>
  );
}
