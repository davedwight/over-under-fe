import React from "react";
import { Outlet } from "react-router-dom";

function Layout() {
    return (
        <div className="main-wrapper">
            <header>
                <h1>OVER / UNDER</h1>
            </header>
            <Outlet />
        </div>
    );
}

export default Layout;
