import axios from "axios";
import socketIOClient from "socket.io-client";

axios.defaults.withCredentials = true;
export const deploymentType = "shore";
export const shipName = "nova-india-express";
export const timeZone = "Asia/Singapore";

export const externalAPIKeys = {
    windy: "9cXx5jJucTf2YiKB4MBv7GV9niHJgk5y"
};

const production_url = "https://www.smartshipweb.com/orionbe";
//const local_url = "http://localhost:10113/IRSbe";
const BASE_URL = production_url;
 //const BASE_URL = local_url;

export const logo_url = BASE_URL + "/logo";
const SOCKET_SERVER_URL = BASE_URL+"/socket.io";

const getAllShipDataUrl = BASE_URL + "/getAllShipDataUrl";
const getAllUseCasesUrl = BASE_URL + "/getAllUseCases";
const getAllCausesUrl = BASE_URL + "/getAllCauses";
const getAllFailureAdvisoriesUrl = BASE_URL + "/getAllFailureAdvisories";
const getAllFailureAdvisoriesByShipUrl = BASE_URL + "/getAllFailureAdvisoriesByShip";
const getAllCausesByShipUrl = BASE_URL + "/getAllCausesByShip";
const getAllParametersByShipUrl = BASE_URL + "/getAllParametersByShip";
const getAllRuleBlocksByShipUrl = BASE_URL + "/getAllRuleBlocksByShip";
const getAllRuleConfigsByShipUrl = BASE_URL + "/getAllRuleConfigsByShip";
const getAllRuleEngineDataByShipUrl = BASE_URL + "/getAllRuleEngineDataByShip";
const getAllOutcomesByShipUrl = BASE_URL + "/getAllOutcomesByShip";
const getAllParametersUrl = BASE_URL + "/getAllParameters";
const getAllRuleConfigsUrl = BASE_URL + "/getAllRuleConfigs";
const getAllRuleBlocksUrl = BASE_URL + "/getAllRuleBlocks";
const getAllRTDASMappingUrl = BASE_URL + "/getAllRTDASMapping";
const getAllFailureAdvConfigsUrl = BASE_URL + "/getAllFailureAdvConfigs";
const getAllUnitsUrl = BASE_URL + "/getAllUnits";
const getLastWidgetFileUrl = BASE_URL + "/getLastWidgetFile";
const downloadcsvFileUrl = BASE_URL + "/downloadcsv";
const getParameterSourceJsonUrl = BASE_URL + "/getParameterSourceJson";
const getLastRuleFileUrl = BASE_URL + "/getLastRuleFile";
const downloadRuleCsvFileUrl = BASE_URL + "/downloadRuleCsv";
const getLastParameterFileUrl = BASE_URL + "/getLastParameterFile";
const downloadParameterCsvFileUrl = BASE_URL + "/downloadParameterCsv";
const getAllCalculatedExpressionUrl = BASE_URL + "/getAllCalculatedExpression";
const getAllRTDASMappingAndUnitsUrl = BASE_URL + "/getAllRTDASMappingAndUnits";
const getAllShipsUrl = BASE_URL + "/getAllShips";
const getAllShipsAndMachinesUrl = BASE_URL + "/getAllShipsAndMachines";
const getAllShipUrl = BASE_URL + "/getAllShip";
const addShipNameToSessionUrl = BASE_URL + "/addShipNameToSession";
const addVesselDetailsToSessionUrl = BASE_URL + "/addVesselDetailsToSession";
const getAllUserUrl = BASE_URL + "/getAllUsers";
const getUserByIdUrl = BASE_URL + "/getUserById";
const getUserByShipIdUrl = BASE_URL + "/getUserByShipId";
const getAllParametersOnlyNamesUrl = BASE_URL + "/getAllParametersOnlyNames";
const getAllParametersOnlyNamesByShipUrl = BASE_URL + "/getAllParametersOnlyNamesByShip";
const getAllRTDASRegistrationsUrl = BASE_URL + "/getAllRTDASRegistration";
const getAllConstantParametersUrl = BASE_URL + "/getAllConstantParameter";
const getParameterSourceJsonAndUnitsUrl = BASE_URL + "/getParameterSourceJsonAndUnits";
const getShipDataByIdUrl = BASE_URL + "/getShipDataById";
const getShipDataUrl = BASE_URL + "/getShipData";
const getTodayAlertDataUrl = BASE_URL + "/getTodayAlertData";
const getFleetDashboardAllVesselsPanelDataUrl = BASE_URL + "/getFleetDashboardParametersCardData";
const getFleetDashboardParametersFilterDataUrl = BASE_URL + "/getFleetDashboardParametersFilterData";
const getFleetDashboardStateUrl = BASE_URL + "/getFleetDashboardState";
const getXpressMainEngineStateUrl = BASE_URL + "/getXpressMainEngineState";

const getDigitalDataStateUrl = BASE_URL + "/getDigitalAlarmState";
const getNanjingMainEngineStateUrl = BASE_URL + "/getNanjingMainEngineState";
const getBataviaMainEngineStateUrl = BASE_URL + "/getBataviaMainEngineState";
const getAllShipSourceDastinationDataUrl = BASE_URL + "/getAllShipSourceDastinationData";
const getDashboardStateUrl = BASE_URL + "/getDashboardState";
const getMainEngineStateUrl = BASE_URL + "/getMainEngineState";
const getSparIndusMainEngineStateUrl = BASE_URL + "/getSparIndusMainEngineState";
const getAsiaMainEngineStateUrl = BASE_URL + "/getAsiaMainEngineState";
const getMainGaugesStateUrl = BASE_URL + "/getMainGaugesState";
const getAlertHistoryUrl = BASE_URL + "/getAlertHistory";
const getSisterGroupUrl = BASE_URL + "/getAllVesselGroup";
const getFleetDataUrl = BASE_URL + "/getAllFleetData";
const getAllVesselGroupWithUserFilterDataUrl = BASE_URL + "/getAllVesselGroupWithUserFilter";
const getAllFleetDataWithUserFilterDataUrl = BASE_URL + "/getAllFleetDataWithUserFilter";
const getMRVStateUrl = BASE_URL + "/getMRVState";
const getMRVStateByVoyageUrl = BASE_URL + "/getMRVStateByVoyage";
const getMRVStateByDateUrl = BASE_URL + "/getMRVStateByDate";
const getAllCompanyEntryUrl = BASE_URL + "/getAllCompanyEntry";
const getCompanyEntryByIDUrl = BASE_URL + "/getCompanyEntryByID";
const getRechartDataUrl = BASE_URL + "/getRechartData";
const getAllVesselsWindyMapDataUrl = BASE_URL + "/getAllVesselsWindyMapData";
const getWindyMapDataUrl = BASE_URL + "/getWindyMapData";
const getPublishedSheetURL = BASE_URL + "/getPublishedSheet";
const getPublishedSheetURL2 = BASE_URL + "/getPublishedSheet2";
const getAllMachinesURL = BASE_URL + "/getAllMachines";

