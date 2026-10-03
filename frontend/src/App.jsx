import { useState } from "react";
import "./App.css";

// where my backend is running
const API_URL = "http://127.0.0.1:8000";

function App() {
  // what the user picks
  const [homeSize, setHomeSize] = useState("2-bedroom");
  const [miles, setMiles] = useState("");
  const [packing, setPacking] = useState(false);

  // what we show after clicking the button
  const [estimate, setEstimate] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function getQuote() {
    setError("");
    setEstimate(null);

    // check the input before calling the API
    if (miles === "" || Number(miles) <= 0) {
      setError("Please enter miles greater than 0");
      return;
    }

    setLoading(true);

    try {
      // send the move details to my FastAPI backend
      const response = await fetch(`${API_URL}/quote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          home_size: homeSize,
          miles: Number(miles),
          packing: packing,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setEstimate(data.estimate);
      } else {
        setError("Please check your details and try again.");
      }
    } catch {
      setError("Can't reach the server. Is the backend running?");
    }

    setLoading(false);
  }

  return (
    <div className="page">
      <div className="card">
        <h1>Moving Cost Estimator</h1>
        <p className="subtitle">Get a quick estimate for your move</p>

        <label>Home size</label>
        <select value={homeSize} onChange={(e) => setHomeSize(e.target.value)}>
          <option value="studio">Studio</option>
          <option value="1-bedroom">1 Bedroom</option>
          <option value="2-bedroom">2 Bedroom</option>
          <option value="3-bedroom">3 Bedroom</option>
        </select>

        <label>Distance (miles)</label>
        <input
          type="number"
          placeholder="e.g. 25"
          value={miles}
          onChange={(e) => setMiles(e.target.value)}
        />

        <label className="checkbox">
          <input
            type="checkbox"
            checked={packing}
            onChange={(e) => setPacking(e.target.checked)}
          />
          Add packing service (+30%)
        </label>

        <button onClick={getQuote} disabled={loading}>
          {loading ? "Calculating..." : "Get Estimate"}
        </button>

        {error && <p className="error">{error}</p>}

        {estimate !== null && (
          <div className="result">
            <p>Estimated cost</p>
            <p className="price">
              {estimate.toLocaleString("en-US", { style: "currency", currency: "USD" })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;