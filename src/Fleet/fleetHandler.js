import {getFleetData, createFleet, deleteFleetDataById, getFleetDataById, upadateFleetDataById} from "../api";

const fleetDataerr = [{
    "Category": "-",
    "HomePort": "-",
    "MakingDate": "-",
    "MakingYard": "-",
    "Name": "-",
    "PurchaseDate": "-",
    "RegisteredCountry": "-",
    "id": "-"
}];

let fleetData;
let isFleetRegistered=0;
let isFleetDeleted=0;
let doesFleetExists=0;
let isFleetUpdated=0;

const onLoadFleetSuccess = (res) => {
    if (res.status === 200 ) {
        if(res.data[0]){
            fleetData = res.data;
            fleetData.isSuccess = 1;
        }
        else {
            fleetData = fleetDataerr;
            fleetData.isSuccess = 0;
        }
    }
}

const onLoadFleetFailure =(err)=>{
    //console.log("Error Loading Fleet Data",err);
    fleetData = fleetDataerr;
    fleetData.isSuccess = 2;
}

const onCreateFleetSuccess = (res) => {
    if (res.status === 200 ) {
        isFleetRegistered = (res.data.isSuccess) ? 1 : 0;
    }
}

const onCreateFleetFailure =(err)=>{
    //console.log("Error Creating Fleet Data",err);
    isFleetRegistered = 2;
}

const onDeleteFleetSuccess = (res) => {
    if (res.status === 200 ) {
        isFleetDeleted = (res.data.isSuccess)?1:0;
    }
}


const onDeleteFleetFailure =(err)=>{
    //console.log("Error Deleting Fleet Data",err);
    isFleetDeleted = 2;
}

const onGetFleetSuccess = (res) => {
    if (res.status === 200 ) {
        if(res.data[0].isSuccess){
            doesFleetExists = res.data[0];
            doesFleetExists.isSuccess = true;
        }
        else{
            doesFleetExists.isSuccess = false;
        }
    }
}


const onGetFleetFailure =(err)=>{
    //console.log("Error Getting Fleet Data",err);
    doesFleetExists = 2;
}

const onUpdateFleetSuccess = (res) => {
    if (res.status === 200 ) {
        isFleetUpdated = (res.data.isSuccess)?1:0;
    }
}

const onUpdateFleetFailure =(err)=>{
   // console.log("Error Updating Fleet Data",err);
    isFleetUpdated = 2;
}

export const loadAllFleet = async () => {
    await getFleetData(onLoadFleetSuccess, onLoadFleetFailure, "abc");
    return fleetData;

};

export const registerFleet = async (payload) => {
    await createFleet(onCreateFleetSuccess, onCreateFleetFailure,payload);
    return isFleetRegistered;
};

export const deleteFleetById = async (payload) => {
    await deleteFleetDataById(onDeleteFleetSuccess, onDeleteFleetFailure,payload);
    return isFleetDeleted;
};

export const getFleetById = async (payload) => {
    await getFleetDataById(onGetFleetSuccess, onGetFleetFailure,payload);
    return doesFleetExists;
}

export const updateFleetById = async (payload) => {
    await upadateFleetDataById(onUpdateFleetSuccess, onUpdateFleetFailure, payload);
    return isFleetUpdated;
}