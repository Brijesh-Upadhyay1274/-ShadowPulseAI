import React from 'react';
import { Line } from 'react-chartjs-2';

const TrafficLine: React.FC = () => {
  // Mock data for 24 hours
  const labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  const trafficData = labels.map(() => Math.floor(Math.random() * 500) + 200);
  // Add a spike
  trafficData[14] = 1200;
  trafficData[15] = 950;
  
  const baselineData = labels.map(() => 400);

  const data = {
    labels,
    datasets: [
      {
        label: 'Current Traffic (GB)',
        data: trafficData,
        borderColor: '#F97316',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHitRadius: 10,
      },
      {
        label: 'Baseline',
        data: baselineData,
        borderColor: 'rgba(148, 163, 184, 0.5)',
        borderWidth: 1,
        borderDash: [5, 5],
        fill: false,
        pointRadius: 0,
      }
    ],
  };

  const options = {
    scales: {
      x: { grid: { display: false }, ticks: { maxTicksLimit: 8 } },
      y: { beginAtZero: true }
    },
    plugins: {
      legend: { display: false }
    },
    maintainAspectRatio: false,
  };

  return <div className="h-48 w-full"><Line data={data} options={options} /></div>;
};

export default TrafficLine;
