import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import setAllLayoutTimes from "../utils/setAllLayoutTimes";

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
    const [voteNotFound, setVoteNotFound] = useState(false);
    let navigate = useNavigate();
    const token = localStorage.getItem("token");
    let { primary_response_id } = useParams();
    const intPrimaryResponseId = parseInt(primary_response_id);

    useEffect(() => {
        if (token && primary_response_id) {
            navigate(`/vote/${intPrimaryResponseId}`);
        } else if (token && primary_response_id) {
            navigate(`/vote/${primary_response_id}`);
        } else if (token) {
            navigate("/vote");
        } else if (!token && primary_response_id) {
            navigate(`/login/vote/${primary_response_id}`);
        } else {
            navigate("/login");
        }
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
            {voteNotFound ? (
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
