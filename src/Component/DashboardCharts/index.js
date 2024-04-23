import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export const options = {
  responsive: true,
  tension: 0.1,
  plugins: {
    legend: false,
    // title: {
    //   display: true,
    //   text: 'Revenue',
    // },
  },
};

const labels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const data = {
  labels,
  datasets: [
    {
      fill: true,
      data: [100, 120, 118, 125, 121, 127, 119, 124, 117, 130, 124, 119].map(
        (elem) => elem
      ),
      backgroundColor: (context) => {
        const bgColor = ["#38d19be0", "#83edd850", "#38d19b99"];
        if (!context.chart.chartArea) {
          return;
        }
        // const chart = context.chart;
        const {
          ctx,
          chartArea: { top, bottom },
        } = context.chart;
        const gradient = ctx.createLinearGradient(0, top, 0, bottom);
        const colorTranches = 1 / (bgColor.length - 1);
        for (let i = 0; i < bgColor.length - 1; i++) {
          gradient.addColorStop(0 + i * colorTranches, bgColor[i]);
        }
        return gradient;
      },
      borderWidth: 0,
      pointRadius: 0,
      pointHitRadius: 0,
      tension: 0.3,
    },
  ],
};

export function CustomLineChart() {
  return <Line options={options} data={data} />;
}
