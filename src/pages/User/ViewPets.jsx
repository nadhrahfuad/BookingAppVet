import axios from "axios";
import { useState, useEffect } from "react";
import { Alert, Button, Container } from "react-bootstrap";
import useAuth from "../../contexts/useAuth";
import PetRegisterForm from "../Pets/PetRegisterForm";
import PetCardsList from "../../components/PetCards";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";

function ViewPets() {
  const { auth } = useAuth();
  const [pets, setPets] = useState([]);
  const [error, setError] = useState(true);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const navigate = useNavigate();

 const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchPetData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/${auth.role}/${auth.id}/petslist`
        );
        setPets(response.data);
        setError(null);
        console.log('Retrieved pet list successfully');
      } catch (error) {
        console.log("Failed to retrieve pet list")
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

    if (auth.isAuthenticated) {
      fetchPetData();
    }
  }, [auth, BASE_URL]);

  const clearError = () => {
    setError(null);
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setError(null);
    }, 5000); 
  
  
    return () => clearTimeout(timer);
  }, [error]); 

  const handleRegisterPet = () => {
    setShowRegisterForm(true);
  };

  const handlePetRegistered = () => {
    setShowRegisterForm(false);

  };

  return (
    <>
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Container>
     <h2 className="mt-5 mb-4 text-center">Registered Pets</h2>
  
              {error && <Alert className="text-center " variant="danger" onClose={clearError}  >
              {error}
              </Alert>}

              </Container>
      {pets.length > 0 && (
        <div className="d-flex">
          <PetCardsList pets={pets} handleRegisterPet={handleRegisterPet} showRegisterForm={showRegisterForm} />
        </div>
      )}


      <div className="mt-4 text-center">
     
      <div className="mt-4 text-center d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      {pets.length === 0 && (
          <Button variant="primary" onClick={handleRegisterPet}>
            Register Pet
          </Button>
        )}
        </div>

        {showRegisterForm && (
          <PetRegisterForm onClose={() => setShowRegisterForm(false)} onPetRegistered={handlePetRegistered} />
        )}
      </div>

      <Footer style={{ marginTop: 'auto' }} />
      </div>
    </>

    
  );
}

export default ViewPets;
