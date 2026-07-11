import { useEffect, useState } from 'react';
import { Row, Col, Spinner, Alert } from 'react-bootstrap';
import { api, getErrorMessage } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import SummaryCards from '../components/dashboard/SummaryCards';
import StreakCard from '../components/dashboard/StreakCard';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import MonthlyTrendChart from '../components/charts/MonthlyTrendChart';
import CategoryDoughnutChart from '../components/charts/CategoryDoughnutChart';
import SavingsTrendChart from '../components/charts/SavingsTrendChart';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/analytics/dashboard');
        setDashboard(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  const summary = dashboard?.summary || {};

  return (
    <div>
      <h2 className="font-display fw-semibold mb-4">
        Welcome back, {user?.name?.split(' ')[0]}
      </h2>

      <SummaryCards income={summary.income} expense={summary.expense} savings={summary.savings} />

      <Row className="g-3 mb-4">
        <Col xs={12} md={4}>
          <StreakCard current={user?.streak?.current} longest={user?.streak?.longest} />
        </Col>
        <Col xs={12} md={8}>
          <div className="glass-card p-4 h-100">
            <h3 className="fs-6 fw-semibold mb-3">Income vs Expense</h3>
            <MonthlyTrendChart data={dashboard?.monthlyTotals} />
          </div>
        </Col>
      </Row>

      <Row className="g-3 mb-4">
        <Col xs={12} md={5}>
          <div className="glass-card p-4 h-100">
            <h3 className="fs-6 fw-semibold mb-3">Spending by Category</h3>
            <CategoryDoughnutChart data={dashboard?.categoryBreakdown} />
          </div>
        </Col>
        <Col xs={12} md={7}>
          <div className="glass-card p-4 h-100">
            <h3 className="fs-6 fw-semibold mb-3">Savings Trend</h3>
            <SavingsTrendChart data={dashboard?.savingsTrend} />
          </div>
        </Col>
      </Row>

      <div className="glass-card p-4">
        <h3 className="fs-6 fw-semibold mb-3">Recent Transactions</h3>
        <RecentTransactions transactions={dashboard?.recentTransactions} />
      </div>
    </div>
  );
};

export default Dashboard;