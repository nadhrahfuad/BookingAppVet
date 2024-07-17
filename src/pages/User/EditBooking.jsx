import { useState, useEffect } from 'react';
import axios from 'axios';
import useAuth from '../../contexts/useAuth';
import { Card, Form, Button, Col, Row, Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import ConfirmationModal from '../../components/ConfirmationModal';
import SuccessModal from '../../components/SuccessModal';


const EditBooking = () => {
  const { auth } = useAuth();
  const [userBookingInfo, setBookingInfo] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isCancellationSuccessful, setIsCancellationSuccessful] = useState(false)
  const [isUpdateSuccessful, setIsUpdateSuccessful] = useState(false)


  const [editing, setEditing] = useState(false);
  const { bookingid } = useParams()
  const [formData, setFormData] = useState({
    appointment_id: '',
    vet_id: '',
    vet_name: '',
    booked_by: '',
    day_of_week: '',
    start_time: '',
    end_time: '',
    owner_name: '',
    pet_id: '',
    pet_name: '',
    reason: '',
    status: ''
  });
  const [error, setError] = useState(null);
 const BASE_URL = process.env.REACT_APP_BASE_URL;

  console.log(`${BASE_URL}/${auth.role}/${auth.id}/edit/${bookingid}/`)

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/${auth.role}/${auth.id}/edit/${bookingid}`);
        setBookingInfo(response.data);
        setFormData({
            appointment_id: response.data.appointment_id || '',
            vet_id: response.data.firstname || '',
            vet_name: response.data.vet_name || '',
            booked_by: response.data.booked_by || '',
            day_of_week: response.data.day_of_week || '',  
            start_time: response.data.start_time || '',
            end_time: response.data.end_time || '',
            owner_name: response.firstname || '',
            pet_name: response.data.pet_name || '',
            pet_id: response.data.pet_id || '',
            reason: response.data.reason || '',
            status: response.data.status || '',
            removed: response.data.removed || ''

        });
        console.log(response.data)
        console.log('Appointment information retrieved successfully');
      } catch (error) {
        console.error('Error fetching appointment information:', error);
        setError('Unable to retrieve appointment information');
      }
    };

    if (auth.isAuthenticated) {
        fetchBooking();
    }
  }, [BASE_URL, auth, bookingid]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // app.patch("/:role/:id/mybookings/:bookingid/editbooking"
      await axios.patch(`${BASE_URL}/${auth.role}/${auth.id}/edit/${bookingid}/`, formData);
      setIsUpdateSuccessful(true)
      setShowSuccessModal(true)
      setEditing(false); 
      console.log('Updated appointment added successfully');
    } catch (error) {
      console.log("Failed to add appointment")
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

  const handleCancelBooking = () =>{
    setShowConfirmationModal(true)
    
  }


  const handleConfirmCancel = () => {
    const cancelBooking = async () =>{
      try {
        const formDataCancel = {...formData, status: "cancelled"}
        // app.patch("/:role/:id/mybookings/:bookingid/editbooking"
        await axios.patch(`${BASE_URL}/${auth.role}/${auth.id}/edit/${bookingid}/`, formDataCancel);

        setIsCancellationSuccessful(true)
        console.log('Appointment cancelled successfully');
      } catch (error) {
        console.log("Failed to cancle appointmnet")
        setIsCancellationSuccessful(false)
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
    if(auth.isAuthenticated) {
      cancelBooking()
    }
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4"> My Booking</h2>
      {userBookingInfo ? (
        <Row>
          <Col md={6}>
            {!editing ? (
              <Card>
                <Card.Body>
                  <Card.Title>Booking Details</Card.Title>
                  <Card.Text>
                    {/* FIXXX */}

                    <p> Appointment ID: {userBookingInfo.appointment_id}</p>
                    <p> Vet ID: {userBookingInfo.vet_id}</p>
                    <p> Booked By: {userBookingInfo.booked_by}</p>
                    <p> Day: {userBookingInfo.day_of_week}</p>
                    <p> Start Time: {userBookingInfo.start_time}</p>
                    <p> End Time: {userBookingInfo.end_time}</p>
                    <p> Client Name: {userBookingInfo.firstname}</p>
                    <p> Pet Name: {userBookingInfo.pet_name}</p>
                    <p> Pet ID: {userBookingInfo.pet_id}</p>
                    <p> Reason: {userBookingInfo.reason}</p>
                    <p>Status: {userBookingInfo.status}</p>
                
                  </Card.Text>
                  <Button variant="primary" onClick={() => setEditing(true)}>Edit Booking</Button>
                </Card.Body>
              </Card>
            ) : (
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Col>
                    <Form.Label>Appointment ID</Form.Label>
                    <Form.Control
                      type="text"
                      name="appointment_id"
                      value={formData.appointment_id}
                      readOnly

                    />
                  </Col>
                </Row>

                  <Row className="mb-3">
                  <Col>
                    <Form.Label>Vet ID</Form.Label>
                    <Form.Control
                      type="text"
                      name="vet_name"
                      value={formData.vet_name}
                      onChange={handleInputChange}
                      placeholder="Enter first name"
                    />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col>
                    <Form.Label>Booked By</Form.Label>
                    <Form.Control
                      type="text"
                      name="booked_by"
                      value={formData.booked_by}
                      readOnly
                    />
                  </Col>
                  <Col>
                    <Form.Label>Day of Week</Form.Label>
                    <Form.Control
                      type="text"
                      name="day_of_week"
                      value={formData.day_of_week}
                      onChange={handleInputChange}

                    />
                  </Col>
                </Row>

                <Col>
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control
                      type="text"
                      name="start_time"
                      value={formData.start_time}
                      onChange={handleInputChange}
                    />

                  </Col>
                
                <Col>
                    <Form.Label>End Time</Form.Label>
                    <Form.Control
                      type="text"
                      name="end_time"
                      value={formData.end_time}
                      onChange={handleInputChange}
                    />
                  </Col>

                  <Col>
                    <Form.Label> Client Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="owner_name"
                      value={auth.firstname}
                      onChange={handleInputChange}
                    />
                  </Col>
                  <Col>
                    <Form.Label>Pet Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="pet_name"
                      value={formData.pet_name}
                      onChange={handleInputChange}
                    />
                  </Col>
                  <Col>
                    <Form.Label>Pet ID</Form.Label>
                    <Form.Control
                      type="text"
                      name="pet_id"
                      value={formData.pet_id}
                      readOnly
                    />
                  </Col>
                  <Col>
                    <Form.Label>Reason</Form.Label>
                    <Form.Control
                      type="text"
                      name="reason"
                      value={formData.reason}
                      onChange={handleInputChange}
                    />
                  </Col>
                  <Col>
                    <Form.Label>Status</Form.Label>
                    <Form.Control
                      type="text"
                      name="pet_id"
                      value={formData.status}
                      readOnly
                    />
                  </Col>
                  

            
                <Button type="submit" variant="primary">Submit</Button>
                <Button variant="secondary" className="ms-2" onClick={() => setEditing(false)}>Cancel</Button>
                <Button variant="danger" className="ms-2" onClick={handleCancelBooking}>Cancel this Appointment</Button>
              </Form>
            )}
          </Col>
        </Row>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <p>Loading appointment details...</p>
      )}

{showConfirmationModal && (
        <ConfirmationModal
          message={
           isCancellationSuccessful ? "Appointment successfully cancelled" 
           :"Are you sure you want to cancel this appointment?"
          }
          onConfirm={handleConfirmCancel}
          onCancel={() => setShowConfirmationModal(false)}
        />
      )}

{showSuccessModal && (
        <SuccessModal
          message={ "Appointment successfully updated! " }
          onCancel={() => setShowSuccessModal(false)}
        />
      )}
    </Container>
  );
};

export default EditBooking;
