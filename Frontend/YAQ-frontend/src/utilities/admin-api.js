import sendRequest from './sendRequest';

const url = '/admin/';

export async function getDoctorRequests() {
  try {
    return await sendRequest(`${url}doctor-requests/`, 'GET');
  } catch (error) {
    console.error('Error fetching doctor requests:', error);
    throw error;
  }
}

export async function acceptDoctorRequest(doctorId) {
  try {
    return await sendRequest(`${url}accept-doctor/${doctorId}/`, 'PUT');
  } catch (error) {
    console.error('Error accepting doctor request:', error);
    throw error;
  }
}

export async function declineDoctorRequest(doctorId) {
  try {
    return await sendRequest(`${url}decline-doctor/${doctorId}/`, 'PUT');
  } catch (error) {
    console.error('Error declining doctor request:', error);
    throw error;
  }
}
