import React, { useState } from "react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { useNavigate } from "react-router-dom";
import Spinner from "../assets/spinner.svg";

import { sendSmsVerification } from "../api/verify";
import "react-phone-number-input/style.css";

const PhoneNumber = () => {
    const [value, setValue] = useState();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [disable, setDisable] = useState(true);
    let navigate = useNavigate();

    const handleChange = (event) => {
        if (event) {
            isValidPhoneNumber(event) ? setDisable(false) : setDisable(true);
            setValue(event);
        }
    };

    const handleKeyPress = (e) => {
        e.key === "Enter" && !disable && !loading ? handleSubmit() : null;
    };

    const handleSubmit = () => {
        setError("");
        setLoading(true);
        setDisable(true);
        if (!value) {
            setError("Phone number required");
        } else if (value && !isValidPhoneNumber(value)) {
            setError("Invalid phone number");
        } else {
            sendSmsVerification(value).then((sent) => {
                sent.success
                    ? navigate(`/login/${value}`)
                    : setError(`Error: ${sent.error}`);
                setLoading(false);
            });
        }
    };

    return (
        <div className="login-wrapper">
            <PhoneInput
                className="phone-input"
                placeholder="Enter phone number"
                value={value}
                onChange={handleChange}
                defaultCountry="US"
                onKeyPress={handleKeyPress}
            />
            <button
                className={disable ? "disabled phone-button" : "phone-button"}
                disabled={disable}
                onClick={handleSubmit}
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
            <div className={error ? "phone-error" : "phone-error hide"}>
                {error}
            </div>
        </div>
    );
};

export default PhoneNumber;
