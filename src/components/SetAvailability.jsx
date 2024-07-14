import { useEffect, useState } from 'react';
import axios from 'axios';
import useAuth from "../contexts/useAuth";
import { Container, Row, Form, Button, Col, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';



const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const generateTimeOptions = () => {
  let times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      let hh = hour.toString().padStart(2, '0');
      let mm = minute.toString().padStart(2, '0');
      times.push(`${hh}:${mm}`);
    }
  }
  return times;
};


  const AvailabilityForm = () => {
    const {auth} = useAuth()
    const [dayOfWeek, setDayOfWeek] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [availability, setAvailability] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState(false)

  
   const BASE_URL = process.env.REACT_APP_BASE_URL;


    useEffect(() => {
      const fetchSlots = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/${auth.role}/${auth.id}/availappointments`);
          // const {data} = response
          console.log("GET RES" ,response)
          setAvailability(response.data); 
          console.log('Scheduled slots received successfully');
          console.log
        } catch (error) {
          console.log("Vet has no scheduled slots")
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
  
      fetchSlots(); 
    }, [auth, BASE_URL]);

    const renderAvailabilitySlots = () => {
      if (availability.length === 0) {
        return <p>No availability slots found</p>;
      }
  
      return (
        <ul className='list-unstyled'>
          {availability.map((availability, index) => (
            <li key={index}  className="ml-2 d-flex justify-content-between align-items-center mb-3"> 
            <div className="align-items-center text-center">
              {`${availability.day_of_week} | ${availability.start_time} - ${availability.end_time}`}
              </div>
              <Button  variant="dannoneger" className="ms-2" onClick={() => removeAvailability(availability.id)}>
                <FontAwesomeIcon className= "fa-lg" icon={faTrashCan} style={{color: "#d30d2b",}} />
              </Button>
            </li>
          ))}
        </ul>
      );
    };
    
  
    const addAvailability = async () => {
      if (dayOfWeek && startTime && endTime) {
        const newAvailability = {
          dayOfWeek,
          startTime,
          endTime,
        };
        try {
          const response = await axios.post(`${BASE_URL}/${auth.role}/${auth.id}/availability`, newAvailability);
          console.log("RES", newAvailability)
          setAvailability([...availability, response.data]);
          console.log('Added Availability:', response.data);
          setDayOfWeek('');
          setStartTime('');
          setEndTime('');
          setShowModal(false)
          console.log("Availability added successfully")
        } catch (error) {
          console.log("Failed to add availabilities")
          if (error.response) {
            setError(error.response.data.message); 
            console.error('Login error:', error.response.data);
          } else if (error.request) {
            setError('Network error. Please try again later.');
            console.error('Network error:', error.request);
          } else {
            setError('An unexpected error occurred. Please try again.');
            console.error('Unexpected error:', error.message);
          }
          
        }
      } else {
        console.log('Please fill out all fields.');
      }
    };



    const removeAvailability = async (id) => {
      try {
        await axios.delete(`${BASE_URL}/availability/${id}`);
        const updatedAvailability = availability.filter(item => item.id !== id);
        setAvailability(updatedAvailability);
        console.log('Deleted Availability with ID:', id);
      } catch (error) {
        console.error('Error removing availability:', error);

      }
    };
  
  
    return (
      <Container className="mt-4  justify-content-center align-items-center">
     

      <Modal show={showModal} onHide={() => setShowModal(false)} centered backdrop="static">
        <Modal.Header>
        <h4>Set your schedules</h4>
        </Modal.Header>
        
        <Modal.Body >
        <Form >
            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Day of Week</Form.Label>
                  <Form.Control
                    as="select"
                    value={dayOfWeek}
                    onChange={(e) => setDayOfWeek(e.target.value)}
                    className="form-select"
                  >
                    <option value="">Select Day</option>
                    {daysOfWeek.map((day) => (
                      <option key={day}>{day}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>

              <Col>
                <Form.Group>
                  <Form.Label>Start Time</Form.Label>
                  <Form.Control
                    as="select"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="form-select"
                  >
                    <option value="">Select Start Time</option>
                    {generateTimeOptions().map((time) => (
                      <option key={time}>{time}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>

              <Col>
                <Form.Group>
                  <Form.Label>End Time</Form.Label>
                  <Form.Control
                    as="select"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="form-select"
                  >
                    <option value="">Select End Time</option>
                    {generateTimeOptions().map((time) => (
                      <option key={time}>{time}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-end">
            <Button variant="primary" onClick={addAvailability}>
            Add
          </Button>
          </div>
          </Form>
        </Modal.Body>
       
      </Modal>

      <hr />

      <h2>Current Availability</h2>
      <div className="mt-4  justify-content-center align-items-center">
      {renderAvailabilitySlots()}
      </div>
      <Modal.Footer>
        <Button variant="primary" onClick={() => setShowModal(true)} >
        Add Availability
      </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
    </Container>
  );
};

export default AvailabilityForm;