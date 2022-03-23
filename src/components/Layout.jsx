import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import moment from "moment";
import setAllLayoutTimes from "../utils/setAllLayoutTimes";

const initialLayoutTimes = {
    expiration_mins: null,
    expiration_secs: null,
    respond_mins: null,
    respond_secs: null,
};

const initialResponseData = {
    user_id: 2,
    stock_symbol: "",
    stock_name: "",
    current_price: null,
    response_value: "",
    response_length: null,
    expiration_time: "",
    primary_response: null,
    created_at: "",
};

const responseTimes = {
    5: 5,
    10: 5,
    15: 5,
    30: 10,
    60: 15,
};

function Layout() {
    const [showCountdown, setShowCountdown] = useState(false);
    const [layoutTimes, setLayoutTimes] = useState(initialLayoutTimes);
    const [response, setResponse] = useState(initialResponseData);
    let responseExpirationTime = null;
    let voteExpirationTime = null;

    useEffect(() => {
        if (response.created_at) {
            responseExpirationTime = moment(response.created_at)
                .add(responseTimes[response.response_length], "minutes")
                .format();

            voteExpirationTime = moment(response.created_at)
                .add(response.response_length, "minutes")
                .format();

            setAllLayoutTimes(
                layoutTimes,
                setLayoutTimes,
                responseExpirationTime,
                voteExpirationTime
            );

            const interval = setInterval(() => {
                setAllLayoutTimes(
                    layoutTimes,
                    setLayoutTimes,
                    responseExpirationTime,
                    voteExpirationTime
                );
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [response]);

    return (
        <div className="main-wrapper">
            <header>
                <h1>OVER / UNDER</h1>
            </header>
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
            <Outlet
                context={[
                    response,
                    setResponse,
                    showCountdown,
                    setShowCountdown,
                    layoutTimes,
                ]}
            />
        </div>
    );
}

export default Layout;
