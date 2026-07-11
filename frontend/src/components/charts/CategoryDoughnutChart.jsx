import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const PALETTE = ['#6B4EFF', '#B8862B', '#2F6F5E', '#A6432D', '#D9A64A', '#7A8478', '#4FD1A5', '#E8735A'];

// Expects: [{ category: 'Food', amount: 4200 }, ...]
const CategoryDoughnutChart = ({ data = [] }) => {
  const chartData = {
    labels: data.map((d) => d.category),
    datasets: [
      {
        data: data.map((d) => d.amount),
        backgroundColor: data.map((_, i) => PALETTE[i % PALETTE.length]),
        borderWidth: 0
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { boxWidth: 12 } } },
    cutout: '65%'
  };

  if (!data.length) {
    return <p className="text-muted small mb-0">No category data yet this month.</p>;
  }

  return (
    <div style={{ height: '260px' }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default CategoryDoughnutChart;