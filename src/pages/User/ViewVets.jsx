import { useState, useEffect } from 'react';
import axios from 'axios';
import useAuth from '../../contexts/useAuth';
import { Card, CardBody, CardTitle, CardText, Button, Col, Row, Container, Alert } from 'react-bootstrap';
import BookModal from '../../components/BookModal';
import placeholderImg from "../../assets/placeholder.jpg"
import Footer from '../../components/Footer';
// import SuccessModal from '../../components/SuccessModal';

const ViewVets = () => {
  const { auth } = useAuth();
  const [vetList, setVetList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedVet, setSelectedVet] = useState(null);
  const [error, setError] = useState(false)


 const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchVetList = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/${auth.role}/${auth.id}/viewvets`);
        setVetList(response.data);
        console.log('Registered vets retrieved successfully');
      } catch (error) {
        if (error.response) {
          console.log("No enabled vets.")
          setError(error.response.data.message); 
          console.error('Get vet list error:', error.response.data);
        } else if (error.request) {
          setError('Network error. Please try again later.');
          console.error('Network error:', error.request);
        } else {
          setError('An unexpected error occurred. Please try again.');
          console.error('Unable to fetch error:', error.message);
        }
      }
    }


    if (auth.isAuthenticated) {
      fetchVetList();
    }
  }, [BASE_URL, auth]);


  const clearError = () => {
    setError(null);
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setError(null);
    }, 5000); 
  
  
    return () => clearTimeout(timer);
  }, [error]); 
  
  

  const handleOpenModal = (vet) => {
    setSelectedVet(vet);
    setShowModal(true);
    // setBookingSuccess(false)
  };

  const handleBookingSuccess = ()=>
    {
      setShowModal(false)
      // setShowSuccessModal(true)
      // setBookingSuccess(true)
    }

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedVet(null);
  };

  

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Container className="mt-4">
      <h2 className="mt-5 mb-4 text-center">Available Vets</h2>
      {/* {error && <p>Error fetching available vets. Please try again later.</p>} */}
      {error && <Alert className="text-center" variant="danger" onClose={clearError} >
              {error}
              </Alert>}

      {vetList.length > 0 && !error && (
        <Row xs={1} md={2} lg={3} className="g-1">
          {vetList.map(vet => (
            <Col key={vet.user_id} className="mb-4 p-3">
              <Card className="h-100 d-flex flex-column justify-content-between">
                <div className="d-flex justify-content-center mt-4">
                  <Card.Img src={placeholderImg} className="rounded-circle img-thumbnail" alt={vet.firstname} style={{ width: '200px', height: '200px', objectFit: 'cover' }} />
                </div>
                <CardBody className="text-center">
                  <CardTitle>{vet.firstname}</CardTitle>
                  <CardText>{vet.specialization}</CardText>
                  <CardText className="text-muted">{vet.bio}</CardText>
                  <Button variant="primary" onClick={() => handleOpenModal(vet)}>Schedule Now!</Button>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
        
      )}


      {/* Modal components */}
      <BookModal
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        selectedVet={selectedVet}
        onBookingSuccess = {handleBookingSuccess}
      />

     
    </Container>
    <Footer style={{ marginTop: 'auto' }} />
    </div>
  );
};
export default ViewVets