import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import PhoneNumber from "./components/PhoneNumber";
import Otp from "./components/Otp";
import Primary from "./userFlows/Primary";
import Secondary from "./userFlows/Secondary";
import MyBetsDrawer from "./components/MyBetsDrawer";

function App() {
    const initialUserId = localStorage.getItem("user_id");
    const [userIdState, setUserIdState] = useState(initialUserId);

    screen.orientation.lock("portrait-primary");

    return (
        <div className="App">
            <Routes>
                <Route
                    path="/"
                    element={
                        <MyBetsDrawer
                            setUserIdState={setUserIdState}
                            userIdState={userIdState}
                        />
                    }
                >
                    <Route path="/login" element={<PhoneNumber />} />
                    <Route
                        path="/login/:phone_number"
                        element={<Otp setUserIdState={setUserIdState} />}
                    />
                    <Route
                        path="/login/vote/:primary_response_id"
                        element={<PhoneNumber />}
                    />
                    <Route
                        path="/login/vote/:primary_response_id/:phone_number"
                        element={<Otp setUserIdState={setUserIdState} />}
                    />
                    <Route path="/vote" element={<Primary />} />
                    <Route
                        path="/vote/:primary_response_id"
                        element={<Secondary />}
                    />
                </Route>
            </Routes>
        </div>
    );
}

export default App;
