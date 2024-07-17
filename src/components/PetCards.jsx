import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import useAuth from '../contexts/useAuth';
import PetModal from './PetModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import Dog from "../assets/dog.jpeg"

function PetCardsList({ pets, handleRegisterPet }) {
  const { auth } = useAuth();
  const [error, setError] = useState(null);
  const [showPetModal, setShowPetModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);

 const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchPetList = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/${auth.role}/${auth.id}/petslist`);

        console.log(response.data)
        console.log('Pets list retrieved successfully');
      } catch (error) {
        if (error.response) {
          console.error('Get error:', error.response.data);
          setError(error.response.data.message);
        } else if (error.request) {
          console.error('Network error:', error.request);
          setError('Network error. Please try again later.');
        } else {
          console.error('Unexpected error:', error.message);
          setError('An unexpected error occurred. Please try again.');
        }
      }
    };

    if (auth.isAuthenticated) {
      fetchPetList();
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

  const handleOpenPetModal = (pet) => {
    setSelectedPet(pet);
    setShowPetModal(true);
  };

  const handleClosePetModal = () => {
    setShowPetModal(false);
    setSelectedPet(null);
  };

  // const removePet = (index) => {

  // };

const formattedBirthday=()=>{
  const date = pet.birthday.split('-');
  if(date.length === 3){
    const [year, month, day ] = date;
    return `${day}-${month}-${year}`
  }
}


  return (
    <Container className="mt-4 px-5 ">
      {error && (
        <Alert className="text-center" variant="danger" onClose={clearError}>
          {error}
        </Alert>
      )}

      {pets.length > 0 && (
        <Row xs={1} md={2} lg={3} className="g-4">
          {pets.map((pet, index) => (
            <Col key={index} className="p-3 ">
              <Card className="h-100 d-flex flex-column justify-content-between p-4">
                <div className="d-flex justify-content-center mt-4">
                  <Card.Img
                    src={Dog}
                    className="rounded-circle img-thumbnail"
                    alt={pet.species}
                    style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                  />
                </div>
                <Card.Body className="text-center">
                  <Card.Title>{pet.name}</Card.Title>
                  <Card.Text>{pet.birthday}</Card.Text>
                  <Card.Text className="text-muted">status</Card.Text>
                  <Button variant="primary" onClick={() => handleOpenPetModal(pet)}>
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
          <Col className="d-flex align-items-center justify-content-center col-12">
          <div>
            <FontAwesomeIcon
              icon={faCirclePlus}
              style={{ color: '#60a2c3', fontSize: '50px', cursor: 'pointer' }}
              onClick={handleRegisterPet}
            />
            </div>
          </Col>
        </Row>
      )}

      <PetModal selectedPet={selectedPet} show={showPetModal} handleClose={handleClosePetModal} />
    </Container>
  );
}

export default PetCardsList;
