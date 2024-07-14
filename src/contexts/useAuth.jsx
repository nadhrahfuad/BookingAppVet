// useAuth.js
import { useContext } from 'react';
import AuthContext from './AuthContext';

const useAuth = () => {
  const { auth, setAuth } = useContext(AuthContext);
  
  return { auth, setAuth };
};

export default useAuth;