const createUseCaseUrl = BASE_URL + "/createUseCases";
const createFailureAdvisoryUrl = BASE_URL + "/createFailureAdvisory";
const createCauseUrl = BASE_URL + "/createCause";
const createParameterUrl = BASE_URL + "/createParameter";
const createRuleConfigUrl = BASE_URL + "/createRuleConfig";
const createRuleBlockUrl = BASE_URL + "/createRuleBlock";
const createFleetUrl = BASE_URL + "/createFleet";
const createVesselGroupUrl = BASE_URL + "/createVesselGroup";
const getShipBySisterUrl = BASE_URL + "/getShipBySisterGroup";
const getShipByFleetUrl = BASE_URL + "/getShipByFleetGroup";
const createCalculatedExpressionUrl = BASE_URL + "/createCalculatedExpression";
const createUnitUrl = BASE_URL + "/createUnits";
const createUserUrl = BASE_URL + "/createUser";
const createShipUrl = BASE_URL + "/createShip";
const createShipsUrl = BASE_URL + "/createShips";
const createMachineUrl = BASE_URL + '/createMachine';
const createCompanyEntryUrl = BASE_URL +"/createCompanyEntry";

const updateUseCaseUrl = BASE_URL + "/updateUseCase";
const updateFailureAdvisoryUrl = BASE_URL + "/updateFailureAdvisory";
const updateCauseUrl = BASE_URL + "/updateCause";
const updateParameterUrl = BASE_URL + "/updateParameter";
const updateRuleConfigUrl = BASE_URL + "/updateRuleConfig";
const updateRuleBlockUrl = BASE_URL + "/updateRuleBlock";
const updateRTDASRegistrationUrl = BASE_URL + "/updateRTDASRegistration";
const getConstantParameterHistoricalDataByIdUrl = BASE_URL + "/getConstantParameterHistoricalDataById";
const updateOnlyCurrentAndRemarkConstantParameterUrl = BASE_URL + "/updateOnlyCurrentAndRemarkConstantParameter";
const updateCalculatedExpressionUrl = BASE_URL + "/updateCalculatedExpression";
const updateUnitUrl = BASE_URL + "/updateUnits";
const updatePasswordUrl = BASE_URL + "/updatePassword";
const updateShipDataByIdUrl = BASE_URL + "/updateShipDataById";
const updateCompanyDataByIdUrl = BASE_URL + "/updateCompanyDataById";
const updateUserByIdUrl = BASE_URL + "/updateUserById";

const deleteUserUrl = BASE_URL + "/deleteUserById";
const deleteFailureAdvisoryUrl = BASE_URL + "/deleteFailureAdvisory";
const deleteCausesUrl = BASE_URL + "/deleteCauses";
const deleteOutcomeUrl = BASE_URL + "/deleteOutcome";
const deleteRuleBlockUrl = BASE_URL + "/deleteRuleBlock";
const deleteRuleUrl = BASE_URL + "/deleteRule";
const deleteSisterGroupUrl = BASE_URL + "/deleteSisterGroup";
const deleteFleetGroupUrl = BASE_URL + "/deleteFleetGroup";
const deleteParameterUrl = BASE_URL + "/deleteParameter";
const deleteUnitUrl = BASE_URL + "/deleteUnits";
const deleteShipDataByIdUrl = BASE_URL + "/deleteShipDataById";
const deleteMachineUrl = BASE_URL + '/deleteMachine';
const deleteCompanyEntryUrl = BASE_URL + '/deleteCompanyEntry';

const testRTDASConnectionUrl = BASE_URL + "/getConnectionOfDB";
const saveRTDASRegistrationUrl = BASE_URL + "/saveRTDASRegistration";
const uploadcsvForRulesUrl = BASE_URL + "/uploadcsvForRuleChain";
const createRTDASRegistrationForJsonFileUrl = BASE_URL + "/createRTDASRegistrationForJsonFile";
const uploadcsvForWidgetUrl = BASE_URL + "/uploadcsvForWidget"
const getAllRuleEngineDataUrl = BASE_URL + "/getAllRuleEngineData";
const getAllOutcomesUrl = BASE_URL + "/getAllOutcomes";
const configureOutcomeUrl = BASE_URL + "/configureOutcome";
const updateOutcomeUrl = BASE_URL + "/updateOutcome";
const createConstantParameterUrl = BASE_URL + "/createConstantParameter";
const getAllTodayHistoryUrl = BASE_URL + "/getAllTodayHistory";
const getAllFilterAlarmTodayHistoryUrl = BASE_URL + "/getAllFilterAlarmTodayHistory";
const getAllFilterAlertTodayHistoryUrl = BASE_URL + "/getAllFilterAlertTodayHistory";
const UpdateHistoryUrl = BASE_URL + "/updateTodayHistory";
const validateUserUrl = BASE_URL + "/validateUser";
const validatePrivateRouteUrl = BASE_URL + "/validatePrivateRoute";
const logoutUrl = BASE_URL + "/logout";
const getCurrentPageRecordUrl = BASE_URL + "/getCurrentPageRecord";

