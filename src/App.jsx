import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

function App() {
  const [length, setLength] = useState("");
  const [load, setLoad] = useState("");
  const [position, setPosition] = useState("");
  const [chartData, setChartData] = useState(null);
  const [maxShearForce, setMaxShearForce] = useState(null);
  const [maxBendingMoment, setMaxBendingMoment] = useState(null);
  const [error, setError] = useState("");

  const calculateSFD_BMD = () => {
    setError("");

    const L = parseFloat(length);
    const P = parseFloat(load);
    const a = parseFloat(position);

    if (isNaN(L) || isNaN(P) || isNaN(a) || L <= 0 || P <= 0 || a < 0 || a > L) {
      setError("Invalid input! Ensure L > 0, P > 0, and 0 ≤ a ≤ L.");
      return;
    }

    // Calculate reactions at supports
    const Rb = (P * a) / L;
    const Ra = P - Rb;

    // Define x-axis points
    const x = Array.from({ length: 100 }, (_, i) => (L / 99) * i);

    // Shear Force Calculation
    const V = x.map((xi) => (xi < a ? Ra : Ra - P));

    // Bending Moment Calculation
    const M = x.map((xi) => (xi < a ? Ra * xi : Ra * xi - P * (xi - a)));

    // Get max absolute values
    const maxSF = Math.max(...V.map(Math.abs));
    const maxBM = Math.max(...M.map(Math.abs));

    setMaxShearForce(maxSF.toFixed(2));
    setMaxBendingMoment(maxBM.toFixed(2));

    // Update chart data
    setChartData({
      labels: x.map((xi) => xi.toFixed(2)),
      datasets: [
        {
          label: "Shear Force (N)",
          data: V,
          borderColor: "blue",
          borderWidth: 3,
          fill: true,
          backgroundColor: "rgba(0, 0, 255, 0.3)",
        },
        {
          label: "Bending Moment (Nm)",
          data: M,
          borderColor: "red",
          borderWidth: 3,
          fill: true,
          backgroundColor: "rgba(255, 0, 0, 0.3)",
        },
      ],
    });
  };

  return (
    <div style={{ textAlign: "center", padding: "20px", fontFamily: "Arial, sans-serif", backgroundColor: "#f0f8ff", minHeight: "100vh" }}>
      <h2 style={{ color: "#333", fontSize: "28px", fontWeight: "bold" }}>📊 SFD & BMD Calculator</h2>
      
      {/* Problem Statement as Subheading */}
      <h4 style={{ color: "#555", fontSize: "18px", marginTop: "5px", fontStyle: "italic" }}>
        Problem: Analyze the Shear Force Diagram (SFD) and Bending Moment Diagram (BMD) for a Simply Supported Beam subjected to a Single Point Load.
      </h4>

      <div style={{ width: "90%", maxWidth: "500px", margin: "20px auto", padding: "20px", background: "white", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)" }}>
        <input
          type="number"
          placeholder="Beam Length (m)"
          value={length}
          onChange={(e) => setLength(e.target.value)}
          required
          style={{ margin: "10px", padding: "12px", width: "90%", borderRadius: "5px", border: "1px solid #ccc", fontSize: "16px" }}
        />
        <input
          type="number"
          placeholder="Point Load (N)"
          value={load}
          onChange={(e) => setLoad(e.target.value)}
          required
          style={{ margin: "10px", padding: "12px", width: "90%", borderRadius: "5px", border: "1px solid #ccc", fontSize: "16px" }}
        />
        <input
          type="number"
          placeholder="Load Position (m)"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          required
          style={{ margin: "10px", padding: "12px", width: "90%", borderRadius: "5px", border: "1px solid #ccc", fontSize: "16px" }}
        />
        <button
          onClick={calculateSFD_BMD}
          style={{
            margin: "10px",
            padding: "12px",
            width: "95%",
            fontSize: "18px",
            backgroundColor: "#007ACC",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
            fontWeight: "bold",
          }}
        >
          🚀 Calculate SFD & BMD
        </button>
      </div>

      {error && <p style={{ color: "red", fontWeight: "bold", fontSize: "16px" }}>{error}</p>}

      {chartData && (
        <div style={{ width: "95%", maxWidth: "900px", margin: "auto", padding: "20px", backgroundColor: "white", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)" }}>
          <h3 style={{ color: "#333" }}>Shear Force & Bending Moment Graphs</h3>
          <div style={{ width: "100%", height: "450px" }}>
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: "Beam Length (m)",
                      font: {
                        size: 16,
                        weight: "bold",
                      },
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: "Force (N) / Moment (Nm)",
                      font: {
                        size: 16,
                        weight: "bold",
                      },
                    },
                  },
                },
              }}
            />
          </div>

          <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#f4f4f4", borderRadius: "8px" }}>
            <h4 style={{ color: "black", fontSize: "18px", fontWeight: "bold" }}>📌 Maximum Readings:</h4>
            <p style={{ fontSize: "18px", color: "blue" }}>🔹 Maximum Shear Force: <b>{maxShearForce} N</b></p>
            <p style={{ fontSize: "18px", color: "red" }}>🔹 Maximum Bending Moment: <b>{maxBendingMoment} Nm</b></p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
