import { useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { CATEGORIES, TRANSACTION_TYPES, PAYMENT_SOURCES } from '../../utils/categories';

const TransactionFormModal = ({ show, onHide, onSubmit, initialData }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      type: 'expense',
      merchant: '',
      amount: '',
      category: 'Other',
      source: 'Cash',
      date: new Date().toISOString().slice(0, 10)
    }
  });

  useEffect(() => {
    if (show) {
      reset(
        initialData
          ? { ...initialData, date: initialData.date?.slice(0, 10) }
          : {
              type: 'expense',
              merchant: '',
              amount: '',
              category: 'Other',
              source: 'Cash',
              date: new Date().toISOString().slice(0, 10)
            }
      );
    }
  }, [show, initialData, reset]);

  const submit = async (formData) => {
    await onSubmit({ ...formData, amount: Number(formData.amount) });
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered contentClassName="glass-modal">
      <Modal.Header closeButton>
        <Modal.Title className="fs-5">{initialData ? 'Edit Transaction' : 'Add Transaction'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(submit)}>
        <Modal.Body>
          <Row className="g-3">
            <Col xs={6}>
              <Form.Label>Type</Form.Label>
              <Form.Select {...register('type', { required: true })}>
                {TRANSACTION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t[0].toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col xs={6}>
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                isInvalid={!!errors.amount}
                {...register('amount', { required: 'Amount is required', min: { value: 0.01, message: 'Must be greater than 0' } })}
              />
              <Form.Control.Feedback type="invalid">{errors.amount?.message}</Form.Control.Feedback>
            </Col>
            <Col xs={12}>
              <Form.Label>Merchant</Form.Label>
              <Form.Control
                isInvalid={!!errors.merchant}
                {...register('merchant', { required: 'Merchant is required' })}
              />
              <Form.Control.Feedback type="invalid">{errors.merchant?.message}</Form.Control.Feedback>
            </Col>
            <Col xs={6}>
              <Form.Label>Category</Form.Label>
              <Form.Select {...register('category', { required: true })}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col xs={6}>
              <Form.Label>Source</Form.Label>
              <Form.Select {...register('source', { required: true })}>
                {PAYMENT_SOURCES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col xs={12}>
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" {...register('date', { required: true })} />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : initialData ? 'Save changes' : 'Add transaction'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default TransactionFormModal;