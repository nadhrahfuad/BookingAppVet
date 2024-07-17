import { Modal, Button } from 'react-bootstrap';
import "../css/custom.css"
import Calendar from "../assets/calendar.png"

const ConfirmBooking = ({ show, handleClose, handleConfirm, selectedSlot, selectedPet, bookingReason, loading }) => {
  return (
    
    
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Appointment Details</Modal.Title>
      </Modal.Header>
      <Modal.Body className='px-4'>

  <div className="appointmentdetails d-flex">

    <img src={Calendar} style={{ width: '150px', height: '150px', marginRight: '10px' }} />
    <div className='mt-3'>
    <div className="slot-info">
      <p><strong>Schedule:</strong> {selectedSlot?.day_of_week} {selectedSlot?.start_time} to {selectedSlot?.end_time}</p>
 
    </div>

    <div className="pet-info">
      <p><strong>Pet:</strong> {selectedPet?.name}</p>
 
    </div>

    <div className="appointment-reason">
      <p><strong>Reason:</strong></p>
      <p>{bookingReason}</p>
    </div>
    </div>

  </div>
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

  );
};

export default ConfirmBooking;
