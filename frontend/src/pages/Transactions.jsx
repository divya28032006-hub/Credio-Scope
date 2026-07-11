import { useState } from 'react';
import { Button, Alert, Spinner } from 'react-bootstrap';
import { RiAddLine } from 'react-icons/ri';
import { useTransactions } from '../hooks/useTransactions';
import TransactionFilters from '../components/transactions/TransactionFilters';
import TransactionTable from '../components/transactions/TransactionTable';
import TransactionFormModal from '../components/transactions/TransactionFormModal';
import DeleteConfirmModal from '../components/transactions/DeleteConfirmModal';

const Transactions = () => {
  const {
    transactions,
    loading,
    error,
    filters,
    setFilters,
    createTransaction,
    updateTransaction,
    deleteTransaction
  } = useTransactions();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const openCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (txn) => {
    setEditing(txn);
    setShowForm(true);
  };

  const handleSubmit = async (formData) => {
    if (editing) {
      await updateTransaction(editing._id, formData);
    } else {
      await createTransaction(formData);
    }
  };

  const handleDelete = async () => {
    await deleteTransaction(deleting._id);
    setDeleting(null);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="font-display fw-semibold mb-0">Transactions</h2>
        <Button variant="primary" onClick={openCreate} className="d-flex align-items-center gap-2">
          <RiAddLine size={18} /> Add
        </Button>
      </div>

      <div className="glass-card p-4">
        <TransactionFilters filters={filters} onChange={setFilters} />

        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <div className="d-flex justify-content-center py-4">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <TransactionTable transactions={transactions} onEdit={openEdit} onDelete={setDeleting} />
        )}
      </div>

      <TransactionFormModal
        show={showForm}
        onHide={() => setShowForm(false)}
        onSubmit={handleSubmit}
        initialData={editing}
      />

      <DeleteConfirmModal
        show={!!deleting}
        onHide={() => setDeleting(null)}
        onConfirm={handleDelete}
        itemLabel={deleting?.merchant}
      />
    </div>
  );
};

export default Transactions;