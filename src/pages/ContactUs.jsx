import { useState } from 'react';
import axios from 'axios';
import NavBarGuest from '../components/NavBarGuest';
import Footer from '../components/Footer';
import { Button, Form } from 'react-bootstrap';

function ContactUs() {
    
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${BASE_URL}/contactus`, formData);

      console.log('Response from backend:', response.data);

      setFormData({
        name: '',
        email: '',
        message: ''
      });

      console.log('Message sent successfully!');
    } catch (error) {
      console.error('Error:', error);
      console.log('Failed to send message. Please try again later.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <NavBarGuest/>
    <div className='d-flex justify-items-center align-items-center flex-column'>
    <h2 className="mt-5 mb-4 text-center">Contact Us</h2>
      <Form className="form-container" onSubmit={handleSubmit} style={{ backgroundColor:"rgba(211, 211, 211, 0.8)", padding:"20px", borderRadius: "30px", width: '80%', maxWidth: '500px' }}>
      <Form.Group controlId="formName">
          <Form.Label>Name:</Form.Label>
          <Form.Control 
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formEmail">
          <Form.Label>Email:</Form.Label>
          <Form.Control 
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formMessage">
          <Form.Label>Message:</Form.Label>
          <Form.Control 
            as="textarea"
            rows={3}
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
          ></Form.Control >
        </Form.Group>
        <Button type="submit">Submit</Button>
      </Form>
    </div>

    <Footer style={{ marginTop: 'auto' }} />

    </div>
  );
}

export default ContactUs;
