import { Modal, Button } from 'react-bootstrap';
import "../css/custom.css"

const ConfirmBooking = ({ show, handleClose, handleConfirm, selectedSlot, selectedPet, bookingReason, loading }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <Modal show={show} onHide={handleClose} centered style={{ width: '100%' }}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Booking Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Slot:</strong> {selectedSlot?.day_of_week}, {selectedSlot?.start_time} to {selectedSlot?.end_time}</p>
        <p><strong>Selected Pet:</strong> {selectedPet?.name}</p>
        <p><strong>Reason:</strong></p>
        <p>{bookingReason}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Close
        </Button>
        <Button variant="primary" onClick={handleConfirm} disabled={loading}>
          {loading ? 'Booking...' : 'Confirm Booking'}
        </Button>
      </Modal.Footer>
    </Modal>
    </div>
  );
};

export default ConfirmBooking;
