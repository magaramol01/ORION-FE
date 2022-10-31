import {getShipData,
    createShip,
    deleteShipDataById,
    getShipDataById,
    upadateShipDataById,
    createShips,
    getSisterGroupData,
    getFleetData,
    deleteSisterGroup,
    deleteFleetGroup,
    getShipBySister,
    getShipByFleet,
    getAllFleetDataWithUser,
    getAllSisterDataWithUser
} from "../../../api";

const shipDataerr = [];

let shipData;
let isShipRegistered=0;
let isShipDeleted=0;
let doesShipExists=0;
let isShipUpdated=0;
let areShipsCreated=0;
let shipGroupData;
let fleetData;
let allSisterDataWithUserFilter
let allFleetDataWithUserFilter;
let sisterVesselDelete;
let isFleetDeleted;
let shipBySister;
let shipByFleet;

const onLoadShipSuccess = (res) => {
    debugger
    if (res.status === 200 ) {
        debugger
        if(res.data[0]){
            shipData = res.data;
            shipData.isSuccess = 1;
        }
        else {
            shipData = shipDataerr;
            shipData.isSuccess = 0;
        }
        debugger
    }
}

const onLoadShipFailure =(err)=>{
    //console.log("Error Loading Ship Data",err);
    shipData = shipDataerr;
    shipData.isSuccess = 2;
}

const onLoadShipGroupSuccess = (res) => {
    if (res.status === 200 ) {
        if(res.data[0]){
            shipGroupData = res.data;
            shipGroupData.isSuccess = 1;
        }
        else {
            shipGroupData = shipDataerr;
            shipGroupData.isSuccess = 0;
        }
    }
}

const onLoadShipGroupSuccessFailure =(err)=>{
    shipGroupData = shipDataerr;
    shipGroupData.isSuccess = 2;
}

const onLoadShipBySisterSuccess = (res) => {
    if (res.status === 200 ) {
        if(res.data[0]) {
            shipBySister = res.data;
            shipBySister.isSuccess = 1;
        } else {
            shipBySister = shipDataerr;
            shipBySister.isSuccess = 0;
        }
    }
}

const onLoadShipBySisterFailure =(err)=>{
    shipBySister = shipDataerr;
    shipBySister.isSuccess = 2;
}

const onLoadShipByFleetSuccess = (res) => {
    if (res.status === 200 ) {
        if(res.data[0]) {
            shipByFleet = res.data;
            shipByFleet.isSuccess = 1;
        } else {
            shipByFleet = shipDataerr;
            shipByFleet.isSuccess = 0;
        }
    }
}

const onLoadShipByFleetFailure =(err)=>{
    shipBySister = shipDataerr;
    shipBySister.isSuccess = 2;
}

const onLoadFleetSucces = (res) => {
    if (res.status === 200 ) {
        if(res.data[0]){
            fleetData = res.data;
            fleetData.isSuccess = 1;
        } else {
            fleetData = shipDataerr;
            fleetData.isSuccess = 0;
        }
    }
}

const onLoadFleetFailure =(err)=>{
    fleetData = shipDataerr;
    fleetData.isSuccess = 2;
}

const onAllFleetByUserFilterSuccess = (res) => {
    if (res.status === 200 ) {
        if(res.data[0]){
            allFleetDataWithUserFilter = res.data;
            allFleetDataWithUserFilter.isSuccess = 1;
        } else {
            allFleetDataWithUserFilter = shipDataerr;
            allFleetDataWithUserFilter.isSuccess = 0;
        }
    }
}

const onAllFleetByUserFilterFail =(err)=>{
    allFleetDataWithUserFilter = shipDataerr;
    allFleetDataWithUserFilter.isSuccess = 2;
}

const onAllSisterByUserFilterSuccess = (res) => {
    if (res.status === 200 ) {
        if(res.data[0]){
            allSisterDataWithUserFilter = res.data;
            allSisterDataWithUserFilter.isSuccess = 1;
        }
        else {
            allSisterDataWithUserFilter = shipDataerr;
            allSisterDataWithUserFilter.isSuccess = 0;
        }
    }
}

