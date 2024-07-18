// REDREDEDEDED
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../contexts/useAuth';
import { FormGroup, FormLabel, FormControl, Alert, Form } from 'react-bootstrap';
import CustomButton from '../components/CustomButton';
import Footer from '../components/Footer';
import NavBarGuest from '../components/NavBarGuest';

const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [firstname, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { setAuth } = useAuth();

 const BASE_URL = process.env.REACT_APP_BASE_URL;
  let endpoint = BASE_URL

  console.log(location.pathname)

  if (location.pathname.endsWith("/vet")){
    endpoint = `${BASE_URL}/signup/vet`
  }else if(location.pathname.endsWith("/admin")){
    endpoint = `${BASE_URL}/signup/admin`
  }else if(location.pathname.endsWith("/signup")){
    endpoint = `${BASE_URL}/signup`
  }



  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${endpoint}`, {
        firstname,
        email,
        password,
      });

      console.log(response)

      const { token, role, id, firstname: firstNameResponse } = response.data;

      sessionStorage.setItem('token', token);
      sessionStorage.setItem('role', role);
      sessionStorage.setItem('id', id);
      sessionStorage.setItem('firstname', firstNameResponse);

      setAuth({ isAuthenticated: true, token, role, id, firstname: firstNameResponse });

      navigate(`/login`);
      console.log("User signed up")
    } catch (error) {
      console.log("Sign up failed")
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


  const clearError = () => {
    setError(null);
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setError(null);
    }, 5000); 
  
  
    return () => clearTimeout(timer);
  }, [error]); 

  return (
    <>
    
     <NavBarGuest/>
     <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <Form onSubmit={handleSignUp}>
            <h2 className="text-center mb-4">Sign Up</h2>

            <FormGroup className="mt-2" controlId="firstname">
              <FormLabel >Name</FormLabel>
              <FormControl
                type="text"
                placeholder="Enter name"
                value={firstname}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </FormGroup>

            <FormGroup className="mt-2" controlId="email">
              <FormLabel>Email</FormLabel>
              <FormControl
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormGroup>

            <FormGroup className="mt-2" controlId="password">
              <FormLabel>Password</FormLabel>
              <FormControl
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FormGroup>

            {error &&  <Alert className="text-center mt-4" variant="danger" onClose={clearError} >
{error}
</Alert>}

            <div className="d-flex justify-content-center mt-4">
            <CustomButton>
              Sign up
            </CustomButton>
            </div>
       <p className="mt-3 text-center">
           Already have an account? <Link to="/login">Login</Link>
       </p>
            
          </Form>
        </div>
      </div>
    </div>
    <Footer style={{ marginTop: 'auto' }} />
    </div>
    </>
  );
};

export default SignUp;
