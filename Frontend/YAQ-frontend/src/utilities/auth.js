import sendRequest from './sendRequest';

export async function login(credentials) {
  const response = await sendRequest("/auth/login", "POST", credentials);
  if (response.token) {
    localStorage.setItem("token", response.token);
  }
  return response;
}

export function logout() {
  localStorage.removeItem("token");
}

export function getToken() {
  return localStorage.getItem("token");
}

export function isLoggedIn() {
  return !!getToken();
}
