import { useEffect } from "react";
import Chart from "chart.js/auto";
import { useRef } from "react";

// Import style
import "../../scss/styles.scss"

export default function Graph({ graphStats }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: [
          "Leden",
          "Únor",
          "Březen",
          "Duben",
          "Květen",
          "Červen",
          "Červenec",
          "Srpen",
          "Září",
          "Říjen",
          "Listopad",
          "Prosinec",
        ],
        datasets: [
          {
            label: "Zisk (Kč)",
            data: graphStats,
            backgroundColor: "#23c86c",
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return value.toLocaleString("cs-CZ") + " Kč";
              },
            },
          },
          x: {
            categoryPercentage: 1.0,
            barPercentage: 0.9,
          },
        },
      },
    });
  }, []);

  return (
    <>
      <div className="graph">
        <canvas ref={chartRef}></canvas>
      </div>
    </>
  );
}
