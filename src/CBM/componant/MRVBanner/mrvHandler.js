import {getMRVBannerData,
    saveMrvBannerData,
    deleteVBDataById,
    getVBDataById,
    upadateVBDataById,
  
} from "../../../api";
import {escFunction, getItemFromLocalStorage, getShipName, getVesselId, setItemInLocalStorage} from "../../../RTCM/common/helper";
const mrvDataarr = [];

let mrvData;
let isMRVRegistered=0;
let isVBDeleted=0;
let doesShipExists=0;
let isVBUpdated=0;
let areShipsCreated=0;


const onLoadMrvSuccess = (res) => {
 
    if (res.status === 200 ) {
     
        if(res.data[0]){
            mrvData = res.data;
            mrvData.isSuccess = 1;
        }
        else {
            mrvData = mrvDataarr;
            mrvData.isSuccess = 0;
        }
      
    }
}

const onLoadMrvFailure =(err)=>{
    //console.log("Error Loading Ship Data",err);
    mrvData = mrvDataarr;
    mrvData.isSuccess = 2;
}

const onCreateMrvSuccess = (res) => {
    if (res.status === 200 ) {
        isMRVRegistered = (res.data.isSuccess) ? 1 : 0;
    }
}

const onCreateMrvFailure =(err)=>{
    //console.log("Error Creating Ship Data",err);
    isMRVRegistered = 2;
}

const onDeleteVBSuccess = (res) => {
    if (res.status === 200 ) {
        isVBDeleted = (res.data.isSuccess)?1:0;
    }
}


const onDeleteVBFailure =(err)=>{
   // console.log("Error Deleting Ship Data",err);
    isVBDeleted = 2;
}


const onGetShipSuccess = (res) => {
    if (res.status === 200 ) {
        if(res.data[0].isSuccess){
            doesShipExists = res.data[0];
            doesShipExists.isSuccess = true;
        }
        else{
            doesShipExists.isSuccess = false;
        }
    }
}


const onGetShipFailure =(err)=>{
    //console.log("Error Getting Ship Data",err);
    doesShipExists = 2;
}

const onUpdateVBSuccess = (res) => {
  
    if (res.status === 200 ) {
        isVBUpdated = (res.data.isSuccess)?1:0;
    }
}

const onUpdateVBFailure =(err)=>{
    //console.log("Error Updating Ship Data",err);
    isVBUpdated = 2;
}

const onCreateShipsSuccess = (res) => {
    if (res.status === 200 ) {
        areShipsCreated = (res.data.isSuccess) ? 1 : 0;
    }
}

const onCreateShipsFailure =(err)=>{
    //console.log("Error Creating Ships",err);
    areShipsCreated = 2;
}

export const loadAllVoyageBannerData = async () => {
    await getMRVBannerData(onLoadMrvSuccess, onLoadMrvFailure, "abc");
    return mrvData;

};


export const registerShip = async (payload) => {
    await saveMrvBannerData(onCreateMrvSuccess, onCreateMrvFailure,payload);
    return isMRVRegistered;
};

export const deleteVoyageBannerById = async (payload) => {
    await deleteVBDataById(onDeleteVBSuccess, onDeleteVBFailure,payload);
    return isVBDeleted;
};



export const getVBById = async (payload) => {
    await getVBDataById(onGetShipSuccess, onGetShipFailure,payload);
    return doesShipExists;
}

export const updateVBById = async (payload) => {
    await upadateVBDataById(onUpdateVBSuccess, onUpdateVBFailure, payload);
    return isVBUpdated;
}

export const registerShips = async (payload) => {
    
        await saveMrvBannerData(onCreateMrvSuccess, onCreateMrvFailure, payload);
  
    return areShipsCreated;
};


