import { Modal, Button } from 'react-bootstrap';

const ConfirmationModal = ({ message, onConfirm, onCancel  }) => {
  return (
    <Modal show={true} centered onHide={onCancel}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Action</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="danger" onClick={onConfirm}>Confirm</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;
