import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import dayjs from 'dayjs'; // To handle dates

// Register chart.js components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = () => {
  const [days, setDays] = useState([]);

  // Generate past 10 days
  useEffect(() => {
    const past10Days = [];
    for (let i = 0; i < 10; i++) {
      past10Days.push(dayjs().subtract(i, 'day').format('MMM DD')); // E.g., 'Oct 13, 2024'
    }
    setDays(past10Days.reverse()); // Reversed to show the latest day first
  }, []);

  // Data for the chart
  const data = {
    labels: days, // X-axis labels for the past 10 days
    datasets: [
      {
        // label: 'Hourly Data', // General label for the line (you can add more datasets if needed)
        data: Array(10).fill().map(() => Math.floor(Math.random() * 12)), // Random hour data (replace with actual data)
        borderColor: '#f59e0b',
        backgroundColor: 'transparent',
        pointBorderColor: '#f59e0b',
        pointBackgroundColor: '#f59e0b',
        fill: false, // No fill under the line
        tension: 0.4, // For smooth lines
      },
    ],
  };

  // Options for the chart
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Hourly Data for the Past 10 Days',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Past 10 Days',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Hours of the Day (0 - 12)',
        },
        min: 0, // Start Y-axis at 0
        max: 12, // End Y-axis at 12
        ticks: {
          stepSize: 1, // Increment the Y-axis by 1
        },
      },
    },
  };

  return (
    <div className="w-full h-full flex justify-center items-center p-4">
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
