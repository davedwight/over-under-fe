import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import moment from "moment";
import Modal from "./Modal.jsx";

let now = moment().format("YYYY-MM-DDTHH:mm");

setInterval(() => {
    now = moment().format("YYYY-MM-DDTHH:mm");
}, 1000);

const initialResponseData = {
    user_id: null,
    phone: null,
    stock_symbol: "",
    stock_name: "",
    current_price: null,
    response_value: "",
    response_length: null,
    expiration_time: now,
};

const responseLengths = [5, 10, 15, 30, 60];

function App() {
    const [stocks, setStocks] = useState([]);
    const [formValues, setFormValues] = useState({ stockSymbol: "" });
    const [response, setResponse] = useState(initialResponseData);

    let nowFormat = moment(now);
    let expDateFormat = moment(response.expiration_time);
    let timeTilExp = expDateFormat.diff(nowFormat, "seconds");
    let daysTilExp = Math.floor(timeTilExp / (60 * 60 * 24));
    let hrsTilExp = Math.floor((timeTilExp % (60 * 60 * 24)) / (60 * 60));
    let minsTilExp = Math.floor(
        ((timeTilExp % (60 * 60 * 24)) % (60 * 60)) / 60
    );

    // console.log("now", now);
    // console.log("nowFormat", nowFormat);
    // console.log("timeTilExp", timeTilExp);

    const updateForm = (inputName, inputValue) => {
        setFormValues({ ...formValues, [inputName]: inputValue });
    };

    useEffect(() => {
        const getStocks = () => {
            axios
                .get(
                    "https://finnhub.io/api/v1/stock/symbol?exchange=US&token=sandbox_c8ct8raad3i9nv0d14tg"
                )
                .then((res) => {
                    console.log(res.data);
                    const stocksArr = [];
                    res.data.map((item) => {
                        stocksArr.push(item.symbol);
                    });
                    setStocks(stocksArr);
                })
                .catch((error) => console.log("error", error));
        };
        getStocks();
    }, []);

    const getPrice = (stock) => {
        axios
            .get(
                `https://finnhub.io/api/v1/quote?symbol=${stock}&token=sandbox_c8ct8raad3i9nv0d14tg`
            )
            .then((res) => {
                setResponse({
                    ...response,
                    stock_symbol: stock,
                    current_price: res.data.c,
                });
            })
            .catch((error) => console.log("error", error));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSelect = (e) => {
        e.preventDefault();
        const stock = formValues.stockSymbol;
        // setResponse({ ...response, stock_symbol: stock });
        getPrice(stock);
    };

    const handleVote = (value) => {
        if (value === "increase") {
            setResponse({ ...response, response_value: "increase" });
        } else {
            setResponse({ ...response, response_value: "decrease" });
        }
    };

    const handleDateChange = (e) => {
        setResponse({ ...response, expiration_time: e.target.value });
    };

    const handleLengthClick = (value) => {
        setResponse({ ...response, response_length: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("response_data", response);
    };

    return (
        <main>
            <div>
                <h1>OVER / UNDER</h1>
                <div className="wrapper">
                    <div>
                        <p>Select stock:</p>
                        <datalist id="suggestions">
                            {stocks.map((item, i) => {
                                return <option key={i}>{item}</option>;
                            })}
                        </datalist>
                        <form onSubmit={handleSelect}>
                            <input
                                name="stockSymbol"
                                value={formValues.stockSymbol}
                                onChange={handleChange}
                                autoComplete="on"
                                list="suggestions"
                            />
                            <button className="select-button">Select</button>
                        </form>
                    </div>
                    {response.stock_symbol != "" ? (
                        <p>{`Current share price of ${response.stock_symbol}: $${response.current_price}`}</p>
                    ) : (
                        ""
                    )}
                    <div className="response-length-container">
                        {responseLengths.map((value) => {
                            return (
                                <button
                                    className="response-length"
                                    onClick={() => handleLengthClick(value)}
                                >
                                    {`${value}min`}
                                </button>
                            );
                        })}
                    </div>
                    {/* <div className="date-container">
                        <label htmlFor="expiration">
                            <p>Select an expiration date and time:</p>
                        </label>
                        <input
                            id="expiration"
                            type="datetime-local"
                            name="expiration_time"
                            value={response.expiration_time}
                            onChange={handleDateChange}
                            min={now}
                        ></input>
                    </div> */}
                    {/* {response.expiration_time < now ? (
                        <p className="warning">
                            Please select an expiration date later than the
                            current time
                        </p>
                    ) : (
                        ""
                    )}
                    {response.expiration_time > now ? (
                        <p>
                            Vote expires in {daysTilExp} days, {hrsTilExp}{" "}
                            hours, and {minsTilExp} minutes
                        </p>
                    ) : (
                        ""
                    )} */}
                    <div className="button-container">
                        <button
                            onClick={() => handleVote("increase")}
                            className={`increase ${
                                response.response_value === "increase"
                                    ? "selected selected-increase"
                                    : ""
                            }`}
                        >
                            Increase
                        </button>
                        <button
                            onClick={() => handleVote("decrease")}
                            className={`decrease ${
                                response.response_value === "decrease"
                                    ? "selected selected-decrease"
                                    : ""
                            }`}
                        >
                            Decrease
                        </button>
                    </div>
                    <button className="submit-button" onClick={handleSubmit}>
                        Submit
                    </button>
                    {/* <Modal response={response} /> */}
                </div>
            </div>
        </main>
    );
}

export default App;
