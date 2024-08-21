import { Outlet, Link, NavLink } from "react-router-dom";
import styles from "./AdminLayout.module.css";
import { Stack } from "@fluentui/react";
import { ClockDismiss24Filled, ClockDismiss24Regular, ClosedCaption24Regular, Dismiss20Regular, Dismiss24Regular } from "@fluentui/react-icons";

const AdminLayout = () => {

    return (
        <div className={styles.layout}>
            <Stack horizontal grow={1}>
                <Stack className={styles.asideContainer}>
                    <div className={styles.dismissButton}><a href="/" className={styles.headerTitleButton}><Dismiss20Regular /></a></div>
                    <aside>
                        <span>Admin</span>
                        <nav>
                            <ul className={styles.navItems}>
                                <li>
                                    <NavLink to="/" className={(navData) => (navData.isActive ? styles.active : "")}>Ingest Data</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/explore" className={(navData) => (navData.isActive ? styles.active : "")}>Explore Data</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/config" className={(navData) => (navData.isActive ? styles.active : "")}>Configuration</NavLink>
                                </li>
                            </ul>
                        </nav>
                    </aside>
                </Stack>
                <Outlet />
            </Stack>
        </div>
    );
};

export default AdminLayout;
