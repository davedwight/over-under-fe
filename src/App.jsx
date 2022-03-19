import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import moment from "moment";
// import Modal from "./Modal.jsx";

let now = moment().format("YYYY-MM-DDTHH:mm");
let expiration_time = "";

setInterval(() => {
    now = moment().format("YYYY-MM-DDTHH:mm");
}, 1000);

const initialResponseData = {
    user_id: 1,
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

    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    });
    let currPriceFormatted = formatter.format(response.current_price);

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
                    console.log("inside getStocks", res);
                    const stocksArr = [];
                    res.data.map((item) => {
                        stocksArr.push({
                            symbol: item.symbol,
                            name: item.description,
                        });
                    });
                    setStocks(stocksArr);
                })
                .catch((error) => console.log("error", error));
        };
        getStocks();
    }, []);

    const getStockData = (stockSymbol, stockName) => {
        axios
            .get(
                `https://finnhub.io/api/v1/quote?symbol=${stockSymbol}&token=sandbox_c8ct8raad3i9nv0d14tg`
            )
            .then((res) => {
                console.log("inside getStockData", res);
                setResponse({
                    ...response,
                    stock_symbol: stockSymbol,
                    stock_name: stockName,
                    current_price: res.data.c,
                });
            })
            .catch((error) => console.log("error", error));
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        const symbol = value.split(" ")[0];
        setFormValues({ ...formValues, [name]: symbol });
    };

    const handleSelect = (e) => {
        e.preventDefault();
        const stockSymbol = formValues.stockSymbol;
        console.log("stock list", stocks);
        const stockObj = stocks.find(
            (obj) => obj.symbol === formValues.stockSymbol
        );
        console.log("stock object", stockObj);
        const stockName = stockObj.name;
        // setResponse({ ...response, stock_symbol: stock });
        getStockData(stockSymbol, stockName);
    };

    const handleVote = (value) => {
        if (value === "over") {
            setResponse({ ...response, response_value: "over" });
        } else {
            setResponse({ ...response, response_value: "under" });
        }
    };
    console.log("response data", response);

    const handleLengthClick = (value) => {
        setResponse({ ...response, response_length: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        expiration_time = moment()
            .add(response.response_length, "minutes")
            .format();
        setResponse({ ...response, expiration_time });
        console.log("response inside submit", response);
        axios
            .post("http://localhost:9000/api/responses", response)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => console.error("didn't work", err));
        // axios
        //     .post("https://localhost:9000/api/responses", response)
        //     .then((res) => {
        //         console.log("response from backend", res.data);
        //     })
        //     .catch((err) => console.error("darn... nothing: ", err));
    };

    return (
        <main>
            <header>
                <h1>OVER / UNDER</h1>
            </header>
            <div>
                <div className="wrapper">
                    <div className="card">
                        <h2 className="number">1</h2>
                        <div className="content">
                            <h3>CHOOSE A STOCK:</h3>
                            <div className="stock-input-wrapper">
                                <datalist id="suggestions">
                                    {stocks.map((item, i) => {
                                        return (
                                            <option
                                                key={i}
                                            >{`${item.symbol} (${item.name})`}</option>
                                        );
                                    })}
                                </datalist>
                                <form onSubmit={handleSelect}>
                                    <input
                                        name="stockSymbol"
                                        value={formValues.stockSymbol}
                                        onChange={handleFormChange}
                                        autoComplete="on"
                                        list="suggestions"
                                    />
                                    <button className="select-button">
                                        Select
                                    </button>
                                </form>
                            </div>
                            <div className="stock-box">
                                {response.stock_symbol != "" ? (
                                    <div className="stock-display-container">
                                        <p className="stock-name-display">
                                            {response.stock_name}
                                        </p>
                                        <p className="stock-price-display">
                                            {currPriceFormatted}
                                        </p>
                                    </div>
                                ) : (
                                    ""
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <h2 className="number">2</h2>
                        <div className="content">
                            <h3>CHOOSE A TIME FRAME:</h3>
                            <div className="response-length-container">
                                {responseLengths.map((value) => {
                                    return (
                                        <button
                                            onClick={() =>
                                                handleLengthClick(value)
                                            }
                                            className={`response-length ${
                                                response.response_length ===
                                                value
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
                    <div className="card">
                        <h2 className="number">3</h2>
                        <div className="content">
                            <div className="button-container">
                                <button
                                    onClick={() => handleVote("over")}
                                    className={`value-button ${
                                        response.response_value === "over"
                                            ? "selected"
                                            : ""
                                    }`}
                                >
                                    OVER
                                </button>
                                <p className="or">OR</p>
                                <button
                                    onClick={() => handleVote("under")}
                                    className={`value-button ${
                                        response.response_value === "under"
                                            ? "selected"
                                            : ""
                                    }`}
                                >
                                    UNDER
                                </button>
                            </div>
                            <button
                                className="submit-button"
                                onClick={handleSubmit}
                            >
                                SUBMIT
                            </button>
                        </div>
                    </div>
                    {/* <Modal response={response} /> */}
                </div>
            </div>
        </main>
    );
}

export default App;
