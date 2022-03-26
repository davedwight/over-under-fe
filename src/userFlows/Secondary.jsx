import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useOutletContext } from "react-router-dom";
import "../App.css";

import SecondaryVote from "../components/SecondaryVote";
import Share from "../components/Share";

function Secondary() {
    const [
        response,
        setResponse,
        showCountdown,
        setShowCountdown,
        layoutTimes,
        voteNotFound,
        setVoteNotFound,
    ] = useOutletContext();

    let { primary_response_id } = useParams();
    const intPrimaryResponseId = parseInt(primary_response_id);

    const [shareLinkParam, setShareLinkParam] = useState(null);
    const [pageIndex, setPageIndex] = useState(0);

    const pages = [
        <SecondaryVote
            response={response}
            setResponse={setResponse}
            primaryResponseId={intPrimaryResponseId}
            setShareLinkParam={setShareLinkParam}
            setPageIndex={setPageIndex}
            pageIndex={pageIndex}
            layoutTimes={layoutTimes}
            setVoteNotFound={setVoteNotFound}
        />,
        <Share
            response={response}
            shareLinkParam={shareLinkParam}
            layoutTimes={layoutTimes}
        />,
    ];

    useEffect(() => {
        setShowCountdown(true);
    }, []);

    return <div className="lower-wrapper">{pages[pageIndex]}</div>;
}

export default Secondary;
