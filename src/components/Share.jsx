import React, { useState } from "react";
import "../App.css";

const emojis = {
    over: "📈",
    under: "📉",
};

function Share(props) {
    const { response, shareLinkParam, layoutTimes } = props;

    const [copied, setCopied] = useState(false);

    const handleClick = () => {
        const shareData = {
            text: `${response.stock_symbol} | ${
                emojis[response.response_value]
            } | ${
                response.response_length
            } mins\nYou've been challenged to over/under.\nYou have ${
                layoutTimes.expiration_mins
            } minutes to respond!`,
            url: `http://over-under.vercel.app/${shareLinkParam}`,
        };
        navigator
            .share(shareData)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => console.error);
    };

    const handleClipboardClick = () => {
        navigator.clipboard
            .writeText(
                `${response.stock_symbol} | ${
                    emojis[response.response_value]
                } | ${
                    response.response_length
                } mins\nYou've been challenged to over/under.\nYou have ${
                    layoutTimes.expiration_mins
                } minutes to respond!\nhttp://over-under.vercel.app/${shareLinkParam}`
            )
            .then((res) => {
                console.log(res);
                setCopied(true);
            })
            .catch((err) => console.error);
    };

    return (
        <div className="card">
            <div className="content">
                <h3>SHARE WITH A FRIEND:</h3>
                <div className="share-container">
                    <p>STOCK: {response.stock_name}</p>
                    <p>CURRENT_PRICE: {response.current_price}</p>
                    <p>OVER_UNDER: {response.response_value}</p>
                    {layoutTimes.expiration_secs < 0 ||
                    layoutTimes.expiration_mins < 0 ? (
                        <p>TIME_TIL_EXPIRATION: EXPIRED</p>
                    ) : (
                        <p>
                            TIME_TIL_EXPIRATION: {layoutTimes.expiration_mins}m{" "}
                            {layoutTimes.expiration_secs}s
                        </p>
                    )}
                    {layoutTimes.respond_secs < 0 ||
                    layoutTimes.respond_mins < 0 ? (
                        <p>TIME_TO_RESPOND: RESPONSE_CLOSED</p>
                    ) : (
                        <p>
                            TIME_TO_RESPOND: {layoutTimes.respond_mins}m{" "}
                            {layoutTimes.respond_secs}s
                        </p>
                    )}
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
                <h3 className={copied ? "copied" : "copied hide"}>COPIED</h3>
            </div>
        </div>
    );
}

export default Share;
