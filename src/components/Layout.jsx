import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import setAllLayoutTimes from "../utils/setAllLayoutTimes";
import { axiosWithAuth } from "../utils/axiosWithAuth";
import axios from "axios";

const initialLayoutTimes = {
    expiration_mins: null,
    expiration_secs: null,
    respond_mins: null,
    respond_secs: null,
};

const user_id = localStorage.getItem("user_id");

const initialResponseData = {
    user_id: user_id,
    stock_symbol: "",
    stock_name: "",
    start_price: null,
    response_value: "",
    response_length: null,
    expiration_time: "",
    primary_response: null,
    primary_response_time: null,
    created_at: "",
    updated_at: "",
    exchange: "",
};

const responseTimes = {
    1: 1,
    5: 2,
    10: 2,
    15: 2,
    30: 2,
    60: 2,
};

function Layout(props) {
    const { setUserIdState } = props;
    const [showCountdown, setShowCountdown] = useState(false);
    const [layoutTimes, setLayoutTimes] = useState(initialLayoutTimes);
    const [response, setResponse] = useState(initialResponseData);
    const [voteNotFound, setVoteNotFound] = useState(false);
    const [marketOpen, setMarketOpen] = useState(true);
    let navigate = useNavigate();
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");
    let { primary_response_id } = useParams();
    const intPrimaryResponseId = parseInt(primary_response_id);

    useEffect(() => {
        axios
            .get(
                `https://financialmodelingprep.com/api/v3/is-the-market-open?apikey=dc42d2fc303bf94114368ba30a7c05c6`
            )
            .then((res) => {
                const marketOpen = res.data.isTheStockMarketOpen;
                if (!marketOpen) {
                    setMarketOpen(false);
                } else if ((!token || !userId) && primary_response_id) {
                    localStorage.clear();
                    setUserIdState(null);
                    navigate(`/login/vote/${intPrimaryResponseId}`);
                } else if (!token || !userId) {
                    localStorage.clear();
                    setUserIdState(null);
                    navigate("/login");
                } else {
                    handleLogin();
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    useEffect(() => {
        if (response.expiration_time) {
            setAllLayoutTimes(
                layoutTimes,
                setLayoutTimes,
                response,
                responseTimes
            );

            const interval = setInterval(() => {
                setAllLayoutTimes(
                    layoutTimes,
                    setLayoutTimes,
                    response,
                    responseTimes
                );
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [response]);

    const handleLogin = () => {
        axiosWithAuth()
            .get(`/users/${userId}`)
            .then((res) => {
                if (res.status === 200 && primary_response_id) {
                    console.log(
                        `User ${res.data.user_id} successfully verified`
                    );
                    navigate(`/vote/${intPrimaryResponseId}`);
                } else if (res.status === 200) {
                    console.log(
                        `User ${res.data.user_id} successfully verified`
                    );
                    navigate("/vote");
                } else {
                    console.log(
                        `Error code: ${res.status} \n
                    Error message: ${res.data.message}\n
                    Please login`
                    );
                    localStorage.clear();
                    setUserIdState(null);
                    navigate("/login");
                }
            })
            .catch((err) => {
                console.error("couldn't verify token", err);
                localStorage.clear();
                navigate("/login");
            });
    };

    return (
        <div className="layout">
            <div className="countdown-wrapper">
                {layoutTimes.respond_mins < 0 ||
                layoutTimes.respond_secs < 0 ? (
                    <h3
                        className={
                            showCountdown ? "countdown" : "countdown hide"
                        }
                    >
                        RESPONSE TIME EXPIRED
                    </h3>
                ) : (
                    <h3
                        className={
                            showCountdown ? "countdown" : "countdown hide"
                        }
                    >
                        TIME REMAINING TO RESPOND: {layoutTimes.respond_mins}m{" "}
                        {layoutTimes.respond_secs}s
                    </h3>
                )}
                {layoutTimes.expiration_secs < 0 ||
                layoutTimes.expiration_mins < 0 ? (
                    <h3
                        className={
                            showCountdown ? "countdown" : "countdown hide"
                        }
                    >
                        THIS OVER / UNDER HAS EXPIRED
                    </h3>
                ) : (
                    <h3
                        className={
                            showCountdown ? "countdown" : "countdown hide"
                        }
                    >
                        TIME REMAINING UNTIL EXPIRATION:{" "}
                        {layoutTimes.expiration_mins}m{" "}
                        {layoutTimes.expiration_secs}s
                    </h3>
                )}
            </div>
            {!marketOpen ? (
                <div className="not-found">
                    <h3>
                        MARKET CLOSED. PLEASE REVISIT DURING NORMAL MARKET
                        HOURS.
                    </h3>
                </div>
            ) : voteNotFound ? (
                <div className="not-found">
                    <h3>VOTE INFORMATION NOT FOUND</h3>
                </div>
            ) : (
                <Outlet
                    context={[
                        response,
                        setResponse,
                        showCountdown,
                        setShowCountdown,
                        layoutTimes,
                        voteNotFound,
                        setVoteNotFound,
                    ]}
                />
            )}
        </div>
    );
}

export default Layout;
