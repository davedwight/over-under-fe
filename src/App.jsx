import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Primary from "./userFlows/Primary";
import Secondary from "./userFlows/Secondary";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Primary />} />
                        <Route
                            path=":primary_response_id"
                            element={<Secondary />}
                        />
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
