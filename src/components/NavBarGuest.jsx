import { Container, Nav, Navbar } from "react-bootstrap"
import { NavLink } from "react-router-dom"

function NavBarGuest() {
    return (
        <Navbar bg="light" variant="light" expand="lg">
          <Container>
            <Navbar.Brand as={NavLink} to={`/`} className="ml-3">

            </Navbar.Brand>
    
            <Navbar.Toggle aria-controls="basic-navbar-nav" className="ml-auto" />
    
            <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
              <Nav className="me-auto align-items-center">
                <Nav.Link as={NavLink} to={`/`} >
                  Home
                </Nav.Link>
                <Nav.Link as={NavLink} to={`/aboutus`} >
                  About Us
                </Nav.Link>
                <Nav.Link as={NavLink} to={`/contactus`} >
                  Contact Us
                </Nav.Link>
              </Nav>
    

              <Nav className="align-items-center">
                <Nav.Link as={NavLink} to={`/signup`} className="ml-2">
                  Sign Up
                </Nav.Link>
                <Nav.Link as={NavLink} to={`/login`} className="ml-2">
                  Log In
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      );
    }
    

export default NavBarGuest