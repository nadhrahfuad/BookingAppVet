import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Alert, Spinner, Badge, Container } from 'react-bootstrap';
import useAuth from "../contexts/useAuth"
import "../css/custom.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faEye} from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare  } from "@fortawesome/free-regular-svg-icons";
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';



const AppointmentTable = () => {

  const {auth} = useAuth()
  
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [refreshTable, setRefreshTable] = useState(false);
  const [cancelAlert, setCancelAlert] = useState(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showGif, setShowGif] = useState(false)

  
 const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get( `${BASE_URL}/${auth.role}/${auth.id}/manage`);
        setAppointments(response.data);
        console.log("Appontments retireved successfully")
        console.log(response.data)
      } catch (error) {
        console.log("User has no appointments")
        if (error.response) {
          setError(error.response.data.message); 
          console.error('Appointments error:', error.response.data);
        } else if (error.request) {
          setError('Network error. Please try again later.');
          console.error('Network error:', error.request);
        } else {
          setError('An unexpected error occurred. Please try again.');
          console.error('Unexpected error:', error.message);
        }
      }
    };  

    if (auth.isAuthenticated) {
      fetchAppointments();
    }
  }, [auth, refreshTable, BASE_URL]);


  

  // if (loading) {
  //   return (
  //     <div className="text-center mt-4">
  //       <Spinner animation="border" role="status">
  //         setShowGif(false)

  //       </Spinner>
  //     </div>
  //   );
  // }


  const openModal = (appointment) => {
    setSelectedAppointment(appointment);
    console.log(appointment)
    setShowModal(true);
    setEditMode(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAppointment(null);
    
  };

  const handleEdit = () => {
    setEditMode(prevEditMode => !prevEditMode);
    console.log("EDIT")
  

 
  };


  const openRemoveModal = (appointment) => {
    setSelectedAppointment(appointment)
    setShowRemoveModal(true);
    console.log(appointment)
    
  };

  const closeRemoveModal =()=>{
    setShowRemoveModal(false)
  }

  const handleSave = async () => {
    console.log("EDIT")
    setEditMode(prevEditMode => !prevEditMode);
    console.log("here",selectedAppointment)
    try {

      const updatedAppointment = {
        ...selectedAppointment,
        appointment_id: selectedAppointment.appointment_id,
        action: "edit" 
      };


      const response = await axios.patch(`${BASE_URL}/${auth.role}/${auth.id}/manage/${updatedAppointment.id}/`, updatedAppointment);

      setRefreshTable(prev => !prev); 
      setSuccess(response.data)
      console.log("Appointment updated successfully")
    } catch (error) {
      console.log("Failed to update")
      if (error.response) {
        setShowGif(true)
        setError(error.response.data.message); 
        console.error('Error:', error.response.data);
      } else if (error.request) {
        setError('Network error. Please try again later.');
        console.error('Network error:', error.request);
      } else {
        setError('An unexpected error occurred. Please try again.');
        console.error('Unexpected error:', error.message);
      }
    }
  };

  const handleRemove = async () => {
    console.log(selectedAppointment)
    try {

      setLoading(true)
      const updatedAppointment = {
        ...selectedAppointment,
        appointment_id: selectedAppointment.appointment_id,
        action: "remove" 
      };

      const response = await axios.patch(`${BASE_URL}/${auth.role}/${auth.id}/manage/${updatedAppointment.id}/`, updatedAppointment);
      closeRemoveModal();
      setRefreshTable(prev => !prev); 
      setSuccess(response.data)
      console.log('Appointment removed successfully');
    } catch (error) {
      console.log("Failed to remove appointment")
      setLoading(false)
      if (error.response) {
        setError(error.response.data.message); 
        console.error('Error:', error.response.data);
      } else if (error.request) {
        setError('Network error. Please try again later.');
        console.error('Network error:', error.request);
      } else {
        setError('An unexpected error occurred. Please try again.');
        console.error('Unexpected error:', error.message);
      }
    }
  }

  const clearError = () => {
    setError(null);
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setError(null);
    }, 5000); 
  
  
    return () => clearTimeout(timer);
  }, [error]); 

  const openConfirmModal = () => {
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const handleCancel = async () => {
    console.log(selectedAppointment.appointment_id)

    try {

      const updatedAppointment = {
        ...selectedAppointment,
        appointment_id: selectedAppointment.appointment_id,
        action: "cancel" 
      };

      const response = await axios.patch(`${BASE_URL}/${auth.role}/${auth.id}/manage/${updatedAppointment.id}`,{
        appointment_id: updatedAppointment.appointment_id,
        action: "cancel"
      });

      setRefreshTable(prev => !prev); 
      closeConfirmModal();
      setSuccess(response.data)
      console.log('Appointment cancelled successfully');
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message); 
        console.error('Error:', error.response.data);
      } else if (error.request) {
        setError('Network error. Please try again later.');
        console.error('Network error:', error.request);
      } else {
        setError('An unexpected error occurred. Please try again.');
        console.error('Unexpected error:', error.message);
      }
      
    }
  };

  const handleCloseConfirm=()=>{
    setShowConfirmModal(false)
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSelectedAppointment({ ...selectedAppointment, [name]: value });
  };

  const handleCancelAlertClose = () => {
    setCancelAlert(null);
  };

  return (
    <div className="p-4 mt-4 ">
      {/* {error &&  (<Alert className="text-center mt-4" variant="danger" onClose={clearError} >
{error}
</Alert>)} */}

<Container>
 {error &&  (<Alert className="text-center" variant="danger" >
{error}
</Alert>)}
</Container>




{!error && (
  <table className="custom-table" id="CustomTable">
    <thead className="table-heading">
      <tr>
        <th>#</th>

        {/* {(auth.role === "vet" || auth.role === "admin") && <th>Appointment ID</th>} */}
        <th>Appointment ID</th>
        
        {(auth.role === "vet" || auth.role === "admin") && <th>Booking Reference</th>}
        {auth.role === "admin" && <th>Vet ID</th>}
        {(auth.role === "admin" || auth.role === "vet") && <th>Pet ID</th>}
        {(auth.role === "admin" || auth.role === "petowner") && <th>Vet Name</th>}
        <th>Pet Name</th>
        {(auth.role === "admin" || auth.role === "vet") && <th>Owner Name</th>}
        <th>Schedule</th>
        <th>Status</th>
        <th colSpan="2">Actions</th>
      </tr>
    </thead>
    <tbody>
      {appointments.map((appointment, index) => (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{appointment.appointment_id}</td>
        

          {auth.role !== "petowner" && <td>{appointment.booked_by}</td>}
          {auth.role === "admin" && <td>{appointment.vet_id}</td>}
          {(auth.role === "admin" || auth.role === "vet") && <td>{appointment.pet_id}</td>}
          {(auth.role === "admin" || auth.role === "petowner") && <td>{appointment.vet_name}</td>}
          <td>{appointment.pet_name}</td>
          {(auth.role === "admin" || auth.role === "vet") && <td>{appointment.owner_name}</td>}
          <td>{appointment.day_of_week} {appointment.start_time} {appointment.end_time}</td>
          <td>
            {auth.role === 'admin' || auth.role === 'vet' ? (
              <select value={appointment.status}>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
                <option value="scheduled">Scheduled</option>
              </select>
            ) : (
              <>
                {appointment.status === 'pending' && (
                  <Badge bg="primary">Pending</Badge>
                )}
                {appointment.status === 'cancelled' && (
                  <Badge bg="danger">Cancelled</Badge>
                )}
                {appointment.status === 'scheduled' && (
                  <Badge bg="warning" >Scheduled</Badge>
                )}
                {appointment.status === 'confirmed' && (
                  <Badge bg="success">Confirmed</Badge>
                )}
              </>
            )}
          </td>
          <td className="d-flex border-0 justify-content-center align-items-center">
            {appointment.status !== "cancelled" ? (
              <Button variant="none" className="border-0" onClick={() => openModal(appointment)}>
                <FontAwesomeIcon icon={faPenToSquare}/>
              </Button>
            ) : (
              <Button variant="none" onClick={() => openModal(appointment)}>
                <FontAwesomeIcon icon={faEye}/>
              </Button>
            )}
            <Button variant="none" onClick={() => openRemoveModal(appointment)}>
              <FontAwesomeIcon style={{color: "#d30d2b",}}icon={faTrashCan}/>
            </Button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
)}

      {/* View/Edit Modal */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Appointment Details for {selectedAppointment? `${selectedAppointment.pet_name}`:''}</Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <Form >
            <Form.Group controlId="formAppointmentReference">
              <Form.Label>Booking #</Form.Label>
              <Form.Control 
                type="text" 
                name="bookingReference" 
                value={selectedAppointment ? `${selectedAppointment.appointment_id}`: ''} 
                className = "mt-2"
                readOnly
                disabled
              />
            </Form.Group>

            <Form.Group controlId="formVetInCharge">
              <Form.Label className = "mt-2">Vet In Charge</Form.Label>
              <Form.Control 
                type="text" 
                name="vet" 
                value={selectedAppointment ? `${selectedAppointment.vet_name}`: ''} 
                readOnly
                disabled
                className="text-center"
              />
            </Form.Group>

            <Form.Group controlId="formPatientName">
              <Form.Label className = "mt-2">Pet Name</Form.Label>
              <Form.Control 
                type="text" 
                name="vet" 
                value={selectedAppointment ? `${selectedAppointment.pet_name}`: ''}
                readOnly
                disabled
                className="text-center"
              />
            </Form.Group>

            <Form.Group controlId="formAppointmentTime">
              <Form.Label className = "mt-2">Schedule</Form.Label>
              <Form.Control 
                type="text" 
                name="time" 
                value={selectedAppointment ? `${selectedAppointment.day_of_week}  ${selectedAppointment.start_time} - ${selectedAppointment.end_time}` : ''} 
                readOnly
                disabled
                className="text-center"
              />
            </Form.Group>

            <Form.Group controlId="formReason">
            <Form.Label className = "mt-2">Reason</Form.Label>
              <Form.Control 
                as="textarea"
                rows={3} 
                name="reason" 
                value={selectedAppointment ? `${selectedAppointment.reason}` : ''} 
                onChange={handleInputChange} 
                readOnly={!editMode}
                disabled = {!editMode}
              />
            </Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          {!editMode ? (
            <Button variant="info" onClick={handleEdit}>Edit</Button>
          ) : (
            <Button variant="primary" onClick={handleSave}>Update</Button>
          )}
          <Button variant="danger" onClick={openConfirmModal}>Cancel Appointment</Button>
        </Modal.Footer>
      </Modal>

      {/* Confirm Cancel Modal */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      {showModal &&(
      <Modal centered backdrop="static" style={{ width: '100%' }} show={showConfirmModal} onHide={closeConfirmModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Cancel Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to cancel this appointment?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeConfirmModal}>Close</Button>


          <Button variant="danger" onClick={handleCancel}>Confirm Cancel</Button>

        </Modal.Footer>
      </Modal>
     
      )}
       </div>

{showRemoveModal &&(
      <Modal show={showRemoveModal} onHide={closeRemoveModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Remove Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <span><b>Are you sure you want to remove this appointment?</b></span>
          <p>Confirming removal will mark your pet&apos;s appointment as cancelled.</p>


        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeConfirmModal}>Close</Button>
          <Button variant="danger" onClick={handleRemove}>Yes</Button>
        </Modal.Footer>
      </Modal>
      )}

      {cancelAlert && (
        <Alert variant={cancelAlert.variant} onClose={handleCancelAlertClose} >
          {cancelAlert.message}
        </Alert>


      )}

      
      
    </div>
  );
};

export default AppointmentTable;
