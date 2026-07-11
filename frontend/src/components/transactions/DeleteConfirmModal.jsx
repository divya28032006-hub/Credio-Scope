import { Modal, Button } from 'react-bootstrap';

const DeleteConfirmModal = ({ show, onHide, onConfirm, itemLabel }) => (
  <Modal show={show} onHide={onHide} centered contentClassName="glass-modal">
    <Modal.Header closeButton>
      <Modal.Title className="fs-5">Delete transaction?</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      Are you sure you want to delete <strong>{itemLabel}</strong>? This can't be undone.
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onHide}>
        Cancel
      </Button>
      <Button variant="danger" onClick={onConfirm}>
        Delete
      </Button>
    </Modal.Footer>
  </Modal>
);

export default DeleteConfirmModal;