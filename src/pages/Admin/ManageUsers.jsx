import { useEffect, useState } from "react";
import { Button, Table, Modal, Badge } from "react-bootstrap";
import useAuth from "../../contexts/useAuth";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faToggleOn, faToggleOff, faEye} from "@fortawesome/free-solid-svg-icons";

const ManageUsers = () => {
  const { auth } = useAuth();
  const [userList, setUserList] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

 const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/${auth.role}/${auth.id}/manageusers`);
        setUserList(response.data);
        console.log("Users restrieved successfully")
      } catch (error) {
        console.log("Failed to retrieve users list")
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

    if (auth.isAuthenticated) {
      fetchUserList();
    }
  }, [BASE_URL, auth]);

  const handleToggleEnable = async (userId, currentEnabledState) => {

    try {
      const updatedEnabledState = !currentEnabledState;

      setUserList(prevUserList => {
        return prevUserList.map(user => {
          if (user.user_id === userId) {
            return { ...user, enabled: updatedEnabledState };
          }
          return user;
          
        });
        
      });

      const enableResponse = await axios.patch(`${BASE_URL}/${auth.role}/${auth.id}/toggle`, {
        enabled: updatedEnabledState.toString(),
        userId: userId
      });

      console.log("PATCH response:", enableResponse.data);
      console.log('User authorisation updated successfully');

    } catch (error) {
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

      setUserList(prevUserList => {
        return prevUserList.map(user => {
          if (user.user_id === userId) {
            return { ...user, enabled: currentEnabledState };
          }
          return user;
        });
      });
    }
  };

  const handleViewDetails = async (userId) => {
    console.log("ID", userId)
    try {
      const response = await axios.get(`${BASE_URL}/${auth.role}/${auth.id}/${userId}/profile`);
      setSelectedUser(response.data);
      console.log(response.data)
      setShowModal(true);
      console.log('Profile details retrieved successfully');
      console.log(response.data)
    } catch (error) {
      console.log("Failed to retrieve profile details")
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

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setError(null); 
  };

  return (
    <div className="p-4 mt-5">
      {/* <h2>Manage Users</h2>
      {error && <p>{error}</p>}
      <Table striped bordered hover> */}
      <table className="custom-table " id="CustomTable">
      <thead className="table-heading">
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Email</th>
            <th>Enabled</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userList.map((userInList) => (
            <tr key={userInList.user_id}>
              <td>{userInList.firstname} {userInList.lastname}</td>
              <td>{userInList.role}</td>
              <td>{userInList.email}</td>
              <td>{userInList.enabled ? (
                <Badge bg="success">Enabled</Badge>
              ) : (
                <Badge bg="danger">Disabled</Badge>
              )}</td>
              <td>
                <Button variant="none" onClick={() => handleToggleEnable(userInList.user_id, userInList.enabled)}>
                  {userInList.enabled ? 
                   <FontAwesomeIcon icon={faToggleOn}/> : 
                   <FontAwesomeIcon icon={faToggleOff}/>
                  }
                </Button>
                <Button variant="none" onClick={() => handleViewDetails(userInList.user_id)}>
                <FontAwesomeIcon icon={faEye}/> 
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

  
      <Modal show={showModal} onHide={handleCloseModal} centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div>
              <p><strong>Name:</strong> {selectedUser.firstname} {selectedUser.lastname}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Phone:</strong> {selectedUser.phone}</p>
    

                {selectedUser.role === "vet" && (
                  <>
                <p><strong>Specialisation:</strong> {selectedUser.specialization}</p>
                <p><strong>License No.:</strong> {selectedUser.license_number}</p>
                <p><strong>Bio:</strong> {selectedUser.bio}</p>
                </>
                )}



            </div>
          )}
          {error && <p>{error}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageUsers;
