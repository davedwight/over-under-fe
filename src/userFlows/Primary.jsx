import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import "../App.css";

import BackArrow from "../assets/backArrow.svg";
import ForwardArrow from "../assets/forwardArrow.svg";
import ChooseStock from "../components/ChooseStock";
import ChooseTime from "../components/ChooseTime";
import ChooseValue from "../components/ChooseValue";
import Share from "../components/Share";

function Primary() {
    const [
        response,
        setResponse,
        showCountdown,
        setShowCountdown,
        layoutTimes,
    ] = useOutletContext();
    const [stocks, setStocks] = useState([]);
    const [shareLinkParam, setShareLinkParam] = useState(null);
    const [pageIndex, setPageIndex] = useState(0);

    const pages = [
        <ChooseStock
            response={response}
            setResponse={setResponse}
            stocks={stocks}
            setStocks={setStocks}
        />,
        <ChooseTime
            response={response}
            setResponse={setResponse}
            pageIndex={pageIndex}
            setPageIndex={setPageIndex}
        />,
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

            {pageIndex === 0 ? (
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

export default Primary;