const sendEmailUrl = BASE_URL + "/sendMail";
const getEmailUrl = BASE_URL + "/getEmail";
const uploadFileUrl = BASE_URL + "/uploadFile";
const saveShipRouteUrl = BASE_URL + "/saveShipRoute";
const updateShipRouteUrl = BASE_URL +  "/updateShipRoute";
const getShipRouteUrl = BASE_URL + "/getShipRoute";
const updateRouteHistoryDataUrl = BASE_URL+"/updatedRouteHistoryData"
const insertRedPointUrl=BASE_URL+"/insertRedPoint"
//----------MRV data by date and vovage name-----------
const getMRVStateByDateAndVoyageURL = BASE_URL + "/getMRVStateByDateAndVoyage";
const getMRVLatestDataURL = BASE_URL + '/getMRVLatestData';
//----------Compass-----------
const getCompassStateURL = BASE_URL + "/getCompassState";
// ----------------------CII -----------
const getCIIStateDataURL = BASE_URL + '/getCIIState';
const getCIIStateDataURLnew = BASE_URL + "/getCIIStatenew"
const getCIILast90DaysDataURL = BASE_URL + '/getCIILast90DaysData';
const getCIIStatebyVoyageURL = BASE_URL + '/getMRVCIIStateByVoyage'
const getCIIStatebyDateAndVoyageURL = BASE_URL + '/getMRVCIIStateByDateAndVoyage'
const getCIIStatebyDateURL = BASE_URL + "/getMRVCIIStateByDate"
const getCIIStatebySupplyURL = BASE_URL + "/getCIIStatenew"
const getCIIStatebyDemandURL = BASE_URL + "/getCIIStatenew"




//--------------------Task No SSH-53----------------------------------

const insertMrvBannerDataURL = BASE_URL + '/createmrvbannerdata';
const getMRVBnnerDataURL = BASE_URL + '/getMRVBnnerDataData';
const deleteVoyageBannerByIdURL = BASE_URL + '/deleteVBDataById';
const getVBDataByIdUrl = BASE_URL + "/getVBDataById";
const upadateVBDataByIdUrl = BASE_URL + "/upadateVBDataById";
const setResetEmailForFailureAdvisoriesRefCauseUrl = BASE_URL + "/setResetEmailForFailureAdvisoriesRefCause";
//---End------------------------------------------------
//     ========= pdf crud url ===>
//  get all pdf file data==>
const getreportDataUrl = BASE_URL+"/getAllReportData"
// get one pdf file data==>
const getPdfByIdUrl = BASE_URL+"/getPdfById"
// download pdf  file data==
const downloadPdfFileUrl = BASE_URL + "/downloadPdf";
//  pdf update==>
const updatePdfByIdUrl = BASE_URL + "/updatePdfById";
//  pdf delete==>
const deletereportDataUrl = BASE_URL + "/deletePdfData";
// pdf upload ==>
const UploadReportionformationUrl = BASE_URL + "/uploadReportInfo";

const get = (url, onSuccess, onFailure, options) => {

    axios.get(url,options)
        .then((response) => {
            if (response.status >= 200 && response.status < 300) {
                onSuccess(response)
            } else {
                // onFailure(error)
            }
        })
        .catch((error) => {
            onFailure(error)
        })
        .then(() => {
            // console.log('gets always executed')
        })
};

const post = (url, onSuccess, onFailure, payload) => {

    axios.post(url, payload)
        .then((response)=> {
            if (response.status >= 200 && response.status < 300) {
                onSuccess(response)
            } else {
                // onFailure(error)
            }
        })
        .catch((error)=> {
            //onFailure(error)
        })
        .then(()=> {
            // console.log('gets always executed')
        })
    ;
};

const asyncPost = async (url, onSuccess, onFailure, payload) => {
    await axios.post(url, payload)
        .then((response) => {
            if (response.status >= 200 && response.status < 300) {
                onSuccess(response)
            } else {
                // onFailure(error)
            }
        })
        .catch((error) => {
            onFailure(error)
        })
        .then(() => {
            // console.log('gets always executed')
        })
    ;
};

const postForMailReset = (url, onSuccess, onFailure, payload) => {

    axios.post(url, payload)
        .then((response)=> {
            if (response.status >= 200 && response.status < 300) {
                onSuccess(response)
            } else {
                // onFailure(error)
            }
        })
        .catch((error)=> {
            onFailure(error.response)
        })
        .then(()=> {
            // console.log('gets always executed')
        })
    ;
};

const postEmailCheck = (url, onSuccess, onFailure, payload) => {

    axios.post(url, payload)
        .then((response)=> {
            if (response.status >= 200 && response.status < 300) {
                onSuccess(response)
            } else {
                // onFailure(error)
            }
        })
        .catch((error)=> {
            onFailure(error.response)
        })
        .then(()=> {
            // console.log('gets always executed')
        })
    ;
};

const multipartPost = (url, onSuccess, onFailure, formData) => {
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    axios.post(url, formData, config)
        .then((response)=> {
            onSuccess(response)
        })
        .catch((error)=> {
            onFailure(error)
        })
        .then(()=> {
            // console.log('gets always executed')
        })
    ;
};

export const saveMrvBannerData = async (onSuccess, onFailure, payload) => {
    await asyncPost(insertMrvBannerDataURL, onSuccess, onFailure, payload);
};

export const getMRVBannerData = async (onSuccess, onFailure) => {
    await asyncPost(getMRVBnnerDataURL, onSuccess, onFailure);
};
export const deleteVBDataById = async (onSuccess, onFailure, payload) => {
    await asyncPost(deleteVoyageBannerByIdURL, onSuccess, onFailure, payload);
};
export const getVBDataById = async (onSuccess, onFailure, payload) => {
    await asyncPost(getVBDataByIdUrl, onSuccess, onFailure, payload);
};
export const upadateVBDataById = async (onSuccess, onFailure, payload) => {
    await asyncPost(upadateVBDataByIdUrl, onSuccess, onFailure, payload);
};
/***
 * Get All Data
 * **/
export const getAllUseCases = (onSuccess, onFailure) => {
    get(getAllUseCasesUrl, onSuccess, onFailure);
};

export const getAllCauses = (onSuccess, onFailure) => {
    get(getAllCausesUrl, onSuccess, onFailure);
};

export const getAllShipData = (onSuccess, onFailure) => {
    get(getAllShipDataUrl, onSuccess, onFailure);
};

export const getAllUserData = (onSuccess, onFailure) => {
    get(getAllUserUrl, onSuccess, onFailure);
};

export const getUserById = (onSuccess, onFailure,id) => {
    get(`${getUserByIdUrl}?id=${id}`, onSuccess, onFailure);
};

export const getUserByShipId = (shipId,onSuccess, onFailure) => {
    get(`${getUserByShipIdUrl}?shipId=${shipId}`, onSuccess, onFailure);
};

export const getAllFailureAdvisories = (onSuccess, onFailure) => {
    get(getAllFailureAdvisoriesUrl, onSuccess, onFailure);
};

