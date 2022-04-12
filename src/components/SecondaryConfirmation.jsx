import React from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";

const user_id = localStorage.getItem("user_id");

const initialResponseData = {
    user_id: user_id,
    stock_symbol: "",
    stock_name: "",
    start_price: null,
    response_value: "",
    response_length: null,
    expiration_time: "",
    primary_response: null,
    primary_response_time: null,
    created_at: "",
    updated_at: "",
    exchange: "",
};

function SecondaryConfirmation(props) {
    const { response, setResponse, layoutTimes, setShowCountdown } = props;
    let navigate = useNavigate();

    const formatter = new Intl.NumberFormat("de-DE");
    let startPriceFormatted = formatter.format(response.start_price);

    const handleClick = () => {
        setResponse(initialResponseData);
        setShowCountdown(false);
        navigate("/vote");
    };

    return (
        <div className="card">
            <div className="content">
                <div className="share-container">
                    <table>
                        <tr>
                            <td>STOCK:</td>
                            <td className="right">{response.stock_name}</td>
                        </tr>
                        <tr>
                            <td>START_PRICE:</td>
                            <td>{startPriceFormatted}$</td>
                        </tr>
                        <tr>
                            <td>OVER_UNDER:</td>
                            <td>{response.response_value.toUpperCase()}</td>
                        </tr>
                        <tr>
                            <td>TIME_TIL_EXPIRATION:</td>
                            {layoutTimes.expiration_secs < 0 ||
                            layoutTimes.expiration_mins < 0 ? (
                                <td>EXPIRED</td>
                            ) : (
                                <td>
                                    {layoutTimes.expiration_mins}m{" "}
                                    {layoutTimes.expiration_secs}s
                                </td>
                            )}
                        </tr>
                        <tr>
                            <td>TIME_TO_RESPOND:</td>
                            {layoutTimes.respond_secs < 0 ||
                            layoutTimes.respond_mins < 0 ? (
                                <td>RESPONSE_CLOSED</td>
                            ) : (
                                <td>
                                    {layoutTimes.respond_mins}m{" "}
                                    {layoutTimes.respond_secs}s
                                </td>
                            )}
                        </tr>
                    </table>
                </div>
                <button
                    onClick={handleClick}
                    className="share-button new-bet-button"
                >
                    START NEW BET
                </button>
            </div>
        </div>
    );
}

export default SecondaryConfirmation;
