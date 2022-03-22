import React, { useState } from "react";
import "../App.css";

function Share(props) {
    const { response, shareLinkParam } = props;
    const [copied, setCopied] = useState(false);

    const handleClick = () => {
        const shareData = {
            title: `${response.stock_symbol} | ${response.response_value} | ${response.response_length} mins`,
            text: `You've been challenged to over/under. You have ${response.response_length} minutes to respond!`,
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
            .writeText(`http://over-under.vercel.app/${shareLinkParam}`)
            .then((res) => {
                console.log(res);
                setCopied(true);
            })
            .catch((err) => console.error);
    };

    return (
        <div className="card">
            <h2 className="number">4</h2>
            <div className="content">
                <h3>SHARE WITH A FRIEND:</h3>
                <div className="share-container">
                    <p>STOCK: {response.stock_name}</p>
                    <p>CURRENT_PRICE: {response.current_price}</p>
                    <p>TIME: {response.response_length}</p>
                    <p>OVER_UNDER: {response.response_value}</p>
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
                {copied ? <h3>COPIED</h3> : <div></div>}
            </div>
        </div>
    );
}

export default Share;