export const getAllFailureAdvisoriesByShip = (onSuccess, onFailure, {
    vesselName,
    activePage,
    sortBy,
    searchArr
}) => {
    get( `${getAllFailureAdvisoriesByShipUrl}?vesselName=${vesselName}&activePage=${activePage}&sortBy=${sortBy}&searchArr=${JSON.stringify(searchArr)}`, onSuccess, onFailure);
};

export const getAllCausesByShip = (onSuccess, onFailure, {
    vesselName,
    activePage,
    sortBy,
    searchArr
}) => {
    get( `${getAllCausesByShipUrl}?vesselName=${vesselName}&activePage=${activePage}&sortBy=${sortBy}&searchArr=${JSON.stringify(searchArr)}`, onSuccess, onFailure);
};

export const getLastRuleFile = (onSuccess, onFailure,vesselName) => {
    get(`${getLastRuleFileUrl}?vesselName=${vesselName}`, onSuccess, onFailure);
};
export const getMRVLatestDataByVesselId = async (onSuccess, onFailure, payload) => {
    const url = `${getMRVLatestDataURL}?vessel=${payload.vessel}`;
    get(url, onSuccess, onFailure);
};

export const downloadRulecsv = (onSuccess, onFailure,fileId,fileName,vesselId) => {
    get(`${downloadRuleCsvFileUrl}?id=${fileId}&fileName=${fileName}&vesselId=${vesselId}`, onSuccess, onFailure);
};

export const getLastParameterFile = (onSuccess, onFailure,vesselName) => {
    get(`${getLastParameterFileUrl}?vesselName=${vesselName}`, onSuccess, onFailure);
};

export const downloadParametercsv = (onSuccess, onFailure,fileId,fileName,vesselId) => {
    get(`${downloadParameterCsvFileUrl}?id=${fileId}&fileName=${fileName}&vesselId=${vesselId}`, onSuccess, onFailure);
};

export const getAllParameters = (onSuccess, onFailure) => {
    get(getAllParametersUrl, onSuccess, onFailure);
};

export const getLastWidgetFile = (onSuccess, onFailure,vesselName) => {
    get(`${getLastWidgetFileUrl}?vesselName=${vesselName}`, onSuccess, onFailure);
};

export const downloadcsv = (onSuccess, onFailure,fileId,fileName,vesselId) => {
    get(`${downloadcsvFileUrl}?id=${fileId}&fileName=${fileName}&vesselId=${vesselId}`, onSuccess, onFailure);
};

export const getRuleChainTableData = (onSuccess, onFailure) => {
    axios.all([
        axios.get(getAllRuleConfigsUrl),
        axios.get(getAllRuleBlocksUrl)
    ])
        .then(axios.spread((firstResponse, secondResponse) => {
            onSuccess(firstResponse, secondResponse);
            // console.log(firstResponse, secondResponse);
        }))
        .catch(onFailure);
};




export const getRuleChainTableDataByShip = (onSuccess, onFailure, {
    vesselName,
    activePage,
    sortBy,
    searchArr
}) => {
    axios.all([
        axios.get(  `${getAllRuleConfigsByShipUrl}?vesselName=${vesselName}`),
        axios.get(`${getAllRuleBlocksByShipUrl}?vesselName=${vesselName}&activePage=${activePage}&sortBy=${sortBy}&searchArr=${JSON.stringify(searchArr)}`)
    ])
        .then(axios.spread((firstResponse, secondResponse) => {
            onSuccess(firstResponse, secondResponse);
            // console.log(firstResponse, secondResponse);
        }))
        .catch(onFailure);
};

export const getAllRuleConfigsByShip = (onSuccess, onFailure, {
    vesselName,
    activePage,
    searchArr
}) => {
    get(`${getAllRuleConfigsByShipUrl}?vesselName=${vesselName}&activePage=${activePage}&searchArr=${JSON.stringify(searchArr)}`, onSuccess, onFailure);
};

export const getAllRuleConfigs = (onSuccess, onFailure) => {
    get(getAllRuleConfigsUrl, onSuccess, onFailure);
};

export const getAllRuleChains = (onSuccess, onFailure) => {
    get(getAllRuleBlocksUrl, onSuccess, onFailure);
};

export const getAllRTDASRegistrations = (onSuccess, onFailure) => {
    get(getAllRTDASRegistrationsUrl, onSuccess, onFailure);
};

export const getRuleConfigAllData = (onSuccess, onFailure) => {
    axios.all([
        axios.get(getAllRuleEngineDataUrl),
        axios.get(getAllOutcomesUrl)
    ])
        .then(axios.spread((firstResponse, secondResponse) => {
            onSuccess(firstResponse, secondResponse);
        }))
        .catch(onFailure);

};

export const getRuleConfigAllDataByShip = (onSuccess, onFailure, {
    vesselName,
    activePage,
    sortBy,
    searchArr
}) => {
    axios.all([
        axios.get(`${getAllRuleEngineDataByShipUrl}?vesselName=${vesselName}`),
        axios.get(`${getAllOutcomesByShipUrl}?vesselName=${vesselName}&activePage=${activePage}&sortBy=${sortBy}&searchArr=${JSON.stringify(searchArr)}`)
    ])
        .then(axios.spread((firstResponse, secondResponse) => {
            onSuccess(firstResponse, secondResponse);
        }))
        .catch(onFailure);

};

export const getAllRuleEngineDataByShip = (onSuccess, onFailure, vesselName) => {
    get(`${getAllRuleEngineDataByShipUrl}?vesselName=${vesselName}`, onSuccess, onFailure)
};

export const getAllRuleEngineData = (onSuccess, onFailure) => {
  get(getAllRuleEngineDataUrl, onSuccess, onFailure)
};

export const getAllRTDASMapping = (onSuccess, onFailure) => {
    get(getAllRTDASMappingUrl, onSuccess, onFailure);
};

export const getAllParametersAndRTDASMapping = (onSuccess, onFailure) => {
    axios.all([
        axios.get(getAllParametersUrl),
        axios.get(getAllRTDASMappingUrl),
        axios.get(getAllUnitsUrl),
    ])
        .then(axios.spread((firstResponse, secondResponse, unitsResponse) => {
            onSuccess(firstResponse, secondResponse, unitsResponse);
        }))
        .catch(onFailure);
};

