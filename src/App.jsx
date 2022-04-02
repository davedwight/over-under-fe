import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PhoneNumber from "./components/PhoneNumber";
import Otp from "./components/Otp";
import Layout from "./components/Layout";
import Primary from "./userFlows/Primary";
import Secondary from "./userFlows/Secondary";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route path="/login" element={<PhoneNumber />} />
                        <Route path="/login/:phone_number" element={<Otp />} />
                        <Route path="/vote" element={<Primary />} />
                        <Route
                            path="/vote/:primary_response_id"
                            element={<Secondary />}
                        />
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
