import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { CATEGORIES } from '../../utils/categories';

const BudgetFormModal = ({ show, onHide, onSubmit, currentMonth }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ defaultValues: { category: 'Food', amount: '', month: currentMonth } });

  const submit = async (formData) => {
    await onSubmit({ ...formData, amount: Number(formData.amount) });
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered contentClassName="glass-modal">
      <Modal.Header closeButton>
        <Modal.Title className="fs-5">Set Budget</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(submit)}>
        <Modal.Body>
          <Row className="g-3">
            <Col xs={6}>
              <Form.Label>Category</Form.Label>
              <Form.Select {...register('category', { required: true })}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Form.Select>
            </Col>
            <Col xs={6}>
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                isInvalid={!!errors.amount}
                {...register('amount', { required: 'Amount is required', min: { value: 1, message: 'Must be greater than 0' } })}
              />
              <Form.Control.Feedback type="invalid">{errors.amount?.message}</Form.Control.Feedback>
            </Col>
            <Col xs={12}>
              <Form.Label>Month</Form.Label>
              <Form.Control type="month" {...register('month', { required: true })} />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancel</Button>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save budget'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default BudgetFormModal;