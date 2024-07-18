import { Col, Container, Row } from "react-bootstrap";
import NavBarGuest from "../components/NavBarGuest";

import VetGif from "../assets/vet.gif"
import HeartGif from "../assets/heart.gif"
import Footer from "../components/Footer";

const LandingPage = () => {
  return (
    <>
    <NavBarGuest />

    <div className="d-flex justify-content-center align-items-center" style={{ marginTop: "100px"}}>
      <Container fluid="sm" className="p-3" style={{minHeight: "80vh", position: "relative" }}>
      <Container  style={{ backgroundColor: "rgba(211, 211, 211, 0.8)", borderRadius: "50px", paddingBottom:"15px"}}>
        <Row className="justify-content-center align-items-center">
          <Col md={6} className="text-center mb-3 mb-md-0">
            <img src={VetGif} className="img-fluid" alt="Vet Gif" />
          </Col>
          <Col md={6} className="text-center">
            <div className="mb-3">
              <h2> &quot;Your Pet&apos;s Health, Our Priority: Scheduling Appointments Just Got Easier!&quot;</h2>
            </div>


      
            <b className="text-muted">
              Receive only the finest medical service for your pets&nbsp;
              <img src={HeartGif} alt="Heart Gif" style={{ height: "35px", marginTop:"-5px" }} />
            </b>


          </Col>
        </Row>
        
      </Container>
      </Container>
    </div>
    <Footer/>
  </>
);
};

export default LandingPage;

