import React from 'react';
import { Doughnut } from 'react-chartjs-2';

interface DoughnutProps {
  data?: { critical?: number; high?: number; medium?: number; low?: number };
}

const SeverityDoughnut: React.FC<DoughnutProps> = ({ data: stats = {} }) => {
  const critical = stats.critical ?? 10;
  const high = stats.high ?? 30;
  const medium = stats.medium ?? 60;
  const low = stats.low ?? 50;

  const chartData = {
    labels: ['Critical', 'High', 'Medium', 'Low'],
    datasets: [{
      data: [critical, high, medium, low],
      backgroundColor: ['#EF4444', '#F97316', '#F59E0B', '#06B6D4'],
      borderColor: '#0B1120',
      borderWidth: 2,
    }]
  };

  const options = {
    cutout: '76%',
    plugins: {
      legend: { position: 'right' as const, labels: { color: '#E2E8F0', font: { size: 12, family: 'Inter' } } }
    },
    maintainAspectRatio: false,
  };

  const total = critical + high + medium + low;

  return (
    <div className="relative h-48 w-full flex items-center justify-center">
      <Doughnut data={chartData} options={options} />
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pr-24">
        <span className="text-3xl font-mono font-bold text-white">{total}</span>
        <span className="text-xs text-gray-400 uppercase">Alerts</span>
      </div>
    </div>
  );
};

export default SeverityDoughnut;
