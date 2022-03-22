import React from "react";
import "../App.css";

// setInterval(() => {
//     now = moment().format("YYYY-MM-DDTHH:mm");
// }, 1000);

// let nowFormat = moment(now);
// let expDateFormat = moment(response.expiration_time);
// let timeTilExp = expDateFormat.diff(nowFormat, "seconds");
// let daysTilExp = Math.floor(timeTilExp / (60 * 60 * 24));
// let hrsTilExp = Math.floor((timeTilExp % (60 * 60 * 24)) / (60 * 60));
// let minsTilExp = Math.floor(
//     ((timeTilExp % (60 * 60 * 24)) % (60 * 60)) / 60
// );

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

export default ViewStock;
