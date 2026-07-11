import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

// Expects: [{ month: '2026-01', income: 12000, expense: 8000 }, ...]
const MonthlyTrendChart = ({ data = [] }) => {
  const chartData = {
    labels: data.map((d) => d.month),
    datasets: [
      {
        label: 'Income',
        data: data.map((d) => d.income),
        borderColor: '#2F6F5E',
        backgroundColor: 'rgba(47,111,94,0.15)',
        tension: 0.35,
        fill: true
      },
      {
        label: 'Expense',
        data: data.map((d) => d.expense),
        borderColor: '#A6432D',
        backgroundColor: 'rgba(166,67,45,0.15)',
        tension: 0.35,
        fill: true
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
    scales: { y: { beginAtZero: true } }
  };

  return (
    <div style={{ height: '280px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default MonthlyTrendChart;