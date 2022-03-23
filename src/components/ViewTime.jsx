import React from "react";
import "../App.css";

const responseLengths = [5, 10, 15, 30, 60];

function ViewStock(props) {
    const { response } = props;

    return (
        <div className="card">
            <h2 className="number">2</h2>
            <div className="content">
                <h3>SELECTED TIME FRAME:</h3>
                <div className="response-length-container">
                    {responseLengths.map((value) => {
                        return (
                            <button
                                className={`response-length no-click ${
                                    response.response_length === value
                                        ? "selected"
                                        : ""
                                }`}
                            >
                                {`${value}min`}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default ViewStock;
