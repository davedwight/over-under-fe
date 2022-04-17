import React, { useState, useEffect } from "react";
import "../App.css";
import axios from "axios";
import Spinner from "../assets/spinner.svg";
import searchIcon from "../assets/search-icon.svg";

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
    const [searchStocks, setSearchStocks] = useState([]);
    const [showCustomOption, setShowCustomOption] = useState(false);

    const userId = parseInt(localStorage.getItem("user_id"));

    const formatter = new Intl.NumberFormat("de-DE", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
    });
    let startPriceFormatted = formatter.format(response.start_price);

    useEffect(() => {
        const getStocks = () => {
            axios
                .get(
                    "https://finnhub.io/api/v1/stock/symbol?exchange=US&token=sandbox_c8ct8raad3i9nv0d14tg"
                )
                .then((res) => {
                    const stocksArr = [];
                    const stockTypes = [];
                    res.data.map((item) => {
                        if (!stockTypes.includes(item.type)) {
                            stockTypes.push(item.type);
                        }
                        stocksArr.push({
                            stock_symbol: item.symbol,
                            stock_name: item.description,
                        });
                    });
                    setStocks(stocksArr);
                    setIsLoading(false);
                })
                .catch((error) => {
                    setIsLoading(false);
                    console.error("error", error);
                });
        };
        if (!response.stock_symbol) {
            getStocks();
        } else {
            setFormValues({
                ...formValues,
                stockSymbol: response.stock_symbol.toUpperCase(),
            });
            setShowBox(true);
        }
    }, []);

    const getStockData = (stockSymbol, stockName) => {
        const getSymbolData = axios.get(
            `https://finnhub.io/api/v1/quote?symbol=${stockSymbol}&token=sandbox_c8ct8raad3i9nv0d14tg`
        );

        const getCompanyProfile = axios.get(
            `https://finnhub.io/api/v1/stock/profile/?symbol=${stockSymbol}&token=sandbox_c8ct8raad3i9nv0d14tg`
        );

        Promise.all([getSymbolData, getCompanyProfile])
            .then((values) => {
                setResponse({
                    ...response,
                    stock_symbol: stockSymbol,
                    stock_name: stockName,
                    start_price: parseFloat(
                        parseFloat(values[0].data.c).toFixed(2)
                    ),
                    user_id: userId,
                    // exchange: values[1].data.exchange,
                });
                setStockLoading(false);
                setNotFound(false);
            })
            .catch((err) => {
                setStockLoading(false);
                console.error("error: ", err);
            });
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        const symbol = value.split(" ")[0].toUpperCase();
        setFormValues({ ...formValues, [name]: symbol });
    };

    const handleOptionSelect = (e) => {
        if (String(e.nativeEvent).split(" ")[1][0] === "E" && e.target.value) {
            const stockSymbol = e.target.value.split(" ")[0];
            handleSubmit(null, stockSymbol);
        }
    };

    const handleRandom = (e) => {
        e.preventDefault();
        setShowBox(true);
        setStockLoading(true);
        const rand = Math.floor(Math.random() * stocks.length);
        const stockObj = stocks[rand];
        setSearchOptions(stockObj.stock_symbol);
        getStockData(stockObj.stock_symbol, stockObj.stock_name);
        setFormValues({
            ...formValues,
            stockSymbol: stockObj.stock_symbol.toUpperCase(),
        });
    };

    const setSearchOptions = (stockName) => {
        const searchVal = stockName.toUpperCase();
        const similarStocks = [];
        stocks.map((obj) => {
            const symbolStr = obj.stock_symbol
                .replace(/\s+/g, "")
                .toUpperCase();
            const nameStr = obj.stock_name.replace(/\s+/g, "").toUpperCase();
            if (`${symbolStr}${nameStr}`.includes(searchVal)) {
                similarStocks.push(obj);
            }
        });
        if (similarStocks.length < 100) {
            setShowCustomOption(false);
            setSearchStocks(similarStocks);
        } else {
            setShowCustomOption(true);
            setSearchStocks([]);
        }
    };

    const handleEnter = (e) => {
        const stockVal = formValues.stockSymbol.toUpperCase();
        if (e.key === "Enter") {
            handleSubmit(null, stockVal);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
    };

    const handleSubmit = (e, stockSymbol) => {
        e && e.preventDefault();
        const searchVal = e
            ? e.target[0].value.trim().toUpperCase()
            : stockSymbol.toUpperCase();
        setSearchOptions(searchVal);
        setShowBox(true);
        setStockLoading(true);
        const stockObj = stocks.find((obj) => obj.stock_symbol === searchVal);
        if (!stockObj) {
            setNotFound(true);
            setStockLoading(false);
        } else {
            const stockName = stockObj.stock_name;
            getStockData(searchVal, stockName);
        }
    };

    const handleSelectClick = () => {
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
                            {showCustomOption ? (
                                <option>
                                    SUBMIT MORE SPECIFIC SEARCH VALUE
                                </option>
                            ) : (
                                searchStocks.map((item, i) => {
                                    return (
                                        <option
                                            key={i}
                                            data-list-id={i}
                                        >{`${item.stock_symbol} (${item.stock_name})`}</option>
                                    );
                                })
                            )}
                        </datalist>
                        <form onSubmit={handleFormSubmit}>
                            <div class="input-icon">
                                <input
                                    // type="search"
                                    results
                                    name="stockSymbol"
                                    value={`${formValues.stockSymbol}`}
                                    onChange={handleFormChange}
                                    onInput={handleOptionSelect}
                                    onKeyDown={handleEnter}
                                    autoComplete="on"
                                    list="suggestions"
                                />
                                <i>
                                    <img
                                        className="search-icon"
                                        src={searchIcon}
                                        alt="search-icon"
                                    />
                                    <span>$</span>
                                </i>
                            </div>
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
                                <table className="choose-stock-table">
                                    <tr className="stock-name">
                                        <td>{response.stock_name}</td>
                                    </tr>
                                    <tr>
                                        <td>{response.stock_symbol}</td>
                                        <td className="stock-price-display">
                                            {startPriceFormatted}$
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleSelectClick}
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
