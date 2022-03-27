import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import Login from "./components/Login";
import Layout from "./components/Layout";
import Primary from "./userFlows/Primary";
import Secondary from "./userFlows/Secondary";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route path="/login" element={<Login />} />
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
