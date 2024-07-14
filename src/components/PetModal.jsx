import { Modal, Button, Form } from 'react-bootstrap';
import Dog from "../assets/dog.jpeg"
import { useState } from 'react';

const PetModal = ({ selectedPet, show, handleClose }) => {
  
  const [isEditMode, setIsEditMode] = useState(false);

  const handleEditClick = ()=>{
    setIsEditMode(prevEditMode => !prevEditMode);
  }


  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static">

      <Modal.Header className='d-flex align-text-center'closeButton>
        
      </Modal.Header>

      <Modal.Body >
      <div>
        <h3 className='text-center' ></h3>
        
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
      <div className ="container mt-4 " style={{ display: 'flex', justifyContent: 'center' }} >
      <Form className="form-container" style={{ maxWidth: '600px', width: '80%' }} >
      <Form.Group controlId="formPetName" >
              <Form.Label><strong>Name</strong></Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={selectedPet && selectedPet.name}
                // onChange={handleInputChange}
                disabled={!isEditMode}
              className='text-center'/>
            </Form.Group>
            <Form.Group controlId="formPetName">
              <Form.Label className='mt-2'><strong>Breed</strong></Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={selectedPet && selectedPet.breed}
                // onChange={handleInputChange}
                disabled={!isEditMode}
                className='text-center'
              />
            </Form.Group> <Form.Group controlId="formPetName">
              <Form.Label className='mt-2'><strong>Allergies</strong></Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={selectedPet && selectedPet.allergies}
                // onChange={handleInputChange}
                disabled = {!isEditMode}
                className='text-center'
              />
            </Form.Group> <Form.Group controlId="formPetName">
              <Form.Label className='mt-2'><strong>Health Conditions</strong></Form.Label>
              <Form.Control
                as="textarea"
                rows={3} 
                name="name"
                value={selectedPet && selectedPet.healthConditions}
                // onChange={handleInputChange}
                disabled={!isEditMode}
                className='text-center'
              />
            </Form.Group>
            
        {/* <p>Name: {selectedPet && selectedPet.name}</p>
        <p>Birthday: {selectedPet && selectedPet.birthday}</p>
        <p>Species: {selectedPet && selectedPet.species}</p>
        <p>Breed: {selectedPet && selectedPet.breed}</p>
        <p>Allergies: {selectedPet && selectedPet.allergies}</p>
        <p>Health Conditions: {selectedPet && selectedPet.healthConditions}</p> */}
        </Form>
        </div>
      </Modal.Body>
      <Modal.Footer>

      {isEditMode ? (
          <Button variant="primary" onClick={handleEditClick} className="me-2 ">
            Save Changes
          </Button>
        ) : (
          <Button variant="info" onClick={handleEditClick} className="me-2">
            Edit
          </Button>
        )}

        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PetModal;
