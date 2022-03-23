import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useOutletContext } from "react-router-dom";
import "../App.css";

import BackArrow from "../assets/backArrow.svg";
import ForwardArrow from "../assets/forwardArrow.svg";
import ViewStock from "../components/ViewStock";
import ViewTime from "../components/ViewTime";
import ChooseValue from "../components/ChooseValue";
import Share from "../components/Share";

function Secondary() {
    const [
        response,
        setResponse,
        showCountdown,
        setShowCountdown,
        layoutTimes,
    ] = useOutletContext();

    let { primary_response_id } = useParams();
    const intPrimaryResponseId = parseInt(primary_response_id);

    const [shareLinkParam, setShareLinkParam] = useState(null);
    const [pageIndex, setPageIndex] = useState(0);

    const pages = [
        <ViewStock
            response={response}
            setResponse={setResponse}
            primaryResponseId={intPrimaryResponseId}
        />,
        <ViewTime response={response} />,
        <ChooseValue
            response={response}
            setResponse={setResponse}
            setShareLinkParam={setShareLinkParam}
            setPageIndex={setPageIndex}
            pageIndex={pageIndex}
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

    const handleBack = () => {
        setPageIndex(pageIndex - 1);
    };

    const handleForward = () => {
        setPageIndex(pageIndex + 1);
    };

    return (
        <div className="lower-wrapper">
            {pageIndex > 0 && pageIndex < pages.length - 1 ? (
                <div className="arrow">
                    <img
                        onClick={handleBack}
                        src={BackArrow}
                        alt="back-arrow"
                    />
                </div>
            ) : (
                <button className="arrow"></button>
            )}

            {pages[pageIndex]}

            {pageIndex === 0 || pageIndex === 1 ? (
                <div className="arrow">
                    <img
                        onClick={handleForward}
                        src={ForwardArrow}
                        alt="forward-arrow"
                    />
                </div>
            ) : (
                <button className="arrow"></button>
            )}
        </div>
    );
}

export default Secondary;
