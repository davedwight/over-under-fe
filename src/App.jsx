import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import moment from 'moment';
import Modal from './Modal.jsx';

let now = moment().format('YYYY-MM-DDTHH:mm');

setInterval(() => {
    now = moment().format('YYYY-MM-DDTHH:mm');
}, 1000);

const initialSubmissionData = {
    email: "",
    phone: "",
    stock: "",
    price: "",
    vote: "",
    vote_time: "",
    exp_time: "",
}

function App() {
    const [stocks, setStocks] = useState([]);
    const [selectedStock, setSelectedStock] = useState("");
    const [currPrice, setCurrPrice] = useState("");
    const [formValues, setFormValues] = useState({stockSymbol: ''});
    const [vote, setVote] = useState("");
    const [submission, setSubmission] = useState(initialSubmissionData);
    const [expDate, setExpDate] = useState(now);

    let nowFormat = moment(now);
    let expDateFormat = moment(expDate);
    let timeTilExp = expDateFormat.diff(nowFormat, 'seconds');
    let daysTilExp = Math.floor(timeTilExp / (60*60*24));
    let hrsTilExp = Math.floor((timeTilExp % (60*60*24)) / (60*60));
    let minsTilExp = Math.floor(((timeTilExp % (60*60*24)) % (60*60)) / 60);

    console.log('now', now);
    console.log('nowFormat', nowFormat);
    console.log('timeTilExp', timeTilExp);

    const updateForm = (inputName, inputValue) => {
    setFormValues({ ...formValues, [inputName]: inputValue})
  }
    
    useEffect(() => {
        const getStocks = () => {
        axios
            .get("https://finnhub.io/api/v1/stock/symbol?exchange=US&token=sandbox_c8ct8raad3i9nv0d14tg")
            .then(res => {
                const stocksArr = [];
                res.data.map(item => {
                    stocksArr.push(item.symbol);
                })
                setStocks(stocksArr);
            })
            .catch(error => console.log("error", error));
        };
        getStocks();
    }, []);

    const getPrice = (stock) => {
        axios
            .get(`https://finnhub.io/api/v1/quote?symbol=${stock}&token=sandbox_c8ct8raad3i9nv0d14tg`)
            .then(res => {
                console.log("price res", res);
                setCurrPrice(res.data.c)
            })
            .catch(error => console.log("error", error));
    };

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormValues({ ...formValues, [name]: value})
    }
    
    const handleSelect = (e) => {
        e.preventDefault();
        const stock = formValues.stockSymbol;
        setSelectedStock(stock);
        getPrice(stock);
    }

    const handleVote = (value) => {
        if (value === "increase") {
            setVote("increase");
        } else {
            setVote("decrease");
        };
    }

    const handleDateChange = (e) => {
        setExpDate(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmission({
            ...submission,
            stock: formValues.stockSymbol,
            price: currPrice,
            vote,
            exp_time: expDate,
        });
    }
    console.log("submission", submission);
  
    return ( 
        <main>
            <div>
                <h1>OVER / UNDER</h1>
                <div className="wrapper">
                    <div>
                        <p>Select stock:</p>
                        <datalist id="suggestions">
                            {stocks.map((item, i) => {
                                return <option key={i}>{item}</option>
                            })}
                        </datalist>
                        <form onSubmit={handleSelect}>
                            <input 
                                name="stockSymbol"
                                value={formValues.stockSymbol}
                                onChange={handleChange}
                                autoComplete="on" 
                                list="suggestions" /> 
                            <button className="select-button">Select</button>
                        </form>
                    </div>
                    {selectedStock ? <p>{`Current share price of ${selectedStock}: $${currPrice}`}</p> : ""}
                    <div className="date-container">
                        <label htmlFor="expiration"><p>Select an expiration date and time:</p></label>
                        <input
                            id="expiration" 
                            type="datetime-local" 
                            name="expirationdate" 
                            value={expDate}
                            onChange={handleDateChange}
                            min={now}
                        >
                        </input>
                    </div>
                    {expDate < now ? <p className="warning">Please select an expiration date later than the current time</p> : ""}
                    {expDate > now ? <p>Vote expires in {daysTilExp} days, {hrsTilExp} hours, 
 and {minsTilExp} minutes</p> : ""}
                    <p>Vote whether the share price will increase or decrease from the current value at the expiration date</p>
                    <div className="button-container">
                        <button onClick={() => handleVote("increase")} className={`increase ${vote === "increase" ? "selected selected-increase" : ""}`}>Increase</button>
                        <button onClick={() => handleVote("decrease")} className={`decrease ${vote === "decrease" ? "selected selected-decrease" : ""}`}>Decrease</button>
                    </div>
                    <button className="submit-button" onClick={handleSubmit}>Submit</button>
                    <Modal submission={submission}/>
                </div>
            </div>
        </main>
    );
}

export default App;