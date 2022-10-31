import React from 'react'
import {Route, Redirect, useHistory, withRouter} from 'react-router-dom';
import md5 from 'md5-hash';
// import {getAuthenticatedRoute, getUser} from './authentication';
import { getUser} from './authentication';
import {getItemFromLocalStorage, getRedirectionPage} from "../../../RTCM/common/helper";
import {pathScreenMapping} from "../Constants";


const getLocationPath = () => {
    let locationPath = "";
    const linkLoc = (window.location.href).split("#/");
    if(linkLoc[1]) {
        locationPath = linkLoc[1];
    } else {
        const linkLocArr = linkLoc[0].split('/');
        if(linkLocArr[linkLocArr.length - 1]) {
            locationPath = linkLocArr[linkLocArr.length - 1];
        }
    }

    if(locationPath === "" || ["MainGaugesHome", "MainEngineHome", "DashboardHome", "DashboardPage", "DashboardPage2", "Ships","MainEngineSF","FleetDashboard","DigitalAlarmHome","NanjingME","Alarm"].indexOf(locationPath) > -1) {
        //todo private route for backend is handled for above array
        return {
            newRoute: true,
            locationPath: locationPath ? pathScreenMapping[locationPath] : ""
        };
    } else {
        return {
            newRoute: false,
            locationPath: pathScreenMapping[locationPath]
        };
    }
}

const PrivateRoute =  ({component: Component,props, ...rest}) => {
    let history = useHistory();
    // const {newRoute, locationPath} = getLocationPath();
    // if(newRoute) {
    //     getAuthenticatedRoute({locationPath}).then(r=>{
    //         if(r === 3) {
    //             history.push('/UnAuthorize');
    //         } else if(r === 4) {
    //             const defaultHomeScreen = getRedirectionPage();
    //             history.push(`/${defaultHomeScreen}`);
    //         } else  if (r !==1) {
    //             history.push('/UserLogin');
    //         }
    //     });
    // } else {
        getUser().then(r=>{
            if(r !==1) {
                history.push('/UserLogin');
            }
        });
   // }

    let temp = getItemFromLocalStorage('rduin');
    if(!temp) temp = "RDUIN";
    let isLoggedIn = getItemFromLocalStorage(md5(temp)) === "true";

    return (
        <Route
            {...rest}
            render={props =>
                isLoggedIn ? (
                    <Component {...props} />
                ) : (
                    <Redirect to={{pathname: '/UserLogin', state: {from: props.location}}}/>
                )
            }
        />
    )

};

export default PrivateRoute;