const onAllSisterByUserFilterFail =(err)=>{
    shipGroupData = shipDataerr;
    shipGroupData.isSuccess = 2;
}

const onCreateShipSuccess = (res) => {
    if (res.status === 200 ) {
        isShipRegistered = (res.data.isSuccess) ? 1 : 0;
    }
}

const onCreateShipFailure =(err)=>{
    //console.log("Error Creating Ship Data",err);
    isShipRegistered = 2;
}

const onDeleteFleetSuccess = (res) => {
    if (res.status === 200 ) {
        isFleetDeleted = (res.data.isSuccess)?1:0;
    }
}

const onDeleteFleetFailure =(err)=>{
    isFleetDeleted = 2;
}

const onDeleteSisterSuccess = (res) => {
    if (res.status === 200 ) {
        sisterVesselDelete = (res.data.isSuccess)?1:0;
    }
}

const onDeleteSisterFailure =(err)=>{
    sisterVesselDelete = 2;
}

const onDeleteShipSuccess = (res) => {
    if (res.status === 200 ) {
        isShipDeleted = (res.data.isSuccess)?1:0;
    }
}


const onDeleteShipFailure =(err)=>{
   // console.log("Error Deleting Ship Data",err);
    isShipDeleted = 2;
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

const onUpdateShipSuccess = (res) => {
    debugger
    if (res.status === 200 ) {
        isShipUpdated = (res.data.isSuccess)?1:0;
    }
}

const onUpdateShipFailure =(err)=>{
    //console.log("Error Updating Ship Data",err);
    isShipUpdated = 2;
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

export const loadAllShips = async () => {
    await getShipData(onLoadShipSuccess, onLoadShipFailure, "abc");
    return shipData;

};

export const loadAllSister = async () => {
    await getSisterGroupData(onLoadShipGroupSuccess, onLoadShipGroupSuccessFailure);
    return shipGroupData;
};

export const loadShipBySistet = async (payload) => {
    await getShipBySister(onLoadShipBySisterSuccess, onLoadShipBySisterFailure, payload);
    return shipBySister;
};

export const loadShipByFleet = async (payload) => {
    await getShipByFleet(onLoadShipByFleetSuccess, onLoadShipByFleetFailure, payload);
    return shipByFleet;
};

export const loadAllFleet = async () => {
    await getFleetData(onLoadFleetSucces, onLoadFleetFailure);
    return fleetData;
};
export const loadAllSisterByUserFilter = async () => {
    await getAllSisterDataWithUser(onAllSisterByUserFilterSuccess, onAllSisterByUserFilterFail);
    return allSisterDataWithUserFilter;
};

export const loadAllFleetByUserFilter = async () => {
    await getAllFleetDataWithUser(onAllFleetByUserFilterSuccess, onAllFleetByUserFilterFail);
    return allFleetDataWithUserFilter;
};

export const registerShip = async (payload) => {
    await createShip(onCreateShipSuccess, onCreateShipFailure,payload);
    return isShipRegistered;
};

export const deleteShipById = async (payload) => {
    await deleteShipDataById(onDeleteShipSuccess, onDeleteShipFailure,payload);
    return isShipDeleted;
};

export const deleteSisterShipById = async (payload) => {
    await deleteSisterGroup(onDeleteSisterSuccess, onDeleteSisterFailure,payload);
    return sisterVesselDelete;
};

export const deleteFleetById = async (payload) => {
    await deleteFleetGroup(onDeleteFleetSuccess, onDeleteFleetFailure,payload);
    return isFleetDeleted;
};

export const getShipById = async (payload) => {
    await getShipDataById(onGetShipSuccess, onGetShipFailure,payload);
    return doesShipExists;
}

export const updateShipById = async (payload) => {
    await upadateShipDataById(onUpdateShipSuccess, onUpdateShipFailure, payload);
    return isShipUpdated;
}

export const registerShips = async (payload) => {
        debugger
        await createShips(onCreateShipsSuccess, onCreateShipsFailure, payload);
        debugger
    return areShipsCreated;
};
