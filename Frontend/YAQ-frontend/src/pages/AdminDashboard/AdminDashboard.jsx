import React, { useState, useEffect } from 'react';
import { getDoctorRequests } from '../../utilities/admin-api'; // API call to fetch doctor requests
import { acceptDoctorRequest, declineDoctorRequest } from '../../utilities/admin-api'; // API calls for accepting/declining
import './AdminDashboard.css';

function AdminDashboard() {
  const [doctorRequests, setDoctorRequests] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDoctorRequests();
  }, []);

  const fetchDoctorRequests = async () => {
    try {
      const requests = await getDoctorRequests(); // Fetch the pending doctor requests
      setDoctorRequests(requests);
    } catch (error) {
      setError('Error fetching doctor requests');
    }
  };

  const handleAcceptRequest = async (doctorId) => {
    try {
      await acceptDoctorRequest(doctorId); // Accept the doctor registration
      fetchDoctorRequests(); // Refresh the list of requests
    } catch (error) {
      setError('Error accepting the request');
    }
  };

  const handleDeclineRequest = async (doctorId) => {
    try {
      await declineDoctorRequest(doctorId); // Decline the doctor registration
      fetchDoctorRequests(); // Refresh the list of requests
    } catch (error) {
      setError('Error declining the request');
    }
  };

  return (
    <div>
      <h2>Doctor Registration Requests</h2>
      {error && <p>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Specialization</th>
            <th>SCFHS Certificate ID</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctorRequests.map((request) => (
            <tr key={request.id}>
              <td>{request.username}</td>
              <td>{request.email}</td>
              <td>{request.specialization}</td>
              <td>{request.scfhsCertId}</td>
              <td>{request.status}</td>
              <td>
                <button onClick={() => handleAcceptRequest(request.id)}>Accept</button>
                <button onClick={() => handleDeclineRequest(request.id)}>Decline</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
