import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import OtpInput from "react-otp-input";
import { checkVerification } from "../api/verify";
import axios from "axios";
import "../styles/Otp2.css";
const SERVER_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

const initialState = {
    otp: "",
    numInputs: 6,
    separator: "",
    isDisabled: false,
    hasErrored: false,
    isInputNum: false,
    isInputSecure: false,
    minLength: 0,
    maxLength: 40,
    placeholder: "",
    errMessage: "",
};

function Otp2() {
    let navigate = useNavigate();
    let { phone_number } = useParams();
    console.log("phone number from useParams", typeof phone_number);

    const [state, setState] = useState(initialState);

    const handleOtpChange = (otp) => {
        setState({ ...state, otp });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("phone number", phone_number);
        console.log("state.otp", state.otp);
        checkVerification(phone_number, parseInt(state.otp)).then(
            (response) => {
                if (!response.success) {
                    setState({
                        ...state,
                        hasErrored: true,
                        errMessage: response.message,
                    });
                } else {
                    axios
                        .post(`${SERVER_BASE_URL}/users`, { phone_number })
                        .then((res) => {
                            console.log(res);
                            localStorage.setItem("token", res.data.token);
                            localStorage.setItem("user_id", res.data.user_id);
                            navigate("/vote");
                        })
                        .catch((err) =>
                            console.error("error adding user", err)
                        );
                }
            }
        );
    };

    return (
        <div className="container">
            <div className="view">
                <div className="card">
                    <form onSubmit={handleSubmit}>
                        <p>Enter verification code</p>
                        <div className="margin-top--small">
                            <OtpInput
                                inputStyle="inputStyle"
                                numInputs={state.numInputs}
                                isDisabled={state.isDisabled}
                                hasErrored={state.hasErrored}
                                errorStyle="error"
                                onChange={handleOtpChange}
                                separator={<span>{state.separator}</span>}
                                isInputNum={state.isInputNum}
                                isInputSecure={state.isInputSecure}
                                shouldAutoFocus
                                value={state.otp}
                                placeholder={state.placeholder}
                            />
                        </div>
                        <button
                            className="btn margin-top--large"
                            disabled={state.otp.length < state.numInputs}
                        >
                            SUBMIT
                        </button>
                    </form>
                    <p className={state.hasErrored ? "error" : "error hide"}>
                        Error: {state.errMessage}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Otp2;
