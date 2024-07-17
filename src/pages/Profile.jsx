import { useState, useEffect } from 'react';
import axios from 'axios';
import useAuth from '../contexts/useAuth';
import AvailabilityForm from '../components/SetAvailability';
import { Button, Modal, Form, Alert} from 'react-bootstrap';
import SetAvailability from '../components/SetAvailability';


const UserProfile = () => {
  const {auth, setAuth} = useAuth()
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [showAvailabilityForm, setShowAvailabilityForm] = useState(false)
 const BASE_URL = process.env.REACT_APP_BASE_URL;

 



  const [formData, setFormData] = useState({
    profile_picture_url: '',
    firstname: '',
    lastname: '',
    email: '',
    phone_number: '',
    bio: '',
    specialization: '',
    license_number: '',
    enabled: false,
  });
-
  // const[photoFile, setPhotoFile] = useState(null);




  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/${auth.role}/${auth.id}/profile`);
        setFormData(response.data);
        
        setFormData({
          profile_picture_url: response.data.profile_picture_url || '',
          firstname: response.data.firstname || '',
          lastname: response.data.lastname || '',
          email: response.data.email || '',
          phone_number: response.data.phone || '',
          bio: response.data.bio || '',
          specialization: response.data.specialization || '',
          license_number: response.data.license_number || '',
          enabled: response.data.enabled || false,
        });
        console.log("Profile details retrieved successfully")
        console.log(response.data)
      } catch (error) {
if(error.respone){
  setError(error.response.data.messaage)
  console.error('Error:', error.response.data)
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
      fetchUserData();
    }
  }, [BASE_URL, auth]);

  const handleEditClick = ()=>{
    setIsEditMode(prevEditMode => !prevEditMode);
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      const selectedFile = files[0];
      setFormData({
        ...formData,
        [name]: selectedFile,
      });


      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      if (selectedFile) {
        reader.readAsDataURL(selectedFile);
      } else {
        setPhotoPreview(null);
      }
    } else {
      const newValue = type === 'checkbox' ? checked : value;
      setFormData({
        ...formData,
        [name]: newValue,
      });
    }
  };

  const clearError = () => {
    setError(null);
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setError(null);
    }, 5000); 
  
  
    return () => clearTimeout(timer);
  }, [error]); 
  

  const toggleAvailability = () =>{
    setShowAvailabilityForm(!showAvailabilityForm)
  }

  const handleSaveChange = async () => {

    try {
      await axios.patch(`${BASE_URL}/${auth.role}/${auth.id}/profile`, formData);
      setIsEditMode(false);
      console.log('Profile updated successfully')
      console.log(formData)
    } catch (error) {
      console.log("Failed to update account")
      if (error.response) {
        setError(error.response.data.message); 
        console.error('Update error:', error.response.data);
      } else if (error.request) {
        setError('Network error. Please try again later.');
        console.error('Network error:', error.request);
      } else {
        setError('An unexpected error occurred. Please try again.');
        console.error('Unexpected error:', error.message);
      }
      console.log('Error updating user profile:', error);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () =>
    {
      try {
        await axios.delete(`${BASE_URL}/${auth.role}/${auth.id}/profile`)
        setAuth({})
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('role');
        sessionStorage.removeItem('id');
        sessionStorage.removeItem('firstname');   
        console.log('Account deleted!');
  
      } catch (error) {
        console.log("Unable to delete account")
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
        setShowDeleteModal(false)
      }

    }

    const handleCancelDelete = () =>{
      setShowDeleteModal(false)
    }

    const handleRemovePhoto = () => {
      setFormData({
        ...formData,
        photo: null, 
      });
      setPhotoPreview(null); 
    };

    return(
      <div className ="container mt-2"  style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Form className="form-container" style={{ maxWidth: '400px', margin: '0 auto', backgroundColor:"rgba(211, 211, 211, 0.8)", padding:"20px", borderRadius: "30px" }}>
      {error &&  <Alert className="text-center mt-4" variant="danger" onClose={clearError} >
{error}
</Alert>}
        
        <Form.Group controlId="formPicture">
          <Form.Label className="mt-3">Profile Photo</Form.Label>
          <Form.Control
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleInputChange}
            disabled={!isEditMode}
          />
          {photoPreview && (
            <div  className="mt-3"style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div>
            <img
             src={photoPreview}
             alt="Profile Preview"
             style={{
              width: '200px',
              height: '200px',
              objectFit: 'cover', 
              borderRadius: '50%', 
             }}
           />
           </div>
           <div>
            {isEditMode && photoPreview&&(
            <Button className="mt-2" variant="danger" onClick={handleRemovePhoto} 
            >
            Remove Photo
          </Button>
          )}
          </div>
          </div>
          
          )}
        </Form.Group>
        


          <Form.Group controlId = "formFirstName">
          <Form.Label className="mt-3">
            {auth.role === 'admin' ? 'Name' : 'First Name'}
          </Form.Label>
            <Form.Control 
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange = {handleInputChange}
            disabled = {!isEditMode}

            />
          </Form.Group>
          
          {(auth.role !== "admin" && 
          <Form.Group controlId = "formLastName">
            <Form.Label className="mt-3">Last Name</Form.Label>
            <Form.Control 
            type="text"
            name="lastname"
            value={formData.lastname}
            placeholder= "Enter last name"
            onChange = {handleInputChange}
            disabled = {!isEditMode}

            />
          </Form.Group>
          )}
          <Form.Group controlId = "formEmail">
            <Form.Label className="mt-3">Email</Form.Label>
            <Form.Control 
            type="text"
            name="email"
            value={formData.email}
            placeholder= "Enter email"
            onChange = {handleInputChange}
            disabled = {!isEditMode}

            />
            
          </Form.Group>

          {auth.role !== "admin" && (
          <Form.Group controlId = "formPhoneNumber">
            <Form.Label className="mt-3">Phone Number</Form.Label>
            <Form.Control 
            type="text"
            name="phone_number"
            value={formData.phone_number}
            placeholder= "Enter phone number"
            onChange = {handleInputChange}
            disabled = {!isEditMode}
          
            />
            
          </Form.Group>
          )}
          {(auth.role === "vet")&&(
            <>
          <Form.Group controlId = "formBio">
            <Form.Label className="mt-3">Bio</Form.Label>
            <Form.Control 
             as="textarea"
             rows={3}
             name="bio"
             value={formData.bio}
             placeholder="Enter your bio"
             onChange={handleInputChange}
             disabled={!isEditMode}

            />
          </Form.Group>
          <Form.Group controlId = "formSpecialization">
            <Form.Label className="mt-3">Specialisation</Form.Label>
            <Form.Control 
            type="text"
            name="specialization"
            value={formData.specialization}
            placeholder= "Enter specialisation"
            onChange = {handleInputChange}
            disabled = {!isEditMode}

            />
          </Form.Group>
    <Form.Group controlId = "license_number">
            <Form.Label className="mt-3">License Number</Form.Label>
            <Form.Control 
            type="text"
            name="license_number"
            value={formData.license_number}
            placeholder= "Enter license number"
            onChange = {handleInputChange}
            disabled = {!isEditMode}

            />
          </Form.Group>
          
          <Form.Group controlId = "enabled" className="mt-2 me-2 d-flex justify-content-end">
            <Form.Check 
            type="checkbox"
            label ={<span style={{ fontWeight: 'bold',  padding: '5px 10px', borderRadius: '5px', opacity:"0.9"  }}>Authorised</span>}
          
            name="enabled"
            checked={formData.enabled}
            readOnly
            />
          </Form.Group>
          
          </>
          )}
         
         

        
         <div className="d-flex justify-content-center mt-4 mb-4">

  {auth.role === 'vet' && (
    <Button onClick={toggleAvailability} className="btn btn-primary me-2">
      Add Availability
    </Button>
  )}

  <div className="ms-auto"> 
    {isEditMode ? (
      <Button variant="primary" onClick={handleSaveChange} className="btn btn-primary me-2">
        Save
      </Button>
    ) : (
      <Button variant="info" onClick={handleEditClick} className="me-2">
        Edit
      </Button>
    )}

    <Button variant="danger" onClick={handleDeleteClick}>
      Delete
    </Button>
  </div>
</div>
 
  
        {/* </div> */}
      </Form>

      

      {auth.role === "vet" && (

            <Modal show={showAvailabilityForm} onHide={toggleAvailability} centered>
            <Modal.Body closeButton>
              <AvailabilityForm />
            </Modal.Body>
            </Modal>


      )}



      {showDeleteModal &&(

      <Modal show={showDeleteModal} onHide={handleCancelDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete your account?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      )}
      </div>
    )
  

}

export default UserProfile;
