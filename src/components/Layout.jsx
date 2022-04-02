import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import moment from "moment";
import setAllLayoutTimes from "../utils/setAllLayoutTimes";
import logo from "../assets/overunderlogolarge.png";

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
    current_price: null,
    response_value: "",
    response_length: null,
    expiration_time: "",
    primary_response: null,
    created_at: "",
    exchange: "",
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
    const [voteNotFound, setVoteNotFound] = useState(false);
    let navigate = useNavigate();
    const token = localStorage.getItem("token");
    let { primary_response_id } = useParams();
    const intPrimaryResponseId = parseInt(primary_response_id);

    let responseExpirationTime = null;
    let voteExpirationTime = null;

    useEffect(() => {
        if (token && primary_response_id) {
            navigate(`/vote/${intPrimaryResponseId}`);
        } else if (token && primary_response_id) {
            navigate(`/vote/${primary_response_id}`);
        } else if (token) {
            navigate("/vote");
        } else {
            console.log("here");
            navigate("/login");
        }
    }, []);

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

    return voteNotFound ? (
        <>
            <header>
                <img className="logo" src={logo} alt="logo" />
            </header>
            <div className="not-found">
                <h3>VOTE INFORMATION NOT FOUND</h3>
            </div>
        </>
    ) : (
        <>
            <header>
                <img className="logo" src={logo} alt="logo" />
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
                    voteNotFound,
                    setVoteNotFound,
                ]}
            />
        </>
    );
}

export default Layout;
