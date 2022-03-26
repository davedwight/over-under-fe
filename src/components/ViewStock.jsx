import React, { useState, useEffect } from "react";
import "../App.css";
import axios from "axios";
import Spinner from "../assets/spinner.svg";

function ViewStock(props) {
    const { response, setResponse, primaryResponseId } = props;

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);

        const getStockInfo = () => {
            axios
                .get(
                    // `https://over-under-vote.herokuapp.com/api/responses/${primaryResponseId}`
                    `http://localhost:9000/api/responses/${primaryResponseId}`
                )
                .then((res) => {
                    setResponse({
                        ...response,
                        stock_name: res.data[0].stock_name,
                        stock_symbol: res.data[0].stock_symbol,
                        current_price: res.data[0].current_price,
                        response_length: res.data[0].response_length,
                        expiration_time: res.data[0].expiration_time,
                        created_at: res.data[0].created_at,
                        primary_response: primaryResponseId,
                    });
                    setIsLoading(false);
                })
                .catch((error) => console.error("error", error));
        };
        response.stock_symbol === "" ? getStockInfo() : setIsLoading(false);
    }, []);

    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    });

    let currPriceFormatted = formatter.format(response.current_price);

    return (
        <div className="card">
            <h2 className="number">1</h2>
            <div className="content">
                <h3>SELECTED STOCK:</h3>
                {response.stock_symbol != "" ? (
                    <div className="stock-box">
                        {isLoading ? (
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
        </div>
    );
}

export default ViewStock;
