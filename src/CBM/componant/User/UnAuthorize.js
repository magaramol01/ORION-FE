import React, {useEffect, useState} from 'react';
import {getRedirectionPage} from "../../../RTCM/common/helper";
import {NavLink} from "react-router-dom";


function UnAuthorize() {
    let [defaultPage, setDefaultPage] = useState("");
    useEffect(() => {
        const defaultPage = getRedirectionPage();
        setDefaultPage(defaultPage);
    }, []);
    return (
        <div>
            <div>You are not Authorize to access this page.</div>
            <NavLink
                className="navbar-item"
                activeClassName="is-active"
                to={`/${defaultPage}`}
                exact
            >
                go to home screen
            </NavLink>
        </div>
    );
}

UnAuthorize.propTypes = {};

export default UnAuthorize;
