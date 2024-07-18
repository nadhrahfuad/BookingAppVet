import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Alert, Spinner, Badge, Container } from 'react-bootstrap';
import useAuth from "../contexts/useAuth"
import "../css/custom.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faEye} from "@fortawesome/free-solid-svg-icons";
import { faTrashCan, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import PetModal from '../components/PetModal';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';



const AppointmentTable = () => {

  const {auth} = useAuth()
  
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPetModal, setShowPetModal] = useState(false)


  const [refreshTable, setRefreshTable] = useState(false);
  const [cancelAlert, setCancelAlert] = useState(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showGif, setShowGif] = useState(false)
  const [selectedPet, setSelectedPet] = useState(null);

  
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

      const response = await axios.patch(`${BASE_URL}/${auth.role}/${auth.id}/manage/${selectedAppointment.appointment_id}/`, {
        action: "edit",
        reason: selectedAppointment.reason
      });

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
    console.log(selectedAppointment.appointment_id)
    try {

      setLoading(true)

      const response = await axios.patch(`${BASE_URL}/${auth.role}/${auth.id}/manage/${selectedAppointment.appointment_id}/`, {
        action: "remove"
      }
      );
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

  const handleStatusChange = async(e, appointment_id) => {
    const updatedStatus = e.target.value;
    console.log("Status", updatedStatus)
    console.log(appointment_id)
    console.log("appt", appointment_id)
    try{

      
      const updatedAppointment = {
        status: updatedStatus,
        action: "update"
      }
      const response = await axios.patch(
        `${BASE_URL}/${auth.role}/${auth.id}/manage/${appointment_id}`,
       updatedAppointment
      );
      setRefreshTable((prev) => !prev);
      setSuccess(response.data);
      console.log('Appointment status updated successfully');
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

    
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedAppointment({ ...selectedAppointment, [name]: value });
  };



  const handleCancel = async () => {
    console.log(selectedAppointment.appointment_id)

    try {

      const response = await axios.patch(`${BASE_URL}/${auth.role}/${auth.id}/manage/${selectedAppointment.appointment_id}`,{
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

 
  const handleCancelAlertClose = () => {
    setCancelAlert(null);
  };

  const handleOpenPetModal = async () => {
    try {

      const response = await axios.get(`${BASE_URL}/${auth.role}/${auth.id}/viewpets/${selectedAppointment.pet_id}`)

      setSelectedPet(response.data)
      setShowPetModal(true)
    } catch (error) {
      console.error('Failed to fetch pet details:', error);
    }
  };

  const closePetModal = () => {
    setShowPetModal(false);
    setSelectedPet(null);
  };

  const handleClose = () => {
    setShowModal(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <div className="p-4 mt-4 ">
      {/* {error &&  (<Alert className="text-center mt-4" variant="danger" onClose={clearError} >
{error}
</Alert>)} */}

<Container>
<h2 className=" mb-4 text-center">My Appointments</h2>
 {error &&  (<Alert className="text-center" variant="danger" >
{error}
</Alert>)}
</Container>
{appointments.length === 0 && auth.role === "petowner" &&(
   <div className="mt-4 text-center d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
  <Link to={`/${auth.role}/${auth.id}/viewvets`} className="btn btn-primary" >
  Schedule Now
  </Link>
  </div>
)}





{!error && appointments.length >0 &&(
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
  {appointment.status === 'cancelled' ? (
    <Badge bg="danger">Cancelled</Badge>
  ) : (
    auth.role === 'admin' || auth.role === 'vet' ? (
      <select
        value={appointment && appointment.status}
        onChange={(e) => handleStatusChange(e, appointment.appointment_id)}
      >
        <option value="pending" disabled={appointment.status === 'cancelled'}>Pending</option>
        <option value="cancelled" disabled={appointment.status === 'cancelled'}>Cancelled</option>
        <option value="scheduled" disabled={appointment.status === 'cancelled'}>Scheduled</option>
        <option value="confirmed" disabled={appointment.status === 'cancelled'}>Confirmed</option>
      </select>
    ) : (

      <>
        {appointment.status === 'pending' && (
          <Badge bg="primary">Pending</Badge>
        )}
        {appointment.status === 'scheduled' && (
          <Badge bg="warning">Scheduled</Badge>
        )}
        {appointment.status === 'confirmed' && (
          <Badge bg="success">Confirmed</Badge>
        )}
      </>
    )
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

           {auth.role === "vet" ? (
              <Form.Group controlId="formPatientName">
                <div className='d-flex align-items-center mt-3'>
                <Form.Label className="mt-2 ">Pet Name</Form.Label>
                <div className=" flex-grow-1 d-flex justify-content-start align-items-center" style={{ paddingLeft: '120px' }}>
                <Button  className="" variant="link" onClick={() => handleOpenPetModal(selectedAppointment.pet_id)} >{selectedAppointment ? `${selectedAppointment.pet_name}` : ''}</Button>
                </div>
                </div>
              </Form.Group>
              
            ) : (
              <Form.Group controlId="formPatientName">
                <Form.Label className="mt-2">Pet Name</Form.Label>
                <Form.Control
                  type="text"
                  name="pet_name"
                  value={selectedAppointment ? `${selectedAppointment.pet_name}` : ''}
                  readOnly
                  disabled
                  className="text-center"
                />
              </Form.Group>
            )}

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
          
        {auth.role === "petowner" && selectedAppointment && selectedAppointment.status !== "cancelled" && (
          <>
          {!editMode ? (
            <Button variant="info" onClick={handleEdit}>Edit</Button>
          ) : (
            <Button variant="primary" onClick={handleSave}>Update</Button>
          )}
 
          </>
          )}
      
      { selectedAppointment && selectedAppointment.status !== "cancelled" && (
    <Button variant="danger" onClick={openConfirmModal}>Cancel Appointment</Button>
  )}

  { selectedAppointment && selectedAppointment.status === "cancelled" && (
    <Button variant="secondary" onClick={handleClose}>Close</Button>
  )}
      
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

{showPetModal && selectedAppointment && (

        <PetModal
          selectedPet={selectedPet}
          show={showPetModal}
          handleClose={closePetModal}
        />

      )}
      {cancelAlert && (
        <Alert variant={cancelAlert.variant} onClose={handleCancelAlertClose} >
          {cancelAlert.message}
        </Alert>


      )}

      
      
    </div>
    <Footer style={{ marginTop: 'auto' }} />

    </div>
  );
};

export default AppointmentTable;
