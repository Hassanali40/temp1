import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import { initializeIcons } from "@fluentui/react";
import Layout from "../src/pages/layout/Layout";
import NoPage from "../src/pages/NoPage";
import MainPage from './page/main-page/MainPage'
import './main.css'
initializeIcons();

export default function App() {
    return (
        <HashRouter>
            <Routes>
                    <Route path="/" element={<MainPage />} />

                    <Route path="*" element={<NoPage />} />
            </Routes>
        </HashRouter>
    );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
