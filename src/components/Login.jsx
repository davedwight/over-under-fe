import React, { useEffect, useState } from "react";
import { axiosWithAuth } from "../utils/axiosWithAuth";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import "../styles/Login.css";

const Login = () => {
    const token = localStorage.getItem("token");
    let { primary_response_id } = useParams();
    const intPrimaryResponseId = parseInt(primary_response_id);

    const [login, setLogin] = useState({
        phone_number: "",
    });

    const [error, setError] = useState("");

    let navigate = useNavigate();

    useEffect(() => {
        if (token && primary_response_id) {
            navigate(`/vote/${intPrimaryResponseId}`);
        } else if (token) {
            navigate("/vote");
        }
    }, []);

    const handleChange = (e) => {
        setLogin({
            ...login,
            [e.target.name]: e.target.value,
        });
    };

    const submitHandler = (e) => {
        e.preventDefault();

        console.log("login info before submit", login);

        axiosWithAuth()
            .post("/users", login)
            .then((res) => {
                console.log(res);
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("user_id", res.data.user_id);
                if (primary_response_id) {
                    navigate(`/vote/${primary_response_id}`);
                } else {
                    navigate("/vote");
                }
            })
            .catch((err) => console.error("didn't work", err));
    };

    return (
        <div className="login">
            <form className="login-form" onSubmit={submitHandler}>
                <label className="phone-textbox">
                    <input
                        className="input"
                        type="tel"
                        name="phone_number"
                        value={login.phone_number}
                        onChange={handleChange}
                    />
                </label>
            </form>
        </div>
    );
};

export default Login;
