import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import OtpInput from "react-otp-input";
import { checkVerification } from "../api/verify";
import axios from "axios";
import "../styles/Otp.css";
const SERVER_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;
import Spinner from "../assets/spinner.svg";

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

function Otp() {
    let navigate = useNavigate();
    let { primary_response_id, phone_number } = useParams();

    const [state, setState] = useState(initialState);
    const [loading, setLoading] = useState(false);

    const handleOtpChange = (otp) => {
        setState({ ...state, otp });
    };

    const handleSubmit = (e) => {
        setLoading(true);
        e.preventDefault();
        checkVerification(phone_number, state.otp).then((response) => {
            if (!response.success) {
                setState({
                    ...state,
                    hasErrored: true,
                    errMessage: response.message,
                });
                setLoading(false);
            } else {
                axios
                    .post(`${SERVER_BASE_URL}/users`, { phone_number })
                    .then((res) => {
                        setLoading(false);
                        localStorage.setItem("token", res.data.token);
                        localStorage.setItem("user_id", res.data.user_id);
                        if (primary_response_id) {
                            navigate(`/vote/${primary_response_id}`);
                        } else {
                            navigate("/vote");
                        }
                    })
                    .catch((err) => {
                        setLoading(false);
                        console.error("error adding user", err);
                    });
            }
        });
    };

    return (
        <div className="container">
            <div className="view">
                <div className="otp-card">
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
                            disabled={
                                state.otp.length < state.numInputs || loading
                            }
                        >
                            {loading ? (
                                <img
                                    className="small-spinner"
                                    src={Spinner}
                                    alt="spinner"
                                />
                            ) : (
                                "SUBMIT"
                            )}
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

export default Otp;
