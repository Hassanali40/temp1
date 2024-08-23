import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import { initializeIcons } from "@fluentui/react";

import "./admin.css";

import Layout from "./pages/layout/Layout";
import NoPage from "./pages/NoPage";
import Admin from "./pages/admin/Admin";
import AdminLayout from "./pages/admin-layout/AdminLayout";
import AdvisorProfile from "./pages/AdvisorProfile/AdvisorProfile";
import IngestData from "./pages/ingest-data/IngestData";
import Configuration from "./pages/config/Configuration";
import ExploreData from "./pages/explore-data/ExploreData";

initializeIcons();

export default function AdminApp() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<AdminLayout />}>
                    <Route path="/" element={<IngestData />} />

                    <Route path="/explore" element={<ExploreData/>} />
                    <Route path="/config" element={<Configuration />} />
                    <Route path="*" element={<NoPage />} />
                </Route>
            </Routes>
        </HashRouter>
    );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <AdminApp />
    </React.StrictMode>
);
