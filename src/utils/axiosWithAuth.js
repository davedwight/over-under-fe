import axios from "axios";
const SERVER_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

export const axiosWithAuth = () => {
    console.log("inside axios with auth");
    const token = localStorage.getItem("token");
    return axios.create({
        baseURL: SERVER_BASE_URL,
        headers: {
            Authorization: token,
        },
    });
};