export const getAllParametersByShipAndRTDASMapping = (
    onSuccess,
    onFailure,
    {
        vesselName,
        activePage,
        sortBy,
        searchByName,
        searchArr,
        searchMachineArr
    }
) => {
    axios.all([
        axios.get(`${getAllParametersByShipUrl}?vesselName=${vesselName}&activePage=${activePage}&sortBy=${sortBy}&searchByName=${searchByName}&searchArr=${JSON.stringify(searchArr)}&searchMachineArr=${JSON.stringify(searchMachineArr)}`),
        axios.get(getAllRTDASMappingUrl),
        axios.get(getAllUnitsUrl),
    ])
        .then(axios.spread((firstResponse, secondResponse, unitsResponse) => {
            onSuccess(firstResponse, secondResponse, unitsResponse);
        }))
        .catch(onFailure);
};

export const getAllRTDASMappingAndUnits = (onSuccess, onFailure) => {
    get(getAllRTDASMappingAndUnitsUrl, onSuccess, onFailure)
};

export const getAllConstantParameters = (onSuccess, onFailure) => {
    axios.all([
        axios.get(getAllConstantParametersUrl),
        axios.get(getAllUnitsUrl),
        axios.get(getParameterSourceJsonUrl),
    ])
        .then(axios.spread((firstResponse, unitsResponse, parameterSourceJsonResponse) => {
            onSuccess(firstResponse, unitsResponse, parameterSourceJsonResponse);
        }))
        .catch(onFailure);
};

export const getParameterSourceJsonAndUnits = (onSuccess, onFailure) => {
    get(getParameterSourceJsonAndUnitsUrl, onSuccess, onFailure)
};

export const getParameterTableData = (onSuccess, onFailure) => {
    axios.all([
        axios.get(getAllParametersOnlyNamesUrl),
        axios.get(getAllCalculatedExpressionUrl),
    ])
        .then(axios.spread((parametersOnlyNamesResponse, calculatedExpressionResponse) => {
            onSuccess(parametersOnlyNamesResponse, calculatedExpressionResponse);
        }))
        .catch(onFailure);
};


export const getAllParametersOnlyNames = (onSuccess, onFailure) => {
    get(getAllParametersOnlyNamesUrl, onSuccess, onFailure);
};

export const getAllParametersOnlyNamesByShip = (onSuccess, onFailure, vesselName) => {
    get(`${getAllParametersOnlyNamesByShipUrl}?vesselName=${vesselName}`, onSuccess, onFailure,vesselName);
};

export const getAllTodayHistoryData = (onSuccess, onFailure, vesselName, startDate, endDate, activeDate=1) => {
    get(`${getAllTodayHistoryUrl}?vesselName=${vesselName}&startDate=${startDate}&endDate=${endDate}&activePage=${activeDate}`, onSuccess, onFailure)
};

export const getAllFilterAlarmTodayHistoryData = (onSuccess, onFailure,payload) => {
    post(getAllFilterAlarmTodayHistoryUrl, onSuccess, onFailure,payload)
};

export const getRechartData = (onSuccess, onFailure, payload) => {
    post(getRechartDataUrl, onSuccess, onFailure, payload)
};

export const getAllFilterAlertTodayHistoryData = (onSuccess, onFailure,payload) => {
    post(getAllFilterAlertTodayHistoryUrl, onSuccess, onFailure,payload)
};

export const updateTodayHistoryData = (onSuccess,onFailure, payload) => {
    post(UpdateHistoryUrl, onSuccess, onFailure, payload);
};

export const updateUserById = (onSuccess,onFailure, payload) => {
    debugger
    post(updateUserByIdUrl, onSuccess, onFailure, payload);
};

export const getMergeParameterFormData = (onSuccess, onFailure) => {
    axios.all([
        axios.get(getAllUnitsUrl),
        axios.get(getAllRTDASMappingUrl),
        axios.get(getParameterSourceJsonUrl),
    ])
        .then(axios.spread((unitResponse, rtdasMappingResponse, parameterResponse) => {
            onSuccess(unitResponse, rtdasMappingResponse, parameterResponse);
        }))
        .catch(onFailure);
};

export const getMergeParameterTableData = (onSuccess, onFailure) => {
    axios.all([
        axios.get(getAllParametersUrl),
        axios.get(getAllConstantParametersUrl),
        axios.get(getParameterSourceJsonUrl),
    ])
        .then(axios.spread((parametersResponse, constantResponse, parameterSourceJsonResponse) => {
            onSuccess(parametersResponse, constantResponse, parameterSourceJsonResponse);
        }))
        .catch(onFailure);
};

export const getShipData = async (onSuccess, onFailure) => {
    await asyncPost(getShipDataUrl, onSuccess, onFailure);
};

export const getSisterGroupData = async (onSuccess, onFailure) => {
    await asyncPost(getSisterGroupUrl, onSuccess, onFailure);
};

export const getShipBySister = async (onSuccess, onFailure, payload) => {
    await asyncPost(getShipBySisterUrl, onSuccess, onFailure, payload);
};

export const getShipByFleet = async (onSuccess, onFailure, payload) => {
    await asyncPost(getShipByFleetUrl, onSuccess, onFailure, payload);
};

export const getFleetData = async (onSuccess, onFailure) => {
    await asyncPost(getFleetDataUrl, onSuccess, onFailure);
};

export const getAllSisterDataWithUser = async (onSuccess, onFailure, payload) => {
    await asyncPost(getAllVesselGroupWithUserFilterDataUrl, onSuccess, onFailure, payload);
};

export const getAllFleetDataWithUser = async (onSuccess, onFailure) => {
    await asyncPost(getAllFleetDataWithUserFilterDataUrl, onSuccess, onFailure);
};

export const createVesselGroup = (onSuccess, onFailure, payload) => {
    post(createVesselGroupUrl, onSuccess, onFailure, payload);
};

export const createFleet = (onSuccess, onFailure, payload) => {
    post(createFleetUrl, onSuccess, onFailure, payload);
};

export const getShipDataById = async (onSuccess, onFailure, payload) => {
   await asyncPost(getShipDataByIdUrl, onSuccess, onFailure, payload);
};

export const getAllShips = (onSuccess, onFailure) => {
    get(getAllShipsUrl, onSuccess, onFailure)
};

export const getAllShipsAndMachines = (onSuccess, onFailure) => {
    get(getAllShipsAndMachinesUrl, onSuccess, onFailure)
};

export const getAllShip = (onSuccess, onFailure) => {
    get(getAllShipUrl, onSuccess, onFailure)
};

export const getAllCompanyEntry = async (onSuccess, onFailure) => {
    get(getAllCompanyEntryUrl, onSuccess, onFailure);
};

