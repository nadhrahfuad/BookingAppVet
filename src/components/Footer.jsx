import { Container } from 'react-bootstrap';

function Footer() {
  return (
    <footer className="bg-dark text-light py-3 mt-auto">
      <Container>
        <div className="d-flex justify-content-between align-items-center">
          <div style={{ marginLeft: "10px" }}>
            <p className="mb-1" style={{ fontSize: "13px" }}>Eastern Paws Veterinary Hospital</p>
            <p className="mb-1" style={{ fontSize: "13px" }}>789 Whisker Avenue,</p>
            <p className="mb-1" style={{ fontSize: "13px" }}>Meowtown, Tokyo 67890</p>
          </div>
          <div className="text-right">
            <p className="mb-0" style={{ fontSize: "13px" }}> &copy; 2024 | All Rights Reserved </p>
            <p className="mb-0" style={{ fontSize: "13px" }}>Contact: +81 90 1234 5678</p> 
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
