import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function CategoryChart({ products }) {
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

  const categories = {};
  products.forEach(product => {
    categories[product.category] = (categories[product.category] || 0) + 1;
  });

  const chartColors = [
    "#6366f1", // Indigo
    "#10b981", // Emerald
    "#8b5cf6", // Violet
    "#f59e0b", // Amber
    "#3b82f6", // Blue
    "#ef4444", // Rose
    "#06b6d4", // Cyan
    "#ec4899"  // Pink
  ];

  const chartBorderColor = isDark ? "#151c2c" : "#ffffff";
  const labels = Object.keys(categories);

  const data = {
    labels: labels,
    datasets: [
      {
        data: Object.values(categories),
        backgroundColor: chartColors.slice(0, labels.length),
        borderColor: chartBorderColor,
        borderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: isDark ? "#cbd5e1" : "#475569",
          padding: 20,
          font: {
            family: "Inter, sans-serif",
            size: 12,
            weight: "500"
          }
        }
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
    }
  };

  return (
    <div className="chart-card">
      <h3 className="chart-title">Products By Category</h3>
      <div className="chart-wrapper">
        {products.length === 0 ? (
          <div className="chart-placeholder">No inventory data available</div>
        ) : (
          <Pie data={data} options={options} />
        )}
      </div>
    </div>
  );
}

export default CategoryChart;