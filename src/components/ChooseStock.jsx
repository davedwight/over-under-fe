import React, { useState, useEffect } from "react";
import "../App.css";
import axios from "axios";
import Spinner from "../assets/spinner.svg";

function ChooseStock(props) {
    const { response, setResponse, stocks, setStocks } = props;

    const [formValues, setFormValues] = useState({ stockSymbol: "" });
    const [isLoading, setIsLoading] = useState(true);
    const [stockLoading, setStockLoading] = useState(false);

    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    });

    let currPriceFormatted = formatter.format(response.current_price);

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
                    setIsLoading(false);
                })
                .catch((error) => console.error("error", error));
        };
        response.stock_symbol === "" ? getStocks() : setIsLoading(false);
        setFormValues({ ...formValues, stockSymbol: response.stock_symbol });
    }, []);

    const getStockData = (stockSymbol, stockName) => {
        setStockLoading(true);
        axios
            .get(
                `https://finnhub.io/api/v1/quote?symbol=${stockSymbol}&token=sandbox_c8ct8raad3i9nv0d14tg`
            )
            .then((res) => {
                setResponse({
                    ...response,
                    stock_symbol: stockSymbol,
                    stock_name: stockName,
                    current_price: res.data.c,
                });
                setStockLoading(false);
            })
            .catch((error) => console.error("error", error));
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        const symbol = value.split(" ")[0];
        setFormValues({ ...formValues, [name]: symbol });
    };

    const handleRandom = (e) => {
        e.preventDefault();
        const rand = Math.floor(Math.random() * stocks.length);
        console.log("length of array", stocks.length);
        console.log("random number", rand);
        console.log("all stocks", stocks);
        const stockObj = stocks[rand];
        getStockData(stockObj.symbol, stockObj.name);
        setFormValues({ ...formValues, stockSymbol: stockObj.symbol });
    };

    const handleSelect = (e) => {
        e.preventDefault();
        console.log("triggered handleSelect");
        const stockSymbol = formValues.stockSymbol;
        const stockObj = stocks.find(
            (obj) => obj.symbol === formValues.stockSymbol
        );
        const stockName = stockObj.name;
        getStockData(stockSymbol, stockName);
    };

    return (
        <div className="card">
            <h2 className="number">1</h2>
            <div className="content">
                <h3>CHOOSE A STOCK:</h3>
                {isLoading ? (
                    <img className="main-spinner" src={Spinner} alt="spinner" />
                ) : (
                    <div>
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
                            <form>
                                <input
                                    type="search"
                                    results
                                    name="stockSymbol"
                                    value={formValues.stockSymbol}
                                    onChange={handleFormChange}
                                    autoComplete="on"
                                    list="suggestions"
                                />
                                <button
                                    onClick={handleRandom}
                                    className="select-button"
                                >
                                    RANDOM
                                </button>
                                <button
                                    onClick={handleSelect}
                                    className="select-button"
                                >
                                    SELECT
                                </button>
                            </form>
                        </div>
                        {response.stock_symbol != "" ? (
                            <div className="stock-box">
                                {stockLoading ? (
                                    <img
                                        className="small-spinner"
                                        src={Spinner}
                                        alt="spinner"
                                    />
                                ) : (
                                    <div className="stock-display-container">
                                        <p className="stock-name-display">
                                            {response.stock_name}
                                        </p>
                                        <p className="stock-price-display">
                                            {currPriceFormatted}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div></div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChooseStock;
