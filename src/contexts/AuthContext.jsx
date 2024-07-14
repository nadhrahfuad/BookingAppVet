import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = sessionStorage.getItem('token');
    const role = sessionStorage.getItem('role');
    const id = sessionStorage.getItem('id');
    const firstname = sessionStorage.getItem('name');
    // const navigate = useNavigate();

    return {
      isAuthenticated: token ? true : false,
      token: token || null,
      role: role || null,
      id: id || null,
      firstname: firstname || "guest"
    };
  });

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const role = sessionStorage.getItem('role');
    const id = sessionStorage.getItem('id');
    const firstname = sessionStorage.getItem('firstname')

    console.log("CONTEXT")
    console.log(token, role, id, firstname)
  

    setAuth({
      isAuthenticated: token ? true : false,
      token: token || null,
      role: role || null,
      id: id || null,
      firstname: firstname || "guest"
    });
  }, []);

    const logout = () => {
      setAuth({})
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('role');
      sessionStorage.removeItem('id');
      sessionStorage.removeItem('firstname');
      // navigate('/login'); 

      console.log('User logged out');
    };

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
