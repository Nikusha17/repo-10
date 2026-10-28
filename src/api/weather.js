const API_KEY = "d645a70618364010aef62342262110";
const BASE_URL = "https://api.weatherapi.com/v1";

const GEORGIAN_CITIES = {
  თბილისი: "Tbilisi",
  ბათუმი: "Batumi",
  ქუთაისი: "Kutaisi",
  რუსთავი: "Rustavi",
  გორი: "Gori",
  ზუგდიდი: "Zugdidi",
  ფოთი: "Poti",
  თელავი: "Telavi",
  ახალციხე: "Akhaltsikhe",
  ოზურგეთი: "Ozurgeti",
  სამტრედია: "Samtredia",
  სენაკი: "Senaki",
  ზესტაფონი: "Zestafoni",
  ხაშური: "Khashuri",
  ბორჯომი: "Borjomi",
  მარნეული: "Marneuli",
  ქობულეთი: "Kobuleti",
  ამბროლაური: "Ambrolauri",
  ონი: "Oni",
  ლაგოდეხი: "Lagodekhi",
  გურჯაანი: "Gurjaani",
  ყვარელი: "Kvareli",
  საგარეჯო: "Sagarejo",
  კასპი: "Kaspi",
  ჭიათურა: "Chiatura",
  ტყიბული: "Tkibuli",
  ხონი: "Khoni",
  წყალტუბო: "Tskaltubo",
  მესტია: "Mestia",
  გუდაური: "Gudauri",
  ხარაგაული: "Kharagauli",
};

async function fetchWeatherApi(endpoint, params = {}) {
  if (!API_KEY) {
    throw new Error("API გასაღები ვერ მოიძებნა. შეამოწმე .env ფაილი.");
  }

  const query = new URLSearchParams({
    key: API_KEY,
    ...params,
  });

  const response = await fetch(`${BASE_URL}/${endpoint}?${query}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error?.message || "ამინდის მონაცემების მიღება ვერ მოხერხდა.",
    );
  }

  return data;
}

export async function getWeather(city, days = 3) {
  const input = String(city).trim();

  if (!input) {
    throw new Error("გთხოვ, შეიყვანე ქალაქის სახელი.");
  }

  const normalizedInput = GEORGIAN_CITIES[input] || input;

  // საქართველოს ქალაქებს პირდაპირ საქართველოს კონტექსტში ვეძებთ.
  const isGeorgianCity =
    Object.values(GEORGIAN_CITIES).some(
      (name) => name.toLowerCase() === normalizedInput.toLowerCase(),
    ) || Object.keys(GEORGIAN_CITIES).includes(input);

  const searchQuery = isGeorgianCity
    ? `${normalizedInput}, Georgia`
    : normalizedInput;

  const data = await fetchWeatherApi("forecast.json", {
    q: searchQuery,
    days: String(days),
    aqi: "no",
    alerts: "no",
    lang: "ka",
  });

  // არასწორი ქვეყნის შედეგი არ დავაბრუნოთ საქართველოს ქალაქისთვის.
  if (isGeorgianCity && data.location.country !== "Georgia") {
    throw new Error(
      "მოიძებნა არასწორი ქვეყანა. სცადე ქალაქის სახელის ხელახლა შეყვანა.",
    );
  }

  return data;
}
