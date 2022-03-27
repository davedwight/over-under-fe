import React, { useState, useEffect } from "react";
import "../App.css";
import { axiosWithAuth } from "../utils/axiosWithAuth";
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

    useEffect(() => {
        if (response.response_value) {
            handleSubmit();
        }
    }, [response.response_value]);

    const handleVote = (value) => {
        setSubmitLoading(true);
        if (value === "over") {
            setResponse({ ...response, response_value: "over" });
        } else {
            setResponse({ ...response, response_value: "under" });
        }
    };

    const handleSubmit = () => {
        console.log("response before submitting", response);
        axiosWithAuth()
            .post("/responses", response)
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
    if (!(response.stock_name === "" || !response.response_length)) {
        disable = false;
    }
    return (
        <div className="card">
            <h2 className="number">3</h2>
            <div className="content">
                <div className="button-container">
                    <button
                        disabled={disable}
                        onClick={() => handleVote("over")}
                        className={
                            disable ? "disabled value-button" : "value-button"
                        }
                    >
                        {submitLoading ? (
                            <img
                                src={Spinner}
                                alt="spinner"
                                className="small-spinner"
                            />
                        ) : (
                            "OVER"
                        )}
                    </button>
                    <p className="or">OR</p>
                    <button
                        disabled={disable}
                        onClick={() => handleVote("under")}
                        className={
                            disable ? "disabled value-button" : "value-button"
                        }
                    >
                        {submitLoading ? (
                            <img
                                src={Spinner}
                                alt="spinner"
                                className="small-spinner"
                            />
                        ) : (
                            "UNDER"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChooseValue;