export const getCompanyEntryByID = async (onSuccess, onFailure,payload) => {
    await asyncPost(getCompanyEntryByIDUrl, onSuccess, onFailure,payload);
};

export const getPublishedSheet = async (onSuccess, onFailure) => {
    get(getPublishedSheetURL,onSuccess,onFailure);
}

export const getPublishedSheet2 = async (onSuccess, onFailure) => {
    get(getPublishedSheetURL2,onSuccess,onFailure);
}

export const getAllMachines = async  (onSuccess, onFailure) =>{
    get(getAllMachinesURL, onSuccess, onFailure);
}

export const getCurrentPageRecord = async (onSuccess, onFailure, payload) => {
    post(getCurrentPageRecordUrl, onSuccess, onFailure, payload);
}

/***
 * Create
 * **/



export const createUser = (onSuccess,onFailure, payload) => {
    post(createUserUrl, onSuccess, onFailure, payload);
};

export const addShipNameToSession = (onSuccess,onFailure, payload) => {
    post(addShipNameToSessionUrl, onSuccess, onFailure, payload);
};

export const addVesselDetailsToSession = (onSuccess, onFailure, payload) => {
    post(addVesselDetailsToSessionUrl, onSuccess, onFailure, payload);
};

export const createShip = async (onSuccess, onFailure, payload) => {
    await asyncPost(createShipUrl, onSuccess, onFailure, payload);
};

export const createShips = async (onSuccess, onFailure, payload) => {
    await asyncPost(createShipsUrl, onSuccess, onFailure, payload);
};

export const createCause = (onSuccess, onFailure, payload) => {
    post(createCauseUrl, onSuccess, onFailure, payload);
};

export const createFailureAdvisory = (onSuccess, onFailure, payload) => {
    post(createFailureAdvisoryUrl, onSuccess, onFailure, payload);
};

export const createUseCase = (onSuccess, onFailure, payload) => {
    post(createUseCaseUrl, onSuccess, onFailure, payload);
};

export const createParameter = (onSuccess, onFailure, payload) => {
    post(createParameterUrl, onSuccess, onFailure, payload);
};

export const createRuleConfig = (onSuccess, onFailure, payload) => {
    post(createRuleConfigUrl, onSuccess, onFailure, payload);
};

export const createRuleChain = (onSuccess, onFailure, payload) => {
    post(createRuleBlockUrl, onSuccess, onFailure, payload);
};

export const createCalculatedExpression = (onSuccess, onFailure, payload) => {
    post(createCalculatedExpressionUrl, onSuccess, onFailure, payload);
};

export const createUnit = (onSuccess, onFailure, payload) => {
    post(createUnitUrl, onSuccess, onFailure, payload);
};

export const createMachine = (onSuccess, onFailure, payload) => {
    post(createMachineUrl, onSuccess, onFailure, payload);
};

export const createCompanyEntry = (onSuccess, onFailure, payload) => {
    post(createCompanyEntryUrl, onSuccess, onFailure, payload);
};



/***
 * Update
 * **/
export const updateUseCase = (onSuccess, onFailure, payload) => {
    post(updateUseCaseUrl, onSuccess, onFailure, payload);
};

export const updateFailureAdvisory = (onSuccess, onFailure, payload) => {
    post(updateFailureAdvisoryUrl, onSuccess, onFailure, payload);
};

export const updateCause = (onSuccess, onFailure, payload) => {
    post(updateCauseUrl, onSuccess, onFailure, payload);
};

export const updateParameter = (onSuccess, onFailure, payload) => {
    post(updateParameterUrl, onSuccess, onFailure, payload);
};

export const updateRuleConfig = (onSuccess, onFailure, payload) => {
    post(updateRuleConfigUrl, onSuccess, onFailure, payload);
};

export const updateRuleChain = (onSuccess, onFailure, payload) => {
    post(updateRuleBlockUrl, onSuccess, onFailure, payload);
};

export const updateRTDASRegistration = (onSuccess, onFailure, payload) => {
    post(updateRTDASRegistrationUrl, onSuccess, onFailure, payload);
};

export const getConstantParameterHistoricalDataById = (onSuccess, onFailure, payload) => {
    post(getConstantParameterHistoricalDataByIdUrl, onSuccess, onFailure, payload);
};

export const updateOnlyCurrentAndRemarkConstantParameter = (onSuccess, onFailure, payload) => {
    post(updateOnlyCurrentAndRemarkConstantParameterUrl, onSuccess, onFailure, payload);
};

export const updateCalculatedExpression = (onSuccess, onFailure, payload) => {
    post(updateCalculatedExpressionUrl, onSuccess, onFailure, payload);
};

export const updateUnit = (onSuccess, onFailure, payload) => {
    post(updateUnitUrl, onSuccess, onFailure, payload);
};

export const updatePassword = (onSuccess, onFailure, payload) => {
    post(updatePasswordUrl, onSuccess, onFailure, payload);
};

export const upadateShipDataById = async (onSuccess, onFailure, payload) => {
    await asyncPost(updateShipDataByIdUrl, onSuccess, onFailure, payload);
};

export const updateCompanyDataById = async (onSuccess, onFailure, payload) => {
    await asyncPost(updateCompanyDataByIdUrl, onSuccess, onFailure, payload);
};


/**
 * Delete
 * **/
export const deleteUser = (onSuccess, onFailure, id) => {
    post(`${deleteUserUrl}?id=${id}`, onSuccess, onFailure);
};

export const deleteFailureAdvisory = (onSuccess, onFailure, id) => {
    post(`${deleteFailureAdvisoryUrl}?id=${id}`, onSuccess, onFailure);
};

export const deleteCauses = (onSuccess, onFailure, id) => {
    post(`${deleteCausesUrl}?id=${id}`, onSuccess, onFailure);
};

export const deleteOutcome = (onSuccess, onFailure, id) => {
    post(`${deleteOutcomeUrl}?id=${id}`, onSuccess, onFailure);
};

export const deleteRuleBlock = (onSuccess, onFailure, id) => {
    post(`${deleteRuleBlockUrl}?id=${id}`, onSuccess, onFailure);
};

export const deleteRule = (onSuccess, onFailure, id) => {
    post(`${deleteRuleUrl}?id=${id}`, onSuccess, onFailure);
};

export const deleteParameter = (onSuccess, onFailure, id) => {
    post(`${deleteParameterUrl}?id=${id}`, onSuccess, onFailure);
};

