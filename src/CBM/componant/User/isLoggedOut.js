import React from "react";
import {logout} from "../../../api";
import md5 from 'md5-hash';
import {clearLocalStorage, getItemFromLocalStorage, removeItemFromLocalStorage, setItemInLocalStorage} from "../../../RTCM/common/helper";

let status;

const onSuccess = (res) => {
    if (res.status === 200 ) {
        if (res.data.isLoggedout === true) {
            let temp = getItemFromLocalStorage('rduin');
            if(!temp){
                status = true;
            } else{
                setItemInLocalStorage(md5(temp), false);
                status = true;
            }

            let username =  getItemFromLocalStorage("ssAppLoginUserName");
            let password = getItemFromLocalStorage("ssAppLoginUserPassword");
            let checked = getItemFromLocalStorage("ssAppLoginUserRememberMeChecked");
            let allUpdatedTimestampData = getItemFromLocalStorage('lastUpdatedHeaderTime');

            clearLocalStorage();

            if(username && password && checked) {
                setItemInLocalStorage("ssAppLoginUserName", username);
                setItemInLocalStorage("ssAppLoginUserPassword", password);
                setItemInLocalStorage("ssAppLoginUserRememberMeChecked", checked);
            }
            if (allUpdatedTimestampData){
                setItemInLocalStorage("lastUpdatedHeaderTime", JSON.stringify(allUpdatedTimestampData));
            }
        } else {
                removeItemFromLocalStorage("rduin");
                status = true;
            }
        }
};

const onFailure =(err)=>{
    status = false;
};

export const isLoggedOut = async (payload= {a:"a"}) => {
    await logout(onSuccess, onFailure, payload);
    return status;
};