"use client";
import React from "react";
import { Line } from "react-chartjs-2";
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
  maintainAspectRatio: false,
  tension: 0.2,
  plugins: {
    legend: false,
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        display: false,
      },
      ticks: {
        stepSize: 5,
        suggestedMin: 0,
        suggestedMax: 50,
      },
    },
  },
};

// const labels = ["May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
// export const data = {
//   labels: [],
//   datasets: [
//     {
//       fill: true,
//       data: [27, 12, 24, 27, 11, 30, 24, 11].map((elem) => elem),
//       borderColor: "#06856C",
//       backgroundColor: "#06856C12",
//       borderWidth: 2,
//       pointRadius: 6,
//       pointHitRadius: 10,
//       pointBackgroundColor: "#ffff",
//       tension: 0.2,
//       pointBackgroundColor: labels.map((elem) => "#fff"),
//     },
//   ],
// };
const LineChart = ({ graphData, filter }) => {
  let transformedData;
  if (filter === "month") {
    transformedData = graphData.map((item) => {
      const date = new Date(0, item.date - 1);
      const options = { month: "short" };
      const month = date.toLocaleString("en-US", options);
      return { date: month, uploadCount: item.uploadCount };
    });
  } else {
    transformedData = graphData;
  }

  const dataCount = transformedData?.map((elem) => elem?.uploadCount);
  const labels = transformedData?.map((elem) => elem?.date);

  let data = {
    labels,
    datasets: [
      {
        fill: true,
        data: dataCount.map((elem) => elem),
        borderColor: "#06856C",
        backgroundColor: "#06856C12",
        borderWidth: 2,
        pointRadius: 6,
        pointHitRadius: 10,
        pointBackgroundColor: "#ffff",
        tension: 0.2,
        pointBackgroundColor: labels.map((elem) => "#fff"),
      },
    ],
  };

  return <Line options={options} data={data} />;
};

export default LineChart;