export const deleteUnit = (onSuccess, onFailure, id) => {
    post(`${deleteUnitUrl}?id=${id}`, onSuccess, onFailure);
};

export const deleteMachine = (onSuccess, onFailure, id) => {
    post(`${deleteMachineUrl}?id=${id}`, onSuccess, onFailure);
};

export const deleteShipDataById = async (onSuccess, onFailure, payload) => {
    await asyncPost(deleteShipDataByIdUrl, onSuccess, onFailure, payload);
};

export const deleteSisterGroup = async (onSuccess, onFailure, payload) => {
    await asyncPost(deleteSisterGroupUrl, onSuccess, onFailure, payload);
};

export const deleteFleetGroup = async (onSuccess, onFailure, payload) => {
    await asyncPost(deleteFleetGroupUrl, onSuccess, onFailure, payload);
};

export const deleteCompanyEntry = async (onSuccess, onFailure, payload) => {
    await asyncPost(deleteCompanyEntryUrl,onSuccess,onFailure,payload);
};

/***
 * other
 * */

export const uploadFile = async (onSuccess, onFailure, payload) => {
    post(uploadFileUrl, onSuccess, onFailure, payload);
};


export const testRTDASConnection = (onSuccess, onFailure, payload) => {
    post(testRTDASConnectionUrl, onSuccess, onFailure, payload);
};

export const saveRTDASRegistration = (onSuccess, onFailure, payload) => {
    post(saveRTDASRegistrationUrl, onSuccess, onFailure, payload);
};

export const saveJSONFile = (onSuccess, onFailure, formData) => {
    multipartPost(createRTDASRegistrationForJsonFileUrl, onSuccess, onFailure, formData)
};

export const uploadWidgetFile = (onSuccess, onFailure, formData) => {
    multipartPost(uploadcsvForWidgetUrl, onSuccess, onFailure, formData)
};

export const createRuleUsingCsv = (onSuccess, onFailure, formData) => {
    multipartPost(uploadcsvForRulesUrl, onSuccess, onFailure, formData)
};

export const saveConfigureUseCase = (onSuccess, onFailure, payload) => {
    post(configureOutcomeUrl, onSuccess, onFailure, payload);
};

export const updateConfigureUseCase = (onSuccess, onFailure, payload) => {
    post(updateOutcomeUrl, onSuccess, onFailure, payload);
};

export const setResetEmailForFailureAdvisoriesRefCause = (onSuccess,onFailure, payload) => {
    post(setResetEmailForFailureAdvisoriesRefCauseUrl, onSuccess, onFailure, payload);
};

export const createConstantParameter = (onSuccess, onFailure, payload) => {
    post(createConstantParameterUrl, onSuccess, onFailure, payload);
};

export const sendMail = (onSuccess, onFailure, payload) => {
    postForMailReset(sendEmailUrl, onSuccess, onFailure, payload);
};

export const getEmail = (onSuccess, onFailure, payload) => {
    postEmailCheck(getEmailUrl, onSuccess, onFailure, payload);
};

export const validateUser = async (onSuccess, onFailure, payload) => {
    await asyncPost(validateUserUrl, onSuccess, onFailure, payload);
};

export const validatePrivateRoute = async (onSuccess, onFailure, payload) => {
    await asyncPost(validatePrivateRouteUrl, onSuccess, onFailure, payload);
};

export const logout = async (onSuccess, onFailure,payload) => {
    await asyncPost(logoutUrl, onSuccess, onFailure, payload);
};


/********
 * Real Time Condition Monitoring System API's
 * *******/

export const getMRVScreenData = (vesselId, onSuccess, onFailure) => {
    const url = `${getMRVStateUrl}?vesselId=${vesselId}`;
    get(url, onSuccess, onFailure);
};

export const getMRVScreenDataByVoyage = (vesselId, voyage, onSuccess, onFailure) => {
    const url = `${getMRVStateByVoyageUrl}?vesselId=${vesselId}&voyage=${voyage}`;
    get(url, onSuccess, onFailure);
};

export const getMRVScreenDataByDate = (vesselId, fromDate, toDate, onSuccess, onFailure) => {
    const url = `${getMRVStateByDateUrl}?vesselId=${vesselId}&fromDate=${fromDate}&toDate=${toDate}`;
    get(url, onSuccess, onFailure);
};

export const getFleetDashboardAllVesselsPanelData = (onSuccess, onFailure) => {
    const url = `${getFleetDashboardAllVesselsPanelDataUrl}`;
    get(url, onSuccess, onFailure);
};

export const getFleetDashboardParametersFilterData = (onSuccess, onFailure) => {
    const url = `${getFleetDashboardParametersFilterDataUrl}`;
    get(url, onSuccess, onFailure);
};

export const getFleetDashboardScreenData = (vesselId, onSuccess, onFailure) => {
    const url = `${getFleetDashboardStateUrl}?vesselId=${vesselId}`;
    get(url, onSuccess, onFailure);
};

export const getAllShipSourceDastinationData = (onSuccess, onFailure) => {
    const url = `${getAllShipSourceDastinationDataUrl}`;
    get(url, onSuccess, onFailure);
};

export const getXpressMainEngineScreenData = (vesselId, onSuccess, onFailure) => {
    const url = `${getXpressMainEngineStateUrl}?vesselId=${vesselId}`;
    get(url, onSuccess, onFailure);
};
export const getBataviaMainEngineScreenData = (vesselId, onSuccess, onFailure) => {
    const url = `${getBataviaMainEngineStateUrl}?vesselId=${vesselId}`;
    get(url, onSuccess, onFailure);
};
export const getAsiaMainEngineScreenData = (vesselId, onSuccess, onFailure) => {
    const url = `${getAsiaMainEngineStateUrl}?vesselId=${vesselId}`;
    get(url, onSuccess, onFailure);
};

export const getDigitalAlarmScreenData = (vesselId, onSuccess, onFailure) => {
    const url = `${getDigitalDataStateUrl}?vesselId=${vesselId}`;
    get(url, onSuccess, onFailure);
};

export const getNanjingMainEngineScreenData = (vesselId, onSuccess, onFailure) => {
    const url = `${getNanjingMainEngineStateUrl}?vesselId=${vesselId}`;
    get(url, onSuccess, onFailure);
};

export const getDashboardScreenData = (vesselId, onSuccess, onFailure) => {
    const url = `${getDashboardStateUrl}?vesselId=${vesselId}`;
    get(url, onSuccess, onFailure);
};

