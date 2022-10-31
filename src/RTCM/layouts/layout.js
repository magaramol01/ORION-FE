import React from 'react';
import {useLocation} from "react-router-dom";

export const RTCMLayout = (props) => {
    let location = useLocation();
    const url = location.pathname;
    let cssClass = "";

    if (url === "/" || url === "/FleetDashboard" || url === "/DashboardHome" || url === "/MainEngineHome" || url === "/MainGaugesHome" || url === "/EEOI"|| url === "/Navigation") {
        cssClass = "RTCM-layout";
    }

    return (
        <div className={"page-layout " + cssClass}>
            {props.children}
        </div>
    )
};
