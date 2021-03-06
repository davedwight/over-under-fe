import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const emojis = {
    over: "📈",
    under: "📉",
};

function Share(props) {
    const { response, shareLinkParam, layoutTimes } = props;
    let navigate = useNavigate();
    const [copied, setCopied] = useState(false);
    const formatter = new Intl.NumberFormat("de-DE", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
    });
    let startPriceFormatted = formatter.format(response.start_price);

    const handleClick = () => {
        const shareData = {
            text: `${response.stock_symbol} | ${
                emojis[response.response_value]
            } | ${
                response.response_length
            } mins\nYou've been challenged to OVER / UNDER.\nYou have ${
                layoutTimes.respond_mins
            } minutes to respond!`,
            url: `http://over-under.vercel.app/vote/${shareLinkParam}`,
        };
        navigator
            .share(shareData)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => console.error);
    };

    const handleNewBet = () => {
        navigate(`/vote`);
        window.location.reload();
    };

    const handleClipboardClick = () => {
        navigator.clipboard
            .writeText(
                `${response.stock_symbol} | ${
                    emojis[response.response_value]
                } | ${
                    response.response_length
                } mins\nYou've been challenged to OVER / UNDER.\nYou have ${
                    layoutTimes.expiration_mins
                } minutes to respond!\nhttp://over-under.vercel.app/vote/${shareLinkParam}`
            )
            .then((res) => {
                setCopied(true);
            })
            .catch((err) => console.error);
    };

    return (
        <div className="card">
            <div className="content">
                <h3>SHARE WITH A FRIEND:</h3>
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

                {navigator.share ? (
                    <button onClick={handleClick} className="share-button">
                        SHARE
                    </button>
                ) : (
                    <button
                        onClick={handleClipboardClick}
                        className="share-button"
                    >
                        SHARE
                    </button>
                )}
                <button onClick={handleNewBet} className="new-bet-button">
                    NEW BET
                </button>
                <h3 className={copied ? "copied" : "copied hide"}>
                    INFO COPIED TO CLIPBOARD
                </h3>
            </div>
        </div>
    );
}

export default Share;
