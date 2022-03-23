import React, { useState } from "react";
import "../App.css";

const responseLengths = [5, 10, 15, 30, 60];

function ChooseTime(props) {
    const { response, setResponse, pageIndex, setPageIndex } = props;

    const handleLengthClick = (value) => {
        setResponse({ ...response, response_length: value });
        setPageIndex(pageIndex + 1);
    };

    return (
        <div className="card">
            <h2 className="number">2</h2>
            <div className="content">
                <h3>CHOOSE A TIME FRAME:</h3>
                <div className="response-length-container">
                    {responseLengths.map((value) => {
                        return (
                            <button
                                onClick={() => handleLengthClick(value)}
                                className={`response-length ${
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

export default ChooseTime;
