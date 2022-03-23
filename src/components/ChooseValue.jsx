import React, { useState } from "react";
import "../App.css";
import axios from "axios";
import Spinner from "../assets/spinner.svg";
import moment from "moment";

function ChooseValue(props) {
    const {
        response,
        setResponse,
        setShareLinkParam,
        setPageIndex,
        pageIndex,
    } = props;

    const [submitLoading, setSubmitLoading] = useState(false);

    const handleVote = (value) => {
        if (value === "over") {
            setResponse({ ...response, response_value: "over" });
        } else {
            setResponse({ ...response, response_value: "under" });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        axios
            .post(
                "https://over-under-vote.herokuapp.com/api/responses",
                // "http://localhost:9000/api/responses",
                response
            )
            .then((res) => {
                console.log(res);
                if (!response.primary_response) {
                    setResponse({
                        ...response,
                        created_at: res.data.created_at,
                        expiration_time: moment(res.data.created_at)
                            .add(response.response_length, "minutes")
                            .format(),
                    });
                }
                setShareLinkParam(res.data.response_id);
                setSubmitLoading(false);
                setPageIndex(pageIndex + 1);
            })
            .catch((err) => console.error("didn't work", err));
    };

    let disable = true;
    if (
        !(
            response.stock_name === "" ||
            !response.response_length ||
            response.response_value === ""
        )
    ) {
        disable = false;
    }
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
                <button
                    className={
                        disable ? "disabled submit-button" : "submit-button"
                    }
                    onClick={handleSubmit}
                    disabled={disable}
                >
                    {submitLoading ? (
                        <img
                            src={Spinner}
                            alt="spinner"
                            className="small-spinner"
                        />
                    ) : (
                        "SUBMIT"
                    )}
                </button>
            </div>
        </div>
    );
}

export default ChooseValue;
