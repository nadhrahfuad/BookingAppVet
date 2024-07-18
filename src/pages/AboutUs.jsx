import { Container, Row, Col } from 'react-bootstrap';
import NavBarGuest from '../components/NavBarGuest';
import Footer from '../components/Footer';
import Founder from "../assets/founder.png";
import "../css/custom.css"


function AboutUs() {
  return (
    <>
      <NavBarGuest />
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Container className='py-5'>
        <h2 className=" mb-4 text-center">About Us</h2>
          <Container className='py-3 px-4' style={{ backgroundColor: "rgba(211, 211, 211, 0.8)", borderRadius: "50px" }}>
          
            <Row className="justify-content-center align-items-center">
              <Col md={6} className="text-center mb-4 mb-md-0">
                <img
                  src={Founder}
                  alt="Founder"
                  className="founder-image"
                />
              </Col>
              <Col md={6}>
                <div className='d-flex flex-column align-items-center'>
                  <p>
                    Welcome to PetCare Appointments, your dedicated platform for convenient and reliable pet healthcare scheduling. Founded in 2024 by Dr. Emily Johnson, PetCare Appointments was born out of a passion for enhancing the well-being of pets and simplifying the lives of pet owners.
                  </p>
                  <p>
                    At PetCare Appointments, we understand that your pet&apos;s health is paramount. Our mission is to provide seamless access to top-quality veterinary care through an easy-to-use online platform. Whether it&apos;s routine check-ups, vaccinations, or specialized treatments, we&apos;re committed to ensuring your furry friends receive the best possible care.
                  </p>
                  <p>
                    Dr. Emily Johnson, a seasoned veterinarian with over 15 years of experience, leads our team of dedicated professionals. Her vision of creating a user-friendly platform where pet owners can effortlessly book appointments has transformed into PetCare Appointments – a trusted name in pet healthcare.
                  </p>
                  <p>
                    Join thousands of satisfied pet owners who rely on PetCare Appointments for their pet&apos;s medical needs. We&apos;re here to support you every step of the way in prioritizing your pet&apos;s health.
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </Container>
        <Footer style={{ marginTop: 'auto' }} />
      </div>
    </>
  );
}

export default AboutUs;
