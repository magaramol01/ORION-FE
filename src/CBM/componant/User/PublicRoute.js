import React from 'react'
import { Route, Redirect } from 'react-router-dom';
import md5 from 'md5-hash';
import {getItemFromLocalStorage} from "../../../RTCM/common/helper";

const PublicRoute =  ({component: Component, ...rest}) => {

    let temp = getItemFromLocalStorage('rduin');
    if(!temp) temp = "RDUIN";
    let isLoggedIn = getItemFromLocalStorage(md5(temp)) === "true";

    return (
        <Route
            {...rest}
            render={props =>
                !isLoggedIn ? (
                    <Component {...props} />
                ) : (
                    <Redirect to={{pathname: '/', state: {from: props.location}}}/>
                )
            }
        />
    )

}

export default PublicRoute;