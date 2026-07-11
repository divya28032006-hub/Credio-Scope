import { Card, ProgressBar, Button } from 'react-bootstrap';
import { RiDeleteBinLine } from 'react-icons/ri';
import { formatCurrency } from '../../utils/formatCurrency';

const statusVariant = { green: 'success', yellow: 'warning', red: 'danger' };

const BudgetCard = ({ budget, onDelete }) => {
  const { category, amount, spent, remaining, percent, status } = budget;

  return (
    <Card className="glass-card border-0 p-3 h-100">
      <div className="d-flex justify-content-between align-items-start mb-2">
        <div className="fw-semibold">{category}</div>
        <Button variant="link" className="text-danger p-0" onClick={() => onDelete(budget)} aria-label="Delete budget">
          <RiDeleteBinLine size={16} />
        </Button>
      </div>

      <div className="small text-muted mb-1 font-tabular">
        {formatCurrency(spent)} of {formatCurrency(amount)}
      </div>

      <ProgressBar
        now={Math.min(percent, 100)}
        variant={statusVariant[status] || 'primary'}
        className="mb-2"
        style={{ height: '8px' }}
      />

      <div className="small text-muted">
        {remaining >= 0 ? `${formatCurrency(remaining)} remaining` : `${formatCurrency(Math.abs(remaining))} over budget`}
      </div>
    </Card>
  );
};

export default BudgetCard;