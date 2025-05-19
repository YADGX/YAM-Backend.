// doctor-api.js
import sendRequest from "./sendRequest";
const url = "/doctors/";

export async function signup(formData) {
    try {
        // التسجيل فقط، لا نخزن توكن لأن التسجيل يحتاج مراجعة
        const response = await sendRequest(`${url}signup/`, "POST", formData);
        return response; // نرجع رد السيرفر ليتم التعامل معه في الواجهة
    } catch (err) {
        console.error("Error during doctor signup:", err);
        return null;
    }
}

export async function login(formData) {
    try {
        const response = await sendRequest(`${url}login/`, "POST", formData);
        // نخزن التوكن عند تسجيل الدخول الناجح
        localStorage.setItem('token', response.access);
        return response.user;
    } catch (err) {
        localStorage.removeItem('token');
        console.error("Error during doctor login:", err);
        return null;
    }
}

export function logout() {
    localStorage.removeItem('token');
}

export async function getDoctor() {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            const response = await sendRequest(`${url}token/refresh/`);
            localStorage.setItem('token', response.access);
            return response.user;
        }
        return null;
    } catch (err) {
        console.error("Error fetching doctor data:", err);
        return null;
    }
}
