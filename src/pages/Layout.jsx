import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import { NavLink, Outlet } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faRightFromBracket} from "@fortawesome/free-solid-svg-icons";
import Placeholder from "../assets/placeholder.jpg"
import PlaceholderAdmin from "../assets/PlaceholderAdmin.png"
import PlaceholderOwner from "../assets/PlaceholderOwner.jpg"




const Layout = () => {
  const { auth, logout } = useContext(AuthContext);

  
  return (
    <>
      <Navbar bg="light" variant="light" expand="lg" >
        <Container>

              <Navbar.Brand className= "ml-3" as={NavLink} to={`/${auth.role}/${auth.id}/profile`}>
              {auth.role === 'petowner' && (
    <img
      src={PlaceholderOwner}
      alt="Pet Owner Profile"
      style={{
        width: '50px',
        height: '50px',
        borderRadius: '50%', 
        objectFit: 'cover', 
        border: 'solid black'
      }}
    />
  )}
  {auth.role === 'admin' && (
    <img
      src={PlaceholderAdmin}
      alt="Admin Profile"
      style={{
        width: '50px',
        height: '50px',
        borderRadius: '50%', 
        objectFit: 'cover', 
        border: 'solid black'
      }}
    />
  )}
  {auth.role === 'vet' && (
    <img
      src={Placeholder}
      alt="Vet Profile"
      style={{
        width: '50px',
        height: '50px',
        borderRadius: '50%', 
        objectFit: 'cover', 
        border: 'solid black'
      }}
    />
  )}
              </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav "  className="ml-auto"/>



            <Navbar.Collapse id="basic-navbar-nav"  className="justify-content-center">
                    <Nav className="d-flex me-auto align-items-center justify-content-center">
              
                    {(auth.role === "petowner") && (
                      <>
                    <Nav.Link as={NavLink} to={`/${auth.role}/${auth.id}/viewvets`} >
                      Book
                    </Nav.Link>
                    <Nav.Link as={NavLink} to={`/${auth.role}/${auth.id}/viewpets`} >
                      Manage Pets
                    </Nav.Link>
                    </>
                    
                    )}
              
                  {(auth.role==="admin")&&(
                  <Nav.Link as={NavLink} to={`/${auth.role}/${auth.id}/manageusers`} >
                    Manage Users
                  </Nav.Link>
                  )}

                    <Nav.Link as={NavLink} to={`/${auth.role}/${auth.id}/manage`} >
                      Manage Appointments
                    </Nav.Link>
              </Nav>
              <Nav>

                    <Nav.Link className="d-flex justify-content-center" onClick={logout}>
                     <Button variant = "none">
                    <FontAwesomeIcon className = "fa-lg"icon={faRightFromBracket}/>
                     </Button>
                    </Nav.Link>
              </Nav>

              
          </Navbar.Collapse>

        </Container>
      </Navbar>
      <Outlet />
    </>
  );
};

export default Layout;
