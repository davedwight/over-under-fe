import React, { useState, useEffect } from "react";
import "../App.css";
import axios from "axios";
import Spinner from "../assets/spinner.svg";

function ChooseStock(props) {
    const {
        response,
        setResponse,
        stocks,
        setStocks,
        pageIndex,
        setPageIndex,
    } = props;

    let initialLoading = true;
    response.stock_symbol != "" ? (initialLoading = false) : null;

    const [formValues, setFormValues] = useState({ stockSymbol: "" });
    const [isLoading, setIsLoading] = useState(initialLoading);
    const [stockLoading, setStockLoading] = useState(false);
    const [showBox, setShowBox] = useState(false);
    const [notFound, setNotFound] = useState(false);

    const userId = parseInt(localStorage.getItem("user_id"));

    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    });

    let currPriceFormatted = formatter.format(response.current_price);

    useEffect(() => {
        const getStocks = () => {
            axios
                .get(
                    "https://finnhub.io/api/v1/stock/symbol?exchange=US&token=sandbox_c8ct8raad3i9nv0d14tg"
                )
                .then((res) => {
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
        if (!response.stock_symbol) {
            getStocks();
        } else {
            setFormValues({
                ...formValues,
                stockSymbol: response.stock_symbol,
            });
            setShowBox(true);
        }
    }, []);

    const getStockData = (stockSymbol, stockName) => {
        axios
            .get(
                `https://finnhub.io/api/v1/quote?symbol=${stockSymbol}&token=sandbox_c8ct8raad3i9nv0d14tg`
            )
            .then((res) => {
                setResponse({
                    ...response,
                    stock_symbol: stockSymbol,
                    stock_name: stockName,
                    current_price: parseFloat(res.data.c.toFixed(2)),
                    user_id: userId,
                });
                setStockLoading(false);
                setNotFound(false);
            })
            .catch((error) => console.error("error", error));
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        const symbol = value.split(" ")[0];
        setFormValues({ ...formValues, [name]: symbol });
    };

    const handleOptionSelect = (e) => {
        if (String(e.nativeEvent).split(" ")[1][0] === "E" && e.target.value) {
            setShowBox(true);
            setStockLoading(true);
            const stockSymbol = e.target.value.split(" ")[0];
            const stockObj = stocks.find((obj) => obj.symbol === stockSymbol);
            const stockName = stockObj.name;
            getStockData(stockSymbol, stockName);
        }
    };

    const handleRandom = (e) => {
        e.preventDefault();
        setShowBox(true);
        setStockLoading(true);
        const rand = Math.floor(Math.random() * stocks.length);
        const stockObj = stocks[rand];
        getStockData(stockObj.symbol, stockObj.name);
        setFormValues({ ...formValues, stockSymbol: stockObj.symbol });
    };

    const handleSubmit = (e) => {
        console.log("response before submit", response);
        e.preventDefault();
        setShowBox(true);
        setStockLoading(true);
        const symbolFormatted = formValues.stockSymbol.toUpperCase();
        const stockObj = stocks.find((obj) => obj.symbol === symbolFormatted);
        if (!stockObj) {
            setNotFound(true);
            setStockLoading(false);
        } else {
            const stockName = stockObj.name;
            getStockData(symbolFormatted, stockName);
        }
    };

    const handleSelect = () => {
        setPageIndex(pageIndex + 1);
    };

    return (
        <div className="card">
            <h2 className="number">1</h2>
            <div className="content">
                <h3 className="stock-title">CHOOSE A STOCK:</h3>
                {isLoading ? (
                    <img className="main-spinner" src={Spinner} alt="spinner" />
                ) : (
                    <div className="main-spinner"></div>
                )}
                <div>
                    <div
                        className={
                            isLoading
                                ? "stock-input-wrapper hide"
                                : "stock-input-wrapper"
                        }
                    >
                        <datalist id="suggestions">
                            {stocks.map((item, i) => {
                                return (
                                    <option
                                        key={i}
                                    >{`${item.symbol} (${item.name})`}</option>
                                );
                            })}
                        </datalist>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="search"
                                results
                                name="stockSymbol"
                                value={formValues.stockSymbol}
                                onChange={handleFormChange}
                                onInput={handleOptionSelect}
                                autoComplete="on"
                                list="suggestions"
                            />
                        </form>
                        <button
                            onClick={handleRandom}
                            className={
                                stockLoading
                                    ? "disabled random-button"
                                    : "random-button"
                            }
                            disabled={stockLoading}
                        >
                            RANDOM
                        </button>
                    </div>
                    <div className={showBox ? "stock-box" : "stock-box hide"}>
                        {stockLoading ? (
                            <img
                                className="small-spinner"
                                src={Spinner}
                                alt="spinner"
                            />
                        ) : notFound ? (
                            <div className="stock-display-container">
                                <p className="stock-name-display">
                                    STOCK NOT FOUND
                                </p>
                            </div>
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
                    <button
                        onClick={handleSelect}
                        className={`${
                            stockLoading || notFound || !response.stock_symbol
                                ? "disabled select-button"
                                : "select-button"
                        } ${showBox ? "" : "hide"}`}
                        disabled={
                            stockLoading || notFound || !response.stock_symbol
                        }
                    >
                        SELECT
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChooseStock;
