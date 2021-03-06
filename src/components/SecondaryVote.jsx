import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { axiosWithAuth } from "../utils/axiosWithAuth";
import Spinner from "../assets/spinner.svg";
import moment from "moment";

const responseOpposites = {
    over: "under",
    under: "over",
};

function SecondaryVote(props) {
    const {
        response,
        setResponse,
        primaryResponseId,
        setShareLinkParam,
        setPageIndex,
        pageIndex,
        layoutTimes,
        setVoteNotFound,
        setShowCountdown,
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [primaryResponseValue, setPrimaryResponseValue] = useState("");
    const [submitLoading, setSubmitLoading] = useState(false);
    const [duplicateResponse, setDuplicateResponse] = useState(false);
    let navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        const userId = parseInt(localStorage.getItem("user_id"));
        const token = localStorage.getItem("token");

        if (!token) {
            navigate(`/login/vote/${primaryResponseId}`);
        } else {
            axiosWithAuth()
                .get(`/responses/${primaryResponseId}/users`)
                .then((res) => {
                    console.log("res after finding users", res);
                    if (res.data.includes(userId)) {
                        setDuplicateResponse(true);
                        setShowCountdown(false);
                        setIsLoading(false);
                    } else {
                        !response.stock_symbol
                            ? getResponseInfo()
                            : setIsLoading(false);
                    }
                })
                .catch((error) => {
                    console.error("error", error);
                });

            const getResponseInfo = () => {
                axiosWithAuth()
                    .get(`/responses/${primaryResponseId}`)
                    .then((res) => {
                        setResponse({
                            ...response,
                            stock_name: res.data[0].stock_name,
                            stock_symbol: res.data[0].stock_symbol,
                            start_price: res.data[0].start_price,
                            response_length: res.data[0].response_length,
                            expiration_time: res.data[0].expiration_time,
                            response_value:
                                responseOpposites[res.data[0].response_value],
                            primary_response: primaryResponseId,
                            primary_response_time: res.data[0].created_at,
                            user_id: userId,
                        });
                        setPrimaryResponseValue(res.data[0].response_value);
                        setIsLoading(false);
                    })
                    .catch((error) => {
                        console.error("error", error);
                        setVoteNotFound(true);
                    });
            };
        }
    }, []);

    const formatter = new Intl.NumberFormat("de-DE", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
    });
    let startPriceFormatted = formatter.format(response.start_price);

    const handleSubmit = () => {
        const responseToSubmit = {
            ...response,
            created_at: moment().toISOString(),
            updated_at: moment().toISOString(),
        };
        setSubmitLoading(true);
        axiosWithAuth()
            .post("/responses", responseToSubmit)
            .then((res) => {
                setShareLinkParam(res.data.response_id);
                setSubmitLoading(false);
                setShowCountdown(false);
                setPageIndex(pageIndex + 1);
            })
            .catch((err) => console.error("didn't work", err));
    };

    let expired = false;

    if (layoutTimes.respond_mins < 0 || layoutTimes.respond_secs < 0) {
        expired = true;
    }

    return isLoading ? (
        <img className="small-spinner" src={Spinner} alt="spinner" />
    ) : duplicateResponse ? (
        <h3 className="duplicate-message">RESPONSE ALREADY RECORDED</h3>
    ) : (
        <div className={expired ? "expired card" : "card"}>
            <div className="content">
                <h3>SELECTED STOCK:</h3>
                {response.stock_symbol != "" ? (
                    <div className="stock-box">
                        {isLoading ? (
                            <img
                                className="small-spinner"
                                src={Spinner}
                                alt="spinner"
                            />
                        ) : (
                            <div className="stock-display-container">
                                <table className="choose-stock-table">
                                    <tr>
                                        <td>{response.stock_name}</td>
                                    </tr>
                                    <tr>
                                        <td>{response.stock_symbol}</td>
                                        <td className="stock-price-display">
                                            {startPriceFormatted}$
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        )}
                    </div>
                ) : (
                    <div></div>
                )}
                <div className="value-display">
                    {primaryResponseValue.toUpperCase()}
                </div>

                <div className="secondary-vote">
                    <h3>
                        CHOOSE{" "}
                        {responseOpposites[primaryResponseValue].toUpperCase()}?
                    </h3>
                    {primaryResponseValue === "over" ? (
                        <button
                            disabled={expired || submitLoading}
                            onClick={handleSubmit}
                            className={`secondary-value-button ${
                                expired || submitLoading ? "disabled" : ""
                            }`}
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
                    ) : (
                        <button
                            disabled={expired || submitLoading}
                            onClick={handleSubmit}
                            className={`secondary-value-button ${
                                expired || submitLoading ? "disabled" : ""
                            }`}
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
                    )}
                </div>
            </div>
        </div>
    );
}

export default SecondaryVote;
