import React, { useState } from "react";
import "../App.css";
import axios from "axios";
import moment from "moment";

function ChooseValue(props) {
    const {
        response,
        setResponse,
        setShareLinkParam,
        setPageIndex,
        pageIndex,
    } = props;

    const handleVote = (value) => {
        if (value === "over") {
            setResponse({ ...response, response_value: "over" });
        } else {
            setResponse({ ...response, response_value: "under" });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const expiration_time = moment()
            .add(response.response_length, "minutes")
            .format();
        setResponse({
            ...response,
            expiration_time,
        });
        console.log("response before submit", response);
        axios
            .post("http://localhost:9000/api/responses", response)
            .then((res) => {
                console.log(res);
                setShareLinkParam(res.data.response_id);
                setPageIndex(pageIndex + 1);
            })
            .catch((err) => console.error("didn't work", err));
    };

    return (
        <div className="card">
            <h2 className="number">3</h2>
            <div className="content">
                <div className="button-container">
                    <button
                        onClick={() => handleVote("over")}
                        className={`value-button ${
                            response.response_value === "over" ? "selected" : ""
                        }`}
                    >
                        OVER
                    </button>
                    <p className="or">OR</p>
                    <button
                        onClick={() => handleVote("under")}
                        className={`value-button ${
                            response.response_value === "under"
                                ? "selected"
                                : ""
                        }`}
                    >
                        UNDER
                    </button>
                </div>
                <button className="submit-button" onClick={handleSubmit}>
                    SUBMIT
                </button>
            </div>
        </div>
    );
}

export default ChooseValue;
