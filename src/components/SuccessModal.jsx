import { useEffect } from 'react';
import { Modal } from 'react-bootstrap';

const SuccessModal = ({ message, onCancel }) => {

    useEffect(() => {
        const timer = setTimeout(() => {
          onCancel(); 
        }, 5000);

        return () => clearTimeout(timer);
      }, [onCancel]);



  return (
    <Modal show={true} onHide={onCancel} backdrop = "static">
      <Modal.Header closeButton>
        <Modal.Title>Success</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
    </Modal>
  );
};

export default SuccessModal;
