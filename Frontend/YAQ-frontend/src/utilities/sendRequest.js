export default async function sendRequest(url, method = 'GET', body = null, token = null) {
  const options = { method };

  options.headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(`http://localhost:8000${url}`, options);
    if (res.ok) {
      return await res.json();
    } else {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Request failed');
    }
  } catch (err) {
    console.error(err, 'error in send-request');
    throw err;
  }
}
