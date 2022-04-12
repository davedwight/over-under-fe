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

        const expTime = moment()
            .add(response.response_length, "minutes")
            .toISOString();

        if (value === "over") {
            setResponse({
                ...response,
                response_value: "over",
                expiration_time: expTime,
                created_at: moment().toISOString(),
                updated_at: moment().toISOString(),
            });
        } else {
            setResponse({
                ...response,
                response_value: "under",
                expiration_time: expTime,
                created_at: moment().toISOString(),
                updated_at: moment().toISOString(),
            });
        }
    };

    const handleSubmit = () => {
        axiosWithAuth()
            .post("/responses", response)
            .then((res) => {
                if (!response.primary_response) {
                    setResponse({
                        ...response,
                        created_at: res.data.created_at,
                        expiration_time: res.data.expiration_time,
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
                    {submitLoading ? (
                        <img
                            src={Spinner}
                            alt="spinner"
                            className="small-spinner"
                        />
                    ) : (
                        <>
                            <button
                                disabled={disable}
                                onClick={() => handleVote("over")}
                                className={
                                    disable
                                        ? "disabled value-button"
                                        : "value-button"
                                }
                            >
                                OVER
                            </button>
                            <p className="or">OR</p>
                            <button
                                disabled={disable}
                                onClick={() => handleVote("under")}
                                className={
                                    disable
                                        ? "disabled value-button"
                                        : "value-button"
                                }
                            >
                                UNDER
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ChooseValue;
