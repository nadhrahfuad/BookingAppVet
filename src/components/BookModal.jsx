import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';
import useAuth from '../contexts/useAuth';
import BookConfirm from './BookConfirm';
import Placeholder from "../assets/placeholder.jpg";

const BookModal = ({ showModal, handleCloseModal, selectedVet }) => {
  const { auth } = useAuth();
  const [vetDetails, setVetDetails] = useState(null);
  const [vetAvailSlots, setVetAvailSlots] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [registeredPets, setRegisteredPets] = useState([]);
  const [refresh, setRefresh] = useState(true)
  const [bookingReason, setBookingReason] = useState('');
  const [selectedPet, setSelectedPet] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false);

 const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchVetDetails = async () => {
        setError(null); 
      if (showModal && selectedVet) {
        try {
          const response = await axios.get(`${BASE_URL}/${auth.role}/${auth.id}/${selectedVet.user_id}/profile`);
          setVetDetails(response.data);
          console.log('Registered vets retrieved successfully');
        } catch (error) {

          if(error.response){
            console.log("No vets found")
            setError(error.response.data.message)
          }else if (error.request) {
            setError('Network error. Please try again later.');
            console.error('Network error:', error.request);
          } else {
            setError('An unexpected error occurred. Please try again.');
            console.error('Unexpected error:', error.message);
          }
        }
        
        try {
          const availabilitySlots = await axios.get(`${BASE_URL}/${auth.role}/${auth.id}/${selectedVet.user_id}/availappointments`);
          setVetAvailSlots(availabilitySlots.data);
          console.log('Vet availabilities retrieved successfully');

        } catch (error) {
          console.log("No availabilities found")
          if(error.response){
            setError(error.response.data.message)
          }else if (error.request) {
            setError('Network error. Please try again later.');
            console.error('Network error:', error.request);
          } else {
            setError('An unexpected error occurred. Please try again.');
            console.error('Unexpected error:', error.message);
          }

        }

        try {
            const petsList = await axios.get(`${BASE_URL}/${auth.role}/${auth.id}/petslist`);
            setRegisteredPets(petsList.data); 
            console.log('Registered pets retrieved successfully');
          } catch (error) {
            console.log("User has no registered pets")
            if(error.response){ setError(error.response.data.message); 
              console.error('Error', error.response.data);
            } else if (error.request) {
              setError('Network error. Please try again later.');
              console.error('Network error:', error.request);
            } else {
              setError('An unexpected error occurred. Please try again.');
              console.error('Unexpected error:', error.message);
            }
          }
      }
    };

    if (auth.isAuthenticated) {
      fetchVetDetails();
    }
  }, [showModal, selectedVet, BASE_URL, auth, refresh]);
  
  const clearError = () => {
    setError(null);
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setError(null);
    }, 5000); 
  
  
    return () => clearTimeout(timer);
  }, [error]); 
  
  
  const handleConfirmBooking = () => {
    setShowConfirm(true);
  };

  const clearSuccess = () => {
    setSuccess(null);
  };

  const handleCloseConfirm = () => {
    setShowConfirm(false);
  };

  const handleBookingAppointment = async () => {
    if (!selectedSlot) {
      setError('Please select an available slot');
      return;
    }

    setLoading(true);

    const { day_of_week, start_time, end_time } = selectedSlot;

    // console.log("v", selectedVet.user_id)
    // console.log("p", selectedPet.pet_id)
    console.log("here", selectedVet.firstname)
    console.log("here2", selectedPet.name)


    try {
      await axios.post(`${BASE_URL}/${auth.role}/${auth.id}/${selectedVet.user_id}/vetbooking`, {
        owner_name: auth.firstname,
        pet_name:selectedPet.name,
        vet_name:`${selectedVet.firstname} ${selectedVet.lastname}`,
        vet_id: selectedVet.user_id,
        pet_id: selectedPet.pet_id,
        day_of_week,
        start_time,
        end_time,
        reason: bookingReason,
        booked_by: auth.id,
      });

      setShowConfirm(true);
      setError(null); 
      setLoading(false);
      handleCloseModal();
      console.log("Schedule successfully booked")
    } catch (error) {
      console.log("Failed to book schedule")
      setLoading(false);
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

  return (
    <Modal show={showModal} onHide={handleCloseModal } centered backdrop="static">
      <Modal.Header closeButton >
      </Modal.Header>
      <Modal.Body>

      {error && <Alert className="text-center" variant="danger" onClose={clearError} >
              {error}
              </Alert>}

        {vetDetails ? (
          <div>
            <h3 className='text-center'>DR. {vetDetails.lastname}</h3>
            <div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div>
            <img
             src={Placeholder}
             alt="Profile Preview"
             style={{
              width: '200px',
              height: '200px',
              objectFit: 'cover', 
              borderRadius: '50%',
              border: 'solid 1px', 
             }}
           />
           </div>
           <div>
          </div>
          </div>

            </div>
            {vetAvailSlots ? (
              <>
                <Form.Group controlId="vetSlotsDropdown">
                  {vetAvailSlots.length > 0 ? (
                  <Form.Control className='text-center mt-4'
                   as="select" 
                   onChange={(e) => setSelectedSlot(JSON.parse(e.target.value))}>
                    <option value="">Select A Schedule</option>
                    
                    {vetAvailSlots.map((vetSlot, index) => (
                      <option key={index} value={JSON.stringify(vetSlot)}>
                        {vetSlot.day_of_week} - {vetSlot.start_time} to {vetSlot.end_time}
                      </option>
                    ))}
                  </Form.Control>
                ) : (
                    <div>
                      <p>No available slots.</p>
                    </div>
                  )}

                </Form.Group>


                <Form.Group controlId="petSelection">
                  {registeredPets.length > 0 ? (
                    <Form.Control className='text-center mt-4' as="select" onChange={(e) => setSelectedPet(JSON.parse(e.target.value))}>
                      <option value="">Select Pet</option>
                      {registeredPets.map((registeredPet, index) => (
                        <option key={index} value={JSON.stringify(registeredPet)}>
                          {registeredPet.name}
                        </option>
                      ))}
                    </Form.Control>
                  ) : (
                    <div className="d-flex flex-column justify-content-center align-items-center mt-3 ">
                      <p>No registered pets found.</p>
                      <p>Please <a href={`/${auth.role}/${auth.id}/viewpets`}>click here</a> to add a pet.</p>
                    </div>
                  )}
                </Form.Group>

                <Form.Group controlId="bookingReason">
                  <Form.Label className='mt-2'><strong>Reason for Appointment:</strong></Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={bookingReason}
                    onChange={(e) => setBookingReason(e.target.value)}
                  />
                </Form.Group>

                <BookConfirm
                  show={showConfirm}
                  handleClose={handleCloseConfirm}
                  handleConfirm={handleBookingAppointment}
                  selectedSlot={selectedSlot}
                  selectedPet={selectedPet}
                  bookingReason={bookingReason}
                  loading={loading}
                />
              </>
            ) : (
              <p>Loading availability slots...</p>
            )}
          </div>
        ) : (
          <p>Loading vet details...</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal} disabled={loading}>
          Close
        </Button>
        <Button variant="primary" onClick={handleConfirmBooking} disabled={!selectedSlot || loading || selectedPet.length === 0}>
          {loading ? 'Booking...' : 'Book Now'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BookModal;
