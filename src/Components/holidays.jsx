import { useState } from "react";

export default function Holidays() {
  const [countryCode, setCountryCode] = useState("FR");
  const [year, setYear] = useState("");
  const [holidays, setHolidays] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  function validateInputs(countryCode, year) {
    const trimmedCountry = countryCode.trim().toUpperCase();
    const yearNum = Number(year);

    if (!/^[A-Z]{2}$/.test(trimmedCountry)) {
      return "Country code must be exactly 2 letters (example: US).";
    }

    if (!Number.isInteger(yearNum) || yearNum < 1900 || yearNum > 2100) {
      return "Year must be a valid 4-digit year.";
    }

    return "";
  }

  async function grabData() {
    try {
      setLoading(true);

      const url = `https://openholidaysapi.org/PublicHolidays?countryIsoCode=${countryCode.trim().toUpperCase()}&validFrom=${year}-01-01&validTo=${year}-12-31&languageIsoCode=EN`;
      const response = await fetch(url);
      console.log(response);

      if (!response.ok) {
        const err = await response.json();
        console.log("API error", err);
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = await response.json();

      console.log(data)
      setHolidays(Array.isArray(data) ? data : []);
      setErrorMsg("");
    } catch (e) {
      setHolidays([]);
      setErrorMsg(e.message || "failed to fetch your holidays data!!");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const validationError = validateInputs(countryCode, year);
    if (validationError) {
      setErrorMsg(validationError);
      setHolidays([]);
      return;
    }

    await grabData();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex flex-col items-center px-4 py-16">
      
      <h1 className="text-4xl font-extrabold text-gray-800 mb-10 text-center">
        🌍 Project Public Holidays
      </h1>

      <div className="w-full max-w-xl bg-white/70 backdrop-blur-lg shadow-2xl rounded-2xl p-8 border border-white/40">

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
        >
         
          <div className="flex flex-col gap-2">
            <label htmlFor="country" className="text-sm font-semibold text-gray-700">
              Country Code
            </label>
            <input
              id="country"
              type="text"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
              placeholder="e.g. BR"
              className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
            />
          </div>

        
          <div className="flex flex-col gap-2">
            <label htmlFor="year" className="text-sm font-semibold text-gray-700">
              Year
            </label>
            <input
              id="year"
              type="number"
              min="1900"
              max="2100"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="2025"
              className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg hover:scale-[1.02] hover:shadow-xl transition-all duration-200 disabled:opacity-60"
          >
            {loading ? "Loading..." : "Fetch Holidays"}
          </button>
        </form>

  
        {errorMsg && (
          <div className="mt-6 p-3 rounded-lg bg-red-100 text-red-700 text-center text-sm font-medium">
            {errorMsg}
          </div>
        )}

        {!loading && !errorMsg && holidays.length === 0 && (
          <p className="mt-6 text-center text-gray-500 text-sm">
            No holidays found for that country/year.
          </p>
        )}

       
        {holidays.length > 0 && (
          <div className="mt-8 space-y-3 max-h-80 overflow-y-auto pr-2">
            {holidays.map((item, index) => (
              <div
                key={item.id || `${item.startDate}-${index}`}
                className="p-4 rounded-xl bg-white shadow-md border border-gray-100 hover:shadow-lg transition-all"
              >
                <p className="font-semibold text-gray-800">
                  {item.name?.[0].text || "Holiday"}
                </p>
                <p className="text-sm text-gray-500">
                  {item.startDate}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}