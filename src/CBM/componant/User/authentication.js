// import {validatePrivateRoute, validateUser} from "../../../api";
import {validateUser} from "../../../api";

import md5 from 'md5-hash';
import {getItemFromLocalStorage, removeItemFromLocalStorage, setItemInLocalStorage} from "../../../RTCM/common/helper";

let isAuth;

const onSuccess = (res) => {
    if (res.status === 200 ) {
            if (res.data.isvalid) {
                setItemInLocalStorage('rduin', res.data.id);
                setItemInLocalStorage('email', res.data.Email);
                setItemInLocalStorage('firstName', res.data.FirstName);
                setItemInLocalStorage('createRules', res.data.CreateRules);
                setItemInLocalStorage('createShips', res.data.CreateShips);
                setItemInLocalStorage('role', res.data.Role);
                setItemInLocalStorage('companyName', res.data.CompanyName);
                setItemInLocalStorage('companyLogo', res.data.CompanyLogo);
                setItemInLocalStorage('editRules',res.data.editRules);
                setItemInLocalStorage('ScreenMapping',JSON.stringify(res.data.ScreenMapping));
                setItemInLocalStorage('DefaultScreenMapping',JSON.stringify(res.data.DefaultScreenMapping));
                setItemInLocalStorage(md5(getItemFromLocalStorage('rduin')), res.data.isvalid);
                isAuth = 1;
            } else if(!res.data.login && res.data.msg === "The username is not registered yet.") {
                isAuth = 0;
                getAndRemoveLoginItem()
            } else {
                isAuth = -1;
                getAndRemoveLoginItem();
            }


    }
};

const getAndRemoveLoginItem = () => {
    let temp = getItemFromLocalStorage('rduin');
    if (!temp) temp = "RDUIN";

    removeItemFromLocalStorage(md5(temp));
}

const onSuccessload = (res) => {
    if (res.status === 200 ) {
        if (res.data.isvalid === true ) {
            isAuth = res.data;
        } else {
            isAuth = res.data;
        }
    }
};

const onFailure = (error) => {
    if(error.response && error.response.status === 403) {
        alert(JSON.stringify(error.response.data.CreateShips))
        if(error.response.data) {
            if("user is not authorized to visit this page" === error.response.data.msg){
                setItemInLocalStorage('ScreenMapping',JSON.stringify(error.response.data.ScreenMapping));
                setItemInLocalStorage('DefaultScreenMapping',JSON.stringify(error.response.data.DefaultScreenMapping));
                setItemInLocalStorage('createShips', error.response.data.CreateShips);
                isAuth = 3;
            } else {
                setItemInLocalStorage('ScreenMapping',JSON.stringify(error.response.data.ScreenMapping));
                setItemInLocalStorage('DefaultScreenMapping',JSON.stringify(error.response.data.DefaultScreenMapping));
                setItemInLocalStorage('createShips', error.response.data.CreateShips);
                isAuth = 4;
            }
        }
    } else {
        isAuth = 2;
        let temp = getItemFromLocalStorage('rduin');
        if (!temp) temp = "RDUIN";
        removeItemFromLocalStorage(md5(temp));
        removeItemFromLocalStorage('rduin');
    }
    return isAuth;
};

export const getUser = async (payload) => {
    await validateUser(onSuccess, onFailure, payload);
    return isAuth;
};

// export const getAuthenticatedRoute = async (payload) => {
//     await validatePrivateRoute(onSuccess, onFailure, payload);
//     return isAuth;
// };

export const getUserData = async (payload = {Email: "abc", Password: "123"}) => {
    await validateUser(onSuccessload, onFailure, payload);
    return isAuth;
};
