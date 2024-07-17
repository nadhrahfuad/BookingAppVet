import { useEffect, useState } from 'react';
import { Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate,  Link } from 'react-router-dom';
import useAuth from '../contexts/useAuth';
import CustomButton from '../components/CustomButton';

const LoginForm = () => {
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { setAuth } = useAuth();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  console.log(process.env.REACT_APP_BASE_URL);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      const response = await axios.post(`${BASE_URL}/login`, {
        email,
        password,
      });

      const { token, role, id, firstname } = response.data;

      console.log(response)

      sessionStorage.setItem('token', token);
      sessionStorage.setItem('role', role);
      sessionStorage.setItem('id', id);
      sessionStorage.setItem('firstname', firstname);

      setAuth({ isAuthenticated: true, token, role, id, firstname });

      navigate(`/${role}/${id}/profile/`);
      console.log("User logged in")
      
    } catch (error) {
      console.log("Login failed")
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
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <Form onSubmit={handleLogin}>
            <h2 className="text-center mb-4">Login</h2>

            {error &&  <Alert className="text-center mt-4" variant="danger" onClose={clearError} >
              {error}
              </Alert>}



            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mt-2" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>


          


              <div className="d-flex justify-content-center mt-4">
            <CustomButton variant="primary" type="submit" className="w-100">
              Login
            </CustomButton>
            </div>
            <p className="mt-3 text-center">
              Don&apos;t have an account? <Link to="/signup">Sign up</Link>
            </p>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
