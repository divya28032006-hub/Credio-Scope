import { useEffect, useState } from 'react';
import { Row, Col, Alert, Spinner, ListGroup, Badge } from 'react-bootstrap';
import { api, getErrorMessage } from '../api/client';
import MonthlyTrendChart from '../components/charts/MonthlyTrendChart';
import CategoryDoughnutChart from '../components/charts/CategoryDoughnutChart';
import SavingsTrendChart from '../components/charts/SavingsTrendChart';
import { formatCurrency } from '../utils/formatCurrency';

const Analytics = () => {
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

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <h2 className="font-display fw-semibold mb-4">Analytics</h2>

      <Row className="g-3 mb-3">
        <Col xs={12} lg={7}>
          <div className="glass-card p-4 h-100">
            <h3 className="fs-6 fw-semibold mb-3">Income vs Expense Over Time</h3>
            <MonthlyTrendChart data={dashboard?.monthlyTotals} />
          </div>
        </Col>
        <Col xs={12} lg={5}>
          <div className="glass-card p-4 h-100">
            <h3 className="fs-6 fw-semibold mb-3">Category Breakdown</h3>
            <CategoryDoughnutChart data={dashboard?.categoryBreakdown} />
          </div>
        </Col>
      </Row>

      <Row className="g-3">
        <Col xs={12} lg={7}>
          <div className="glass-card p-4 h-100">
            <h3 className="fs-6 fw-semibold mb-3">Savings Trend</h3>
            <SavingsTrendChart data={dashboard?.savingsTrend} />
          </div>
        </Col>
        <Col xs={12} lg={5}>
          <div className="glass-card p-4 h-100">
            <h3 className="fs-6 fw-semibold mb-3">Top Merchants</h3>
            {dashboard?.topMerchants?.length ? (
              <ListGroup variant="flush">
                {dashboard.topMerchants.map((m) => (
                  <ListGroup.Item key={m.merchant} className="bg-transparent d-flex justify-content-between px-0">
                    <span>{m.merchant}</span>
                    <Badge bg="secondary" className="font-tabular fw-normal">
                      {formatCurrency(m.total)}
                    </Badge>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <p className="text-muted small mb-0">No merchant data yet.</p>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics;