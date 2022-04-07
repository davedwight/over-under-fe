import axios from "axios";
const SERVER_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

export const axiosWithAuth = () => {
    const token = localStorage.getItem("token");
    const response = axios.create({
        baseURL: SERVER_BASE_URL,
        headers: {
            Authorization: token,
        },
    });
    return response;
};
