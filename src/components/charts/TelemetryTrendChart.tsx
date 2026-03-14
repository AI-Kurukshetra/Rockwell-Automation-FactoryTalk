"use client";

import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

import { ChartCard } from "@/components/charts/ChartCard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
);

type TelemetryTrendChartProps = {
  labels: string[];
  values: number[];
};

export function TelemetryTrendChart({
  labels,
  values,
}: TelemetryTrendChartProps) {
  const data = {
    labels,
    datasets: [
      {
        label: "Readings",
        data: values,
        borderColor: "#6366f1",
        backgroundColor: "rgba(99,102,241,0.2)",
        tension: 0.35,
        fill: true,
      },
    ],
  };

  return (
    <ChartCard title="Telemetry" subtitle="Last 12 hours">
      <Line
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            x: { grid: { display: false } },
            y: {
              grid: { color: "rgba(148,163,184,0.2)" },
              ticks: { precision: 0 },
            },
          },
        }}
      />
    </ChartCard>
  );
}
