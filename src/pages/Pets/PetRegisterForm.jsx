import { useEffect, useState } from "react";
import { Alert, Modal } from "react-bootstrap";
import PetProfileForm from "./PetProfileForm";
import axios from "axios";
import useAuth from "../../contexts/useAuth";

const RegistrationForm = ({ onClose }) => {
  const [error, setError] = useState(null);
 const [success, setSuccess] = useState(null)
  const {auth} = useAuth()
  // const [no, No] = useState(true)

 const BASE_URL = process.env.REACT_APP_BASE_URL;

  const handleSubmit = async (formData) => {
    // if(!no){
    try {

      const response = await axios.post(`${BASE_URL}/${auth.role}/${auth.id}/addpet`, formData);

      console.log("Pet registration successful:", response.data);
      console.log('Pet registered successfully');
      setSuccess(response.data.message)
      setError(null)
      

    } catch (error) {
      console.log("Failed to register pet")
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
      setSuccess(null)
    }
  };

  useEffect(() => {

    const timer = setTimeout(() => {
      clearError();
    }, 5000);

    return () => clearTimeout(timer);
  }, [error]);

  const clearError = () => {
    setError(null);
  };
  const clearSuccess =() =>{
    setSuccess(null)
  }

  return (
    <Modal show={true} onHide={onClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Pet Registration Form</Modal.Title>
        
      </Modal.Header>
      <Modal.Body>
      {error && <Alert className="text-center" variant="danger" onClose={clearError} >
              {error}
              </Alert>}
              
      {success && (
          <Alert variant="success" className="text-center" onClose={clearSuccess} >
            {success}
          </Alert>
        )}
             

              <PetProfileForm onSubmit={handleSubmit} />
      </Modal.Body>
    </Modal>
  );
};

export default RegistrationForm;
