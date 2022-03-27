import axios from "axios";

export const axiosWithAuth = () => {
    console.log("inside axios with auth");
    const token = localStorage.getItem("token");
    return axios.create({
        baseURL: "http://localhost:9000/api",
        // baseURL: "https://over-under-vote.herokuapp.com/api",
        headers: {
            Authorization: token,
        },
    });
};
