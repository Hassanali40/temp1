import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import { initializeIcons } from "@fluentui/react";
import NoPage from "../src/pages/NoPage";
import MainPage from './page/main-page/MainPage'
import { AppProvider } from './store/context/AppContext';
import { ApiService } from './services'

import './main.css'

const baseUrl = import.meta.env.VITE_ATP || "";
ApiService.init(baseUrl, 'api');

initializeIcons();

export default function App() {
    return (
        <HashRouter>
            <AppProvider>
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="*" element={<NoPage />} />
                </Routes>
            </AppProvider>
        </HashRouter>
    );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
