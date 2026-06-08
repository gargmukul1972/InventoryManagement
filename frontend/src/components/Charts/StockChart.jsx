import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

function StockChart({ products }) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  useEffect(() => {
    const handleThemeChange = (e) => {
      setIsDark(e.detail === "dark");
    };
    window.addEventListener("themechange", handleThemeChange);
    return () => window.removeEventListener("themechange", handleThemeChange);
  }, []);

  const barColor = isDark ? "rgba(99, 102, 241, 0.85)" : "rgba(79, 70, 229, 0.85)";
  const hoverBarColor = isDark ? "#6366f1" : "#4f46e5";
  const gridColor = isDark ? "rgba(34, 47, 71, 0.6)" : "rgba(226, 232, 240, 0.8)";
  const textColor = isDark ? "#cbd5e1" : "#475569";

  const data = {
    labels: products.map(p => p.name),
    datasets: [
      {
        label: "Stock Quantity",
        data: products.map(p => p.quantity),
        backgroundColor: barColor,
        hoverBackgroundColor: hoverBarColor,
        borderRadius: 6,
        borderSkipped: false
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false // Hide since it's only one dataset and label is self-explanatory
      },
      tooltip: {
        backgroundColor: isDark ? "#1e293b" : "#ffffff",
        titleColor: isDark ? "#f8fafc" : "#0f172a",
        bodyColor: isDark ? "#cbd5e1" : "#334155",
        borderColor: isDark ? "#222f47" : "#e2e8f0",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          family: "Outfit, sans-serif",
          weight: "600",
          size: 13
        },
        bodyFont: {
          family: "Inter, sans-serif",
          size: 12
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: textColor,
          font: {
            family: "Inter, sans-serif",
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: gridColor
        },
        ticks: {
          color: textColor,
          font: {
            family: "Inter, sans-serif",
            size: 11
          }
        }
      }
    }
  };

  return (
    <div className="chart-card">
      <h3 className="chart-title">Stock Levels Overview</h3>
      <div className="chart-wrapper">
        {products.length === 0 ? (
          <div className="chart-placeholder">No inventory data available</div>
        ) : (
          <Bar data={data} options={options} />
        )}
      </div>
    </div>
  );
}

export default StockChart;