import { Modal, Button } from 'react-bootstrap';

const ConfirmDeleteAccount = ({ show, handleClose, handleConfirm, loading }) => {
  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static">
      {/* <Modal.Header closeButton>
        <Modal.Title>Confirm Account Deletion</Modal.Title>
      </Modal.Header> */}
      <Modal.Body>
        <p><strong>Are you sure you want to delete your account?</strong></p>
        <p><strong>Reason</strong></p>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Close
        </Button>
        <Button variant="danger" onClick={handleConfirm} disabled={loading}>
          {loading ? 'Deleting account...' : 'Proceed'}
        </Button>
    
      </Modal.Body>
      {/* <Modal.Footer>
        
      </Modal.Footer> */}
    </Modal>
  );
};

export default ConfirmDeleteAccount;
