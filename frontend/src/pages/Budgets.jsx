import { useCallback, useEffect, useState } from 'react';
import { Row, Col, Button, Alert, Spinner } from 'react-bootstrap';
import { RiAddLine } from 'react-icons/ri';
import { api, getErrorMessage } from '../api/client';
import BudgetCard from '../components/budgets/BudgetCard';
import BudgetFormModal from '../components/budgets/BudgetFormModal';
import DeleteConfirmModal from '../components/transactions/DeleteConfirmModal';

const currentMonth = new Date().toISOString().slice(0, 7);

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [month, setMonth] = useState(currentMonth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/budgets', { params: { month } });
      setBudgets(data.budgets || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (formData) => {
    await api.post('/budgets', formData);
    await load();
  };

  const handleDelete = async () => {
    await api.delete(`/budgets/${deleting._id}`);
    setDeleting(null);
    await load();
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="font-display fw-semibold mb-0">Budgets</h2>
        <div className="d-flex gap-2">
          <input
            type="month"
            className="form-control"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
          <Button variant="primary" onClick={() => setShowForm(true)} className="d-flex align-items-center gap-2">
            <RiAddLine size={18} /> Add
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : budgets.length ? (
        <Row className="g-3">
          {budgets.map((b) => (
            <Col key={b._id} xs={12} sm={6} lg={4}>
              <BudgetCard budget={b} onDelete={setDeleting} />
            </Col>
          ))}
        </Row>
      ) : (
        <p className="text-muted">No budgets set for this month yet.</p>
      )}

      <BudgetFormModal
        show={showForm}
        onHide={() => setShowForm(false)}
        onSubmit={handleCreate}
        currentMonth={month}
      />

      <DeleteConfirmModal
        show={!!deleting}
        onHide={() => setDeleting(null)}
        onConfirm={handleDelete}
        itemLabel={deleting?.category}
      />
    </div>
  );
};

export default Budgets;