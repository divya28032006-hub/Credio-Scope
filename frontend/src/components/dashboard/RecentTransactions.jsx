import { ListGroup, Badge } from 'react-bootstrap';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

const RecentTransactions = ({ transactions = [] }) => {
  if (!transactions.length) {
    return <p className="text-muted small mb-0">No transactions yet — add your first one to see it here.</p>;
  }

  return (
    <ListGroup variant="flush">
      {transactions.map((txn) => (
        <ListGroup.Item
          key={txn._id}
          className="bg-transparent d-flex justify-content-between align-items-center px-0"
        >
          <div>
            <div className="fw-semibold">{txn.merchant}</div>
            <div className="small text-muted">
              {txn.category} · {formatDate(txn.date)}
            </div>
          </div>
          <Badge bg={txn.type === 'income' ? 'success' : 'danger'} className="font-tabular fw-normal">
            {txn.type === 'income' ? '+' : '-'}
            {formatCurrency(txn.amount)}
          </Badge>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default RecentTransactions;