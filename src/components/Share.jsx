import React from "react";
import "../App.css";

function Share(props) {
    const { response, shareLinkParam } = props;
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
                <a
                    className="share-button"
                    href={`http://127.0.0.1:5000/${shareLinkParam}`}
                    target="_blank"
                >
                    <button>SHARE</button>
                </a>
            </div>
        </div>
    );
}

export default Share;
