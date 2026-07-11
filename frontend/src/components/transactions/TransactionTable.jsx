import { Table, Badge, Button } from 'react-bootstrap';
import { RiEditLine, RiDeleteBinLine } from 'react-icons/ri';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

const TransactionTable = ({ transactions, onEdit, onDelete }) => {
  if (!transactions.length) {
    return <p className="text-muted small mb-0">No transactions match these filters.</p>;
  }

  return (
    <div className="table-responsive">
      <Table hover className="align-middle mb-0">
        <thead>
          <tr>
            <th>Date</th>
            <th>Merchant</th>
            <th>Category</th>
            <th>Source</th>
            <th className="text-end">Amount</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn) => (
            <tr key={txn._id}>
              <td className="small text-muted">{formatDate(txn.date)}</td>
              <td className="fw-semibold">{txn.merchant}</td>
              <td>
                <Badge bg="secondary" className="fw-normal">
                  {txn.category}
                </Badge>
              </td>
              <td className="small text-muted">{txn.source}</td>
              <td className={`text-end font-tabular fw-semibold text-${txn.type === 'income' ? 'success' : 'danger'}`}>
                {txn.type === 'income' ? '+' : '-'}
                {formatCurrency(txn.amount)}
              </td>
              <td className="text-end">
                <Button variant="link" className="text-body p-1" onClick={() => onEdit(txn)} aria-label="Edit">
                  <RiEditLine size={16} />
                </Button>
                <Button variant="link" className="text-danger p-1" onClick={() => onDelete(txn)} aria-label="Delete">
                  <RiDeleteBinLine size={16} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TransactionTable;