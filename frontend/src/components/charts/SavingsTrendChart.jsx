import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

// Expects: [{ month: '2026-01', savings: 4000 }, ...]
const SavingsTrendChart = ({ data = [] }) => {
  const chartData = {
    labels: data.map((d) => d.month),
    datasets: [
      {
        label: 'Savings',
        data: data.map((d) => d.savings),
        borderColor: '#6B4EFF',
        backgroundColor: 'rgba(107,78,255,0.15)',
        tension: 0.35,
        fill: true
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } }
  };

  return (
    <div style={{ height: '220px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default SavingsTrendChart;