import {
  Chart as ChartJS,
  registerables
} from 'chart.js';

// Register all Chart.js controllers, scales, elements, and plugins
ChartJS.register(...registerables);

// Global Chart defaults
ChartJS.defaults.color = '#94A3B8';
ChartJS.defaults.borderColor = 'rgba(255, 255, 255, 0.06)';
ChartJS.defaults.font.family = "'JetBrains Mono', 'Fira Code', monospace";

export default ChartJS;
