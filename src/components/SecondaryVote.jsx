import React, { useState, useEffect } from "react";
import "../App.css";
import { axiosWithAuth } from "../utils/axiosWithAuth";
import moment from "moment";
import Spinner from "../assets/spinner.svg";

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
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [primaryResponseValue, setPrimaryResponseValue] = useState("");
    const [submitLoading, setSubmitLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const userId = parseInt(localStorage.getItem("user_id"));

        const getStockInfo = () => {
            axiosWithAuth()
                .get(`/responses/${primaryResponseId}`)
                .then((res) => {
                    setResponse({
                        ...response,
                        stock_name: res.data[0].stock_name,
                        stock_symbol: res.data[0].stock_symbol,
                        current_price: res.data[0].current_price,
                        response_length: res.data[0].response_length,
                        expiration_time: res.data[0].expiration_time,
                        response_value:
                            responseOpposites[res.data[0].response_value],
                        created_at: res.data[0].created_at,
                        primary_response: primaryResponseId,
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
        !response.stock_symbol ? getStockInfo() : setIsLoading(false);
    }, []);

    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    });

    let currPriceFormatted = formatter.format(response.current_price);

    const handleSubmit = () => {
        setSubmitLoading(true);
        axiosWithAuth()
            .post("/responses", response)
            .then((res) => {
                console.log(res);
                setShareLinkParam(res.data.response_id);
                setSubmitLoading(false);
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
                                <p className="stock-name-display">
                                    {response.stock_name}
                                </p>
                                <p className="stock-price-display">
                                    {currPriceFormatted}
                                </p>
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
                            disabled={expired}
                            onClick={handleSubmit}
                            className={`secondary-value-button ${
                                expired ? "disabled" : ""
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
                            disabled={expired}
                            onClick={handleSubmit}
                            className={`secondary-value-button ${
                                expired ? "disabled" : ""
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
