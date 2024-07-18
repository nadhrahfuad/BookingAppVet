import { Modal, Button, Form, Alert } from 'react-bootstrap';
import Dog from "../assets/dog.jpeg";
import { useEffect, useState } from 'react';
import useAuth from "../contexts/useAuth.jsx";
import axios from 'axios';

const PetModal = ({ selectedPet, show, handleClose }) => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const { auth } = useAuth();
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedPet, setEditedPet] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); 

  useEffect(() => {
    if (selectedPet) {
      setEditedPet({ ...selectedPet });
    }
  }, [selectedPet]);

  const handleEditClick = () => {
    setIsEditMode(prevEditMode => !prevEditMode);
  }

  const handleCancel = () => {
    setIsEditMode(false)
    handleClose();
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPet(prev => ({
      ...prev,
      [name]: value
    }));
  }

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      const updatedPet = {
        ...editedPet,
        action: "edit"
      };

      const response = await axios.patch(
        `${BASE_URL}/${auth.role}/${auth.id}/viewpets/${selectedPet.pet_id}`,
        updatedPet
      );

      setSuccess(response.data);
      setIsEditMode(false);
      console.log("Pet details updated successfully");

    } catch (error) {
      console.log("Failed to update pet details", error);
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
    } finally {
      setIsLoading(false);
    }
  }

  const handleDelete = () => {
    setShowDeleteConfirmation(true);
  }

  const handleConfirmDelete = async () => {
    setShowDeleteConfirmation(false);
    setIsDeleting(true);
    try {
      const updatedPet = {
        ...editedPet,
        action: "delete"
      };

      const response = await axios.patch(
        `${BASE_URL}/${auth.role}/${auth.id}/viewpets/${selectedPet.pet_id}`,
        updatedPet
      );

      setSuccess(response.data);
      handleClose();
      console.log("Pet deleted successfully");

    } catch (error) {
      console.log("Failed to delete pet", error);
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
    } finally {
      setIsDeleting(false);
    }
  }

  const handleCloseDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
  }


  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <>
    <Modal show={show} onHide={handleClose} centered backdrop="static" >
      <Modal.Header closeButton onHide={handleCancel}>
      <Modal.Title>Pet Details for {editedPet? `${editedPet.name}`:''}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
        <div>
          {error && (
            <Alert variant="danger" onClose={clearError} dismissible>
              {error}
            </Alert>
          )}
          <h3 className='text-center'></h3>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img
              src={Dog}
              alt="Profile Preview"
              style={{
                width: '200px',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '50%',
              }}
            />
          </div>
        </div>
        <div className="container mt-4" style={{ display: 'flex', justifyContent: 'center' }}>
          <Form className="form-container" style={{ maxWidth: '600px', width: '80%' }}>
            <Form.Group controlId="formPetName">
              <Form.Label><strong>Name</strong></Form.Label>
              <Form.Control
                type="text"
                name="pet_name"
                value={editedPet.name || ''}
                onChange={handleInputChange}
                disabled={true}
                className='text-center'
              />
            </Form.Group>

            <Form.Group controlId="formPetBreed">
              <Form.Label className='mt-2'><strong>Breed</strong></Form.Label>
              <Form.Control
                type="text"
                name="breed"
                value={editedPet.breed || ''}
                onChange={handleInputChange}
                disabled={true}
                className='text-center'
              />
            </Form.Group>

            <Form.Group controlId="formPetSpecies">
              <Form.Label className='mt-2'><strong>Species</strong></Form.Label>
              <Form.Control
                type="text"
                name="species"
                value={editedPet.species || ''}
                onChange={handleInputChange}
                disabled={true}
                className='text-center'
              />
            </Form.Group>

            <Form.Group controlId="formPetBirthday">
              <Form.Label className='mt-2'><strong>Birthday</strong></Form.Label>
              <Form.Control
                type="date"
                name="birthday"
                value={editedPet.birthday || ''}
                onChange={handleInputChange}
                disabled={!isEditMode}
                className='text-center'
              />
            </Form.Group>

            <Form.Group controlId="formPetAllergies">
              <Form.Label className='mt-2'><strong>Allergies</strong></Form.Label>
              <Form.Control
                type="text"
                name="allergies"
                value={editedPet.allergies || ''}
                onChange={handleInputChange}
                disabled={!isEditMode}
                className='text-center'
              />
            </Form.Group>

            <Form.Group controlId="formPetHealthConditions">
              <Form.Label className='mt-2'><strong>Health Conditions</strong></Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="health_conditions"
                value={editedPet.health_conditions|| ''}
                onChange={handleInputChange}
                disabled={!isEditMode}
                className='text-center'
              />
            </Form.Group>

          </Form>
        </div>
      </Modal.Body>
      <Modal.Footer>
  {auth.role === "petowner" ? (
    <>
      {isLoading ? (
        <Button variant="primary" disabled>
          Saving Changes...
        </Button>
      ) : (
        <>
          {isEditMode ? (
            <Button variant="primary" onClick={handleSaveChanges} className="me-2">
              Save Changes
            </Button>
          ) : (
            <Button variant="info" onClick={handleEditClick} className="me-2">
              Edit
            </Button>
          )}
          <Button variant="danger" onClick={handleDelete} disabled={isLoading}>
            {isDeleting ? 'Deleting Pet...' : 'Delete'}
          </Button>
        </>
      )}
    </>
  ) : (
    <>
      <Button variant="secondary" onClick={handleCancel}>
        Close
      </Button>
    </>
  )}
</Modal.Footer>
    </Modal>

<Modal show={showDeleteConfirmation} onHide={handleCloseDeleteConfirmation} centered>
<Modal.Header closeButton>
  <Modal.Title>Confirm Delete</Modal.Title>
</Modal.Header>
<Modal.Body>
  Are you sure you want to delete this pet?
</Modal.Body>
<Modal.Footer>
  <Button variant="secondary" onClick={handleCloseDeleteConfirmation}>
    Cancel
  </Button>
  <Button variant="danger" onClick={handleConfirmDelete}>
    Delete
  </Button>
</Modal.Footer>
</Modal>
</>

    
  );
};

export default PetModal;