export const getMainEngineScreenData = (vesselId, onSuccess, onFailure) => {
    const url = `${getMainEngineStateUrl}?vesselId=${vesselId}`;
    get(url, onSuccess, onFailure);
};

export const getSparIndusMainEngineScreenData = (vesselId, onSuccess, onFailure) => {
    const url = `${getSparIndusMainEngineStateUrl}?vesselId=${vesselId}`;
    get(url, onSuccess, onFailure);
};

export const getMainGaugesScreenData = (vesselId, onSuccess, onFailure) => {
    const url = `${getMainGaugesStateUrl}?vesselId=${vesselId}`;
    get(url, onSuccess, onFailure);
};

export const getTodayAlertData = (alertType, vesselId, onSuccess, onFailure) => {
    const url = `${getTodayAlertDataUrl}?alertType=${alertType}&vesselId=${vesselId}`;
    get(url, onSuccess, onFailure);
};

export const getAlertHistory = (onSuccess, onFailure) => {
    get(getAlertHistoryUrl, onSuccess, onFailure);
};

export const getAllVesselsWindyMapData = (onSuccess, onFailure) => {
    const url = `${getAllVesselsWindyMapDataUrl}`;
    get(url, onSuccess, onFailure);
};

export const getWindyMapData = (onSuccess, onFailure, payload) => {
    const url = `${getWindyMapDataUrl}?vesselId=${payload.vesselId}`;
    get(url, onSuccess, onFailure);
};

/* SOCKET */
export const establishSocketConnection = (socketSubscriberName, otherData) => {
    return socketIOClient(SOCKET_SERVER_URL, {
        query: {
            'socketSubscriberName': socketSubscriberName,
            'otherData': JSON.stringify(otherData)
        },
        path: "/orionbe/socket.io"
    });
};

export const saveShipRoute = async (onSuccess, onFailure, payload) => {
    await asyncPost(saveShipRouteUrl, onSuccess, onFailure, payload);
};

export const updateShipRoute = async (onSuccess, onFailure, payload) => {
    await asyncPost(updateShipRouteUrl, onSuccess, onFailure, payload);
};

export const getShipRoute = async (onSuccess, onFailure, payload) => {
    await asyncPost(getShipRouteUrl, onSuccess, onFailure, payload);
};

export const updatedRouteHistoryData = async (onSuccess, onFailure, payload) => {
    await asyncPost(updateRouteHistoryDataUrl, onSuccess, onFailure, payload);
};

export const insertRedPoint= async (onSuccess, onFailure, payload) => {
    await asyncPost(insertRedPointUrl, onSuccess, onFailure, payload);
};

// upload Pdf report file data ==>
export const UploadReportionformation = async (onSuccess, onFailure, formData ) => {
    post(UploadReportionformationUrl, onSuccess, onFailure,  formData);
  };
  //  pdf file update data
  export const updatePdfById = (onSuccess,onFailure, payload) => {
    debugger
    post(updatePdfByIdUrl, onSuccess, onFailure, payload);
  };
  export const getAllReport = (onSuccess, onFailure) => {
    get(getreportDataUrl, onSuccess, onFailure);
  };
  
  export const downloadpdf = (onSuccess, onFailure,filepath) => {
    get(`${downloadPdfFileUrl}?filepath=${filepath}`, onSuccess, onFailure, {responseType:"arraybuffer"});
  };
  //  delete pdf file data
  export const deleteReportionformation = (onSuccess, onFailure, id, filepath) => {
    post(`${deletereportDataUrl}?id=${id}&filepath=${filepath}`, onSuccess, onFailure);
  };
/* Code By: Yogesh chavan
       Created At: 24/03/2022
       TasK:SSH-46
       desc: call a getMRVStateByDateAndVoyage api
   */
       export const getMRVStateByDateAndVoyage = (vesselId, fromDate, toDate, voyageName, onSuccess, onFailure) => {
        const url = `${getMRVStateByDateAndVoyageURL}?vesselId=${vesselId}&fromDate=${fromDate}&toDate=${toDate}&voyageName=${voyageName}`;
        get(url, onSuccess, onFailure);
    };
    export const getCompassData = (vesselId, onSuccess, onFailure) => {
        const url = `${getCompassStateURL}?vesselId=${vesselId}`;
        get(url, onSuccess, onFailure);
    };

    export const getCIIStateData = (vesselId, onSuccess, onFailure) => {
        const url = `${getCIIStateDataURL}?vesselId=${vesselId}`;
        get(url, onSuccess, onFailure);
    };
    
    export const getCIIStateDatanew = (vesselId, type, onSuccess, onFailure) => {
        const url = `${getCIIStateDataURLnew}?vesselId=${vesselId}&type=${type}`;
        get(url, onSuccess, onFailure);
    }
    
    
    export const getCIILast90DaysData = (vesselId, year, type, onSuccess, onFailure) => {
        const url = `${getCIILast90DaysDataURL}?vesselId=${vesselId}&year=${year}&type=${type}`;
        get(url, onSuccess, onFailure);
    };
    
    export const getCIIStateByVoyage = (vesselId, voyage, type, onSuccess, onFailure) => {
        const url = `${getCIIStatebyVoyageURL}?vesselId=${vesselId}&voyage=${voyage}&type=${type}`;
        get(url, onSuccess, onFailure);
    }
    
    export const getCIIStateByDate = (vesselId, fromDate, toDate, type, onSuccess, onFailure) => {
        const url = `${getCIIStatebyDateURL}?vesselId=${vesselId}&fromDate=${fromDate}&toDate=${toDate}&type=${type}`;
        get(url, onSuccess, onFailure);
    }
    
    export const getCIIStateByDateAndVoyage = (vesselId, fromDate, toDate, voyageName, onSuccess, onFailure) => {
        const url = `${getCIIStatebyDateAndVoyageURL}?vesselId=${vesselId}&fromDate=${fromDate}&toDate=${toDate}&voyageName=${voyageName}`;
        get(url, onSuccess, onFailure);
    }
    
    export const getCIIStateByDemand = (vesselId, onSuccess, onFailure) => {
        const url = `${getCIIStatebyDemandURL}?vesselId=${vesselId}`;
        get(url, onSuccess, onFailure);
    }
    
    export const getCIIStateBySupply = (vesselId, onSuccess, onFailure) => {
        const url = `${getCIIStatebySupplyURL}?vesselId=${vesselId}`;
        get(url, onSuccess, onFailure);
    }