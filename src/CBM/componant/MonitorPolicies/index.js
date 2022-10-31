import React, {Component} from 'react';
import NavigationBar from "../common/NavigationBar";


import plus64Icon from "../../Images/plus-64.png";
import minus64Icon from "../../Images/minus-64.png";
import collapseArrow from "../../Images/downloadedImages/collapse-arrow.png";
import expandedArrow from "../../Images/downloadedImages/expand-arrow.png";
import {Accordion, Button, Card, Col, Form, FormControl, Row} from "react-bootstrap";
import NewOutcomeTableUI from "../common/Outcome/NewOutcomeTableUI";
import NewCauseTableUI from "../common/Cause/NewCauseTableUI";
import NewWidgetMappingTableUI from "../common/NewWidgetMappingTableUI"
import NewAdvisoryTableUI from "../common/Advisory/NewAdvisoryTableUI";
import NewRuleFileTableUI from "../common/NewRuleFileTableUI";
import NewParameterFileTableUI from "../common/NewParameterFileTableUI";
import NewParametersTableUI from "../common/Parameter/NewParametersTableUI";
import NewConstantParameterTableUI from "../common/Constant/NewConstantParameterTableUI";
import {
    deleteCauses,
    deleteFailureAdvisory,
    deleteOutcome,
    deleteParameter,
    deleteRuleBlock,
    getAllCausesByShip,
    getAllConstantParameters,
    getAllFailureAdvisoriesByShip,
    getAllParametersByShipAndRTDASMapping,
    getAllRTDASRegistrations,
    getMergeParameterTableData,
    getParameterTableData,
    getRuleChainTableDataByShip,
    getRuleConfigAllDataByShip,
    updateRuleChain,
    createRuleUsingCsv,
    getAllShipsAndMachines,
    getAllShips,
    uploadWidgetFile,
    getLastWidgetFile,
    downloadcsv
} from "../../../api";
import {
    defaultCalculatedExpressionForm,
    defaultCauseForm,
    defaultConnectionForm,
    defaultConstantParameterForm,
    defaultJsonForm,
    defaultParameterForm,
    defaultSelectedCondition,
    defaultCauseArrObjectFromServer,
    defaultConfigForm,
    defaultRuleChainForm,
    defaultAdvisoryForm,
    defaultNewParameterConstantForm,
    defaultPagination,
    sortByDropdownList,
} from "../Constants";
import {getLastRuleFile,downloadRulecsv,getLastParameterFile,downloadParametercsv,getUserByShipId,setResetEmailForFailureAdvisoriesRefCause} from "../../../api";
import SmartShipLoader from "../common/SmartShipLoader";
import NewRuleChainTableUI from "../common/RuleChain/NewRuleChainTableUI";
import CustomTooltip from "../custom/CustomTooltip";
import NewRTDASTableUI from "../common/RTDAS/NewRTDASTableUI";
import NewCalculatedExpressionTableUI from "../common/CalculatedExpression/NewCalculatedExpressionTableUI";
import CustomAlert from "../custom/CustomAlert";
import SMSidebar from "../../../SMSidebar";
import Select from "react-select";

import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import {getItemFromLocalStorage, getVesselName, setItemInLocalStorage} from "../../../RTCM/common/helper";
const theme = theme => ({
    ...theme,
    colors: {
        ...theme.colors,
    },
    borderRadius: 2,
    baseUnit: 1,
    controlHeight: 35,
    fontSize: 14
});

class MonitorPolicies extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isAllAccordionCollapse: true,
            accordions: {
                advisory_acc: false,
                cause_acc: false,
                outcome_acc: false,
                uploadcsv_acc: false,
                upload_widget_acc:false,
                rule_acc: false,
                parameter_acc: false,
                constant_acc: false,
                merged_param_constant_acc: false,
                rtdas_acc: false,
                calc_expr_acc: false,
            },
            loading: true,
            addedCauseElements: null,
            lastwidgetMappingFile: null,
            ruleChainList: null,
            ruleConfigList: [],
            csvFile: null,
            widgetCsvFile: null,
            addedParameterElements: null,
            lastRuleFile:null,
            lastParameterFile:null,
            addedConstantElements: null,
            addedAdvisoryElements: null,
            rtdasList: null,
            calcExpressionList: null,
            configListForOutcome: null,
            shipList:null,
            vesselLabel:null,
            vesselValue:null,
            machineName:[],
            searchByName:"",
            sortingOption:{
                "label":"Ascending",
                "value":"asc"
            },
            machineArr: [],

            parameterPagination: {...defaultPagination},
            ruleChainPagination: {...defaultPagination},
            causePagination: {...defaultPagination},
            advisoryPagination: {...defaultPagination},
            outcomePagination: {...defaultPagination},
            allUserDataForShip:[],
            showAutoEmailModal:false
        };
        this.customAlertRef = React.createRef();
    }

    showAlert = (message) => {
        this.customAlertRef.current.showAlert(message)
    };

    componentDidMount() {
        let data = this.props.history.location.data;
        if(data !== undefined){
            if(data.message !== undefined) {
                this.showAlert({
                    type: "success",
                    message: data.message
                });
            }
        }
        getAllShipsAndMachines(this.getAllShipsAndMachinesSuccess,this.getAllShipsAndMachinesFail);
    }

    getAllUserSuccess = (response) => {
        if (response.data && response.data.length) {
            let userData = [...response.data];
            let filterData = userData.map((item) => {
                let fullName = item.firstname + " " + item.lastname;
                let dropDownItem = {
                    value: fullName,
                    label: fullName,
                    email: item.email,
                    id: item.id
                };
                return dropDownItem;
            });
            this.setState({allUserDataForShip:filterData});
        }
    }

    getAllUserFailure = (error) => {
        // this.setState({
        //     loading: true
        // })
    };

    componentWillUnmount() {
        this.customAlertRef  = null;
    }

    /***
     * Advisory
     * **/
    onGetAllAdvisoryElementsSuccess = (response) => {const {
        activePage,
        data: advisoryData,
        itemsCountPerPage,
        pageRangeDisplayed,
        totalItemsCount,
    } = {...response.data};

        const advisoryPagination = {...this.state.advisoryPagination};
        advisoryPagination.activePage = activePage;
        advisoryPagination.itemsCountPerPage = itemsCountPerPage;
        advisoryPagination.pageRangeDisplayed = pageRangeDisplayed;
        advisoryPagination.totalItemsCount = totalItemsCount;

        const addedAdvisoryElements = Object.entries(advisoryData).map(([key, obj]) => Object.assign(
            {
                uId: key,
                ...obj,
                fa_alarm_radio: (obj.isFailureAdvisory && "failure_advisory") || (obj.isAlarm && "alarm")
            }
        ));

        addedAdvisoryElements.sort((a, b) => {
            if (this.state.sortingOption.value === 'asc') {
                return (a.name > b.name) ? 1 : -1;
            } else {
                return (a.name < b.name) ? 1 : -1;
            }
        });

        this.setState({
            addedAdvisoryElements,
            advisoryPagination,
            loading: false
        })
    };

    onGetAllAdvisoryElementsFailure = (error) => {
        this.setState({
            loading: false
        })
    };

    onAddNewAdvisoryClick = () => {
        const advisoryForm = JSON.parse(JSON.stringify(defaultAdvisoryForm));
        this.props.history.push({
            pathname: '/NewAdvisoryFormUI',
            data: {
                advisoryForm
            }
        });
    };

    onAdvisoryEditClick = (event) => {
        let advisoryForm = {};
        let addedAdvisoryElements = [...this.state.addedAdvisoryElements];
        const currentUid = event.target.dataset.uid;
        for (let eIndex = 0; eIndex < addedAdvisoryElements.length; eIndex++) {
            if (currentUid === addedAdvisoryElements[eIndex].uId) {
                advisoryForm = {...addedAdvisoryElements[eIndex]};
                break;
            }
        }

        this.props.history.push({
            pathname: '/NewAdvisoryFormUI',
            data: {
                advisoryForm
            }
        });
    };

    onAdvisoryDeleteClick = (event) => {
        const currentUid = event.target.dataset.uid;
        this.setState({
            loading: true
        });
        const onDeleteFailureAdvisorySuccess = this.onDeleteFailureAdvisorySuccess(currentUid);
        deleteFailureAdvisory(onDeleteFailureAdvisorySuccess, this.onDeleteFailureAdvisoryFailure, currentUid)
    };

    onDeleteFailureAdvisorySuccess = (currentUid) => {
        return (resp) => {
            if (true === resp.data) {
                let addedAdvisoryElements = [...this.state.addedAdvisoryElements];
                addedAdvisoryElements = addedAdvisoryElements.filter((advisoryElement) => currentUid !== advisoryElement.uId);
                // alert("delete successfule")
                this.setState({
                    loading: false,
                    addedAdvisoryElements
                })
            } else {
                this.showAlert({
                    type: "error",
                    message: resp.data
                });
                this.setState({
                    loading: false
                })
            }
        };
    };

    onDeleteFailureAdvisoryFailure = () => {
        this.setState({
            loading: false
        })
    };

    /***
     * Cause Functions
     * **/
    onGetAllElementsSuccess = (response) => {
        const {
            activePage,
            data: causeData,
            itemsCountPerPage,
            pageRangeDisplayed,
            totalItemsCount,
        } = {...response.data};

        const causePagination = {...this.state.causePagination};
        causePagination.activePage = activePage;
        causePagination.itemsCountPerPage = itemsCountPerPage;
        causePagination.pageRangeDisplayed = pageRangeDisplayed;
        causePagination.totalItemsCount = totalItemsCount;

        const addedCauseElements = Object.entries(causeData).map(([key, obj]) => Object.assign(
            {
                uId: key,
                ...obj,
            }
        ));

        addedCauseElements.sort((a, b) => {
            if (this.state.sortingOption.value === 'asc') {
                return (a.name > b.name) ? 1 : -1;
            } else {
                return (a.name < b.name) ? 1 : -1;
            }
        });
        this.setState({
            addedCauseElements,
            causePagination,
            loading: false
        })
    };

    onGetAllElementsFailure = (error) => {
        this.setState({
            loading: false
        })
    };

    onAddNewCauseClick = () => {
        const causeForm = JSON.parse(JSON.stringify(defaultCauseForm));
        this.props.history.push({
            pathname: '/NewCauseFormUI',
            data: {
                causeForm
            }
        });
    };

    onEditCauseClick = (event) => {
        let causeForm = {};
        let addedCauseElements = [...this.state.addedCauseElements];
        const currentUid = event.target.dataset.uid;
        for (let eIndex = 0; eIndex < addedCauseElements.length; eIndex++) {
            if (currentUid === addedCauseElements[eIndex].uId) {
                causeForm = {...addedCauseElements[eIndex]};
                break;
            }
        }
        this.props.history.push({
            pathname: '/NewCauseFormUI',
            data: {
                causeForm
            }
        });
    };

    onDownloadFileClick = (event) => {
        let addWidgetElements = this.state.lastwidgetMappingFile;
        const fileId = event.target.dataset.uid;
        const vesselId = addWidgetElements.vesselid;
        const fileName = addWidgetElements.filename;
        downloadcsv(this.downloadcsvSuccess,this.downloadcsvFail,fileId,fileName,vesselId)
    };

    downloadcsvSuccess = (res) => {
        debugger
        const csvData = res.data.cavData;
        const fileName = res.data.fileName;
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvData);
        hiddenElement.target = '_blank';

        //provide the name for the CSV file to be downloaded
        hiddenElement.download = fileName;
        hiddenElement.click();
        console.log("csv download success!!!");
    };

    downloadcsvFail = (event) => {
        console.log("csv download fail!!!");
    };

    onCauseDeleteClick = (event) => {
        const currentUid = event.target.dataset.uid;
        this.setState({
            loading: true
        });
        const onCauseDeleteSuccess = this.onCauseDeleteSuccess(currentUid);
        deleteCauses(onCauseDeleteSuccess, this.onCauseDeleteFailure, currentUid)
    };

    onDownloadRuleFileClick = (event) => {

        let addRuleElements = this.state.lastRuleFile;
        const fileId = event.target.dataset.uid;
        const vesselId = addRuleElements.vesselid;
        const fileName = addRuleElements.fileName;
        downloadRulecsv(this.downloadRulecsvSuccess,this.downloadRulecsvFail,fileId,fileName,vesselId)
    };

    downloadRulecsvSuccess = (res) => {

        const csvData = res.data.cavData;
        const fileName = res.data.fileName;
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvData);
        hiddenElement.target = '_blank';

        //provide the name for the CSV file to be downloaded
        hiddenElement.download = fileName;
        hiddenElement.click();
        console.log("Rule csv download success!!!");
    };

    downloadRulecsvFail = (event) => {
        console.log("Rule csv download fail!!!");
    };

    onDownloadParameterFileClick = (event) => {

        let addRuleElements = this.state.lastParameterFile;
        const fileId = event.target.dataset.uid;
        const vesselId = addRuleElements.vesselid;
        const fileName = addRuleElements.fileName;
        downloadParametercsv(this.downloadParametercsvSuccess,this.downloadParametercsvFail,fileId,fileName,vesselId)
    };

    downloadParametercsvSuccess = (res) => {

        const csvData = res.data.cavData.replaceAll('#',' ');
        const fileName = res.data.fileName;
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvData);
        hiddenElement.target = '_blank';

        //provide the name for the CSV file to be downloaded
        hiddenElement.download = fileName;
        hiddenElement.click();
        console.log("Parameter csv download success!!!");
    };

    downloadParametercsvFail = (event) => {
        console.log("Parameter csv download fail!!!");
    };

    onCauseDeleteSuccess = (currentUid) => {
        return (resp) => {
            if (true === resp.data) {
                let addedCauseElements = [...this.state.addedCauseElements];
                addedCauseElements = addedCauseElements.filter((addedCauseElement) => currentUid !== addedCauseElement.uId);
                // alert("delete successfule")
                this.setState({
                    loading: false,
                    addedCauseElements
                })
            } else {
                this.showAlert({
                    type: "error",
                    message: resp.data
                });
                this.setState({
                    loading: false
                })
            }
        };
    };

    onCauseDeleteFailure = () => {
        this.setState({
            loading: false
        })
    };

    /**
     *  Outcome
     * ***/
    getAllConfigData = (resp, allOutcomes) => {
        let configListForOutcome = [];
        let failureAdvisory = {};
        const {
            activePage,
            data: outcomeData,
            itemsCountPerPage,
            pageRangeDisplayed,
            totalItemsCount,
        } = {...allOutcomes.data};

        const outcomePagination = {...this.state.outcomePagination};
        outcomePagination.activePage = activePage;
        outcomePagination.itemsCountPerPage = itemsCountPerPage;
        outcomePagination.pageRangeDisplayed = pageRangeDisplayed;
        outcomePagination.totalItemsCount = totalItemsCount;


       // console.log("The main resp",allOutcomes);

        let ruleChainListForOutcome = resp ? Object.entries(resp.data.ruleBlockData)
            .map(([key, obj]) => Object.assign({
                ruleChainId: key,
                ruleChainName: resp.data.ruleBlockData[key].name,
                description: resp.data.ruleBlockData[key].description,
            })) : [];

        try {
            outcomeData.map((ruleConfigItem) => {
                const fauilureAdvisoryId = ruleConfigItem.FA;
                let causeArr = [];
                const fa_alarm_radio = (ruleConfigItem.isFailureAdvisory && "failure_advisory") || (ruleConfigItem.isAlarm && "alarm");

                const failureAdvisoryDataItem = resp.data.failureAdvisories[fauilureAdvisoryId];
                failureAdvisory = {
                    value: fauilureAdvisoryId,
                    label: failureAdvisoryDataItem.name,
                    description: failureAdvisoryDataItem.description
                };


                const causeExpressionStringArr = this.getCauseExpressionStringArrFromString(ruleConfigItem.Causes);
                const causeArrList = [];
                for (let ceIndex = 0; ceIndex < causeExpressionStringArr.length; ceIndex++) {
                    let causeArrListObject = [];
                    const causeExpressionString = causeExpressionStringArr[ceIndex];
                    if (causeExpressionString === "(") {
                        causeArrListObject = JSON.parse(JSON.stringify(defaultCauseArrObjectFromServer));
                        if (ceIndex !== 0) {
                            causeArrListObject.condition = this.getSelectedConditionObject(causeExpressionStringArr[ceIndex - 1])
                        }
                        ceIndex += 1;
                        const causes = causeExpressionStringArr[ceIndex];
                        if (causes.indexOf("&&") === -1 && causes.indexOf("||") === -1) {
                            causeArr.push(causes);
                        } else {
                            causeArr = this.getCauseStringArrFromString(causes)
                        }
                        for (let cIndex = 0; cIndex < causeArr.length; cIndex++) {
                            if (cIndex % 2 !== 0) {
                                continue;
                            }
                            let ruleChainArrList = [];
                            const causeId = causeArr[cIndex];
                            const selectedCauseObject = this.getSelectedCauseById(causeId, resp.data.causes);
                            let selectedConditionObject = {
                                value: "",
                                label: ""
                            };
                            if (cIndex !== 0 && cIndex % 2 === 0) {
                                selectedConditionObject = this.getSelectedConditionObject(causeArr[cIndex - 1]);
                            }

                            const causeRuleChain = this.getRuleChainByCauseId(causeId, ruleConfigItem.causeRuleChain);
                            const ruleChainArr = this.getRCStringArrFromString(causeRuleChain);
                            let ruleChainsItem = {
                                isAccordionOpen: true,
                                arr: []
                            };

                            for (let rcaIndex = 0; rcaIndex < ruleChainArr.length; rcaIndex++) {
                                const ruleChainName = ruleChainArr[rcaIndex];
                                if (ruleChainName === "(") {
                                    if (rcaIndex !== 0) {
                                        const prevRuleChainName = ruleChainArr[rcaIndex - 1];
                                        const condition = this.getSelectedConditionObject(prevRuleChainName);
                                        ruleChainsItem = {
                                            isAccordionOpen: true,
                                            condition,
                                            arr: []
                                        };
                                    } else {
                                        ruleChainsItem = {
                                            isAccordionOpen: true,
                                            condition: {},
                                            arr: []
                                        };
                                    }
                                } else if (ruleChainName === ")") {
                                    ruleChainArrList.push(ruleChainsItem);
                                } else if (ruleChainName === "&&" || ruleChainName === "||") {
                                    const prevRuleChainName = ruleChainArr[rcaIndex - 1];
                                    if (prevRuleChainName === ")") {
                                        continue;
                                    } else {
                                        /*ruleChainsItem.arr.push({
                                            condition: this.getSelectedCondtionObject(ruleChainName),
                                            ruleChain: this.getRuleChain(nextRuleChainName, ruleChainListForOutcome)
                                        });   */
                                    }
                                } else {
                                    const nextRuleChainName = ruleChainArr[rcaIndex + 1];
                                    let conditionName = "";
                                    if (nextRuleChainName === "&&" || nextRuleChainName === "||") {
                                        conditionName = nextRuleChainName;
                                        rcaIndex += 1;
                                    }
                                    ruleChainsItem.arr.push({
                                        condition: this.getSelectedConditionObject(conditionName),
                                        ruleChain: this.getRuleChain(ruleChainName, ruleChainListForOutcome)
                                    });
                                }
                            }
                            const causeObject = {
                                cause: selectedCauseObject,
                                condition: selectedConditionObject,
                                ruleChainArrList: ruleChainArrList
                            };
                            causeArrListObject.causeList.push(causeObject);
                        }
                        causeArrList.push(causeArrListObject);
                        causeArrListObject = {
                            isAccordionOpen: true,
                            condition: {...defaultSelectedCondition},
                            causeList: []
                        };
                        causeArr = [];
                    } else if (causeExpressionString === ")") {
                        continue;
                    } else {

                    }
                }

                const configId = ruleConfigItem.CONFIG_ID;
                let configListItem = {
                    configId,
                    fa_alarm_radio,
                    failureAdvisory,
                    causeArrList: [...causeArrList],
                    sendEmail:ruleConfigItem.sendEmail
                };
                configListForOutcome = [configListItem, ...configListForOutcome];
            });
        } catch (e) {
            //console.log(e);
        }

        configListForOutcome.sort((a, b) => {
            if (this.state.sortingOption.value === 'asc') {
                return (a.failureAdvisory.description > b.failureAdvisory.description) ? 1 : -1;
            } else {
                return (a.failureAdvisory.description < b.failureAdvisory.description) ? 1 : -1;
            }
        });

        this.setState({
            loading: false,
            outcomePagination,
            configListForOutcome
        });
    };
    getAllConfigDataFailed = (resp) => {
        console.error(resp);
    };
    getCauseExpressionStringArrFromString = (causeExpressionString) => {
        let ruleChainStringArr = [];
        let letter = "";
        let word = "";
        for (let ceIndex = 0; ceIndex < causeExpressionString.length; ceIndex++) {
            letter = causeExpressionString[ceIndex];
            if (letter === "(" || letter === ")") {
                if (word) {
                    ruleChainStringArr.push(word);
                }
                word = "";
                ruleChainStringArr.push(letter);
            } else {
                word += letter
            }
        }
        return ruleChainStringArr;
    };
    getCauseStringArrFromString = (string) => {
        let causeNamesArr = [];
        const orArr = string.split("||");
        for (let cnIndex = 0; cnIndex < orArr.length; cnIndex++) {
            if (cnIndex !== 0) {
                causeNamesArr.push("||");
            }
            if (orArr[cnIndex].indexOf("&&") !== -1) {
                const andArr = orArr[cnIndex].split("&&");
                for (let aIndex = 0; aIndex < andArr.length; aIndex++) {
                    if (aIndex !== 0) {
                        causeNamesArr.push("&&");
                    }
                    causeNamesArr.push(andArr[aIndex]);
                }
            } else {
                causeNamesArr.push(orArr[cnIndex]);
            }
        }
        return causeNamesArr;
    };
    getSelectedCauseById = (causeId, causeList) => {
        let selectedCause = {
            value: causeId,
            label: causeList[causeId].name,
            description: causeList[causeId].description,
        };
        return selectedCause;
    };
    getRuleChainByCauseId = (causeId, causeRuleChain) => {
        let ruleChainString = "";
        for (let crIndex = 0; crIndex < causeRuleChain.length; crIndex++) {
            if (causeRuleChain[crIndex].cause === causeId) {
                ruleChainString = causeRuleChain[crIndex].ruleChains;
                break;
            }
        }
        return ruleChainString;
    };
    getRCStringArrFromString = (ruleChainString) => {
        let ruleChainStringArr = [];
        let letter = "";
        let word = "";
        for (let rcsIndex = 0; rcsIndex < ruleChainString.length; rcsIndex++) {
            letter = ruleChainString[rcsIndex];
            if (letter === "(" || letter === ")") {
                if (word) {
                    ruleChainStringArr.push(word);
                }
                word = "";
                ruleChainStringArr.push(letter);
            } else if (letter === "|" || letter === "&") {
                if (word.indexOf("|") === -1 && word.indexOf("&") === -1) {
                    if (word) {
                        ruleChainStringArr.push(word);
                    }
                    word = "";
                }
                word += letter
                if (word === "||" || word === "&&") {
                    ruleChainStringArr.push(word)
                    word = "";
                }
            } else {
                word += letter
            }
        }
        return ruleChainStringArr;
    };
    getSelectedConditionObject = (operatorContion) => {
        let selectedConditionObject = {};
        if (operatorContion === "||") {
            selectedConditionObject = {
                value: "||",
                label: "OR"
            }
        } else if (operatorContion === "&&") {
            selectedConditionObject = {
                value: "&&",
                label: "AND"
            }
        } else {
            selectedConditionObject = {
                value: "||",
                label: "OR"
            }
        }
        return selectedConditionObject;
    };
    getRuleChain = (ruleChainName, ruleChainList) => {
        let ruleChainItem = {
            value: ruleChainName,
            label: ""
        };
        for (let rcIndex = 0; rcIndex < ruleChainList.length; rcIndex++) {
            if (ruleChainList[rcIndex].ruleChainId === ruleChainName) {
                ruleChainItem.value = ruleChainList[rcIndex].ruleChainId;
                ruleChainItem.label = ruleChainList[rcIndex].ruleChainName;
                break;
            }
        }
        return ruleChainItem
    };
    /**
     * Config Table Functions
     * **/
    onConfigItemEdit = (event) => {
        const configId = event.target.dataset.configid;
        const configListForOutcome = [...this.state.configListForOutcome];
        let configForm = {};
        for (let rbIndex = 0; rbIndex < configListForOutcome.length; rbIndex++) {
            const configItem = configListForOutcome[rbIndex];
            if (configId === configItem.configId) {
                configForm = configListForOutcome[rbIndex];
                break;
            }
        }

        this.props.history.push({
            pathname: '/NewOutcomeFormUI',
            data: {
                configForm
            }
        });
    };
    onAddNewConfigClick = () => {
        this.props.history.push({
            pathname: '/NewOutcomeFormUI',
            data: {
                defaultConfigForm
            }
        });
    };

    onConfigItemDuplicate = (event) => {
        const configId = event.target.dataset.configid;
        const configListForOutcome = [...this.state.configListForOutcome];
        let configForm = {};
        for (let rbIndex = 0; rbIndex < configListForOutcome.length; rbIndex++) {
            const configItem = configListForOutcome[rbIndex];
            if (configId === configItem.configId) {
                configForm = JSON.parse(JSON.stringify(configListForOutcome[rbIndex]));
                configForm.configId = -1;
                break;
            }
        }

        this.props.history.push({
            pathname: '/NewOutcomeFormUI',
            data: {
                configForm
            }
        })
    };
    getCauseExpressionTableUI = (configForm) => {
        let causeCondition = [];
        const causeArrList = configForm.causeArrList;
        for (let cArrIndex = 0; cArrIndex < causeArrList.length; cArrIndex++) {
            const causeList = causeArrList[cArrIndex].causeList;
            for (let index = 0; index < causeList.length; index++) {
                if (causeArrList.length === 1) {
                    if (causeList.length === 1) {
                        // causeCondition += "(" + causeList[index].cause.value + ")";
                        causeCondition.push([
                            (<div className={"causeCondition"} key={`${index}-(`}>(</div>),
                            (<div key={`${index}-${causeList[index].cause.value}`}>
                                <CustomTooltip
                                    description={causeList[index].cause.description}
                                    label={causeList[index].cause.label}
                                />
                            </div>),
                            (<div className={"causeCondition"} key={`${index}-)`}>)</div>)
                        ])
                    } else {
                        if (index === 0) {
                            // causeCondition += "(" + causeList[index].cause.value;
                            causeCondition.push([
                                (<div className={"causeCondition"} key={`${index}-(`}>(</div>),
                                (<div key={`${index}-${causeList[index].cause.value}`}>
                                    <CustomTooltip
                                        description={causeList[index].cause.description}
                                        label={causeList[index].cause.label}
                                    />
                                </div>),
                            ]);
                        } else if (index === causeList.length - 1) {
                            // causeCondition += causeList[index].condition.value + causeList[index].cause.value + ")";
                            causeCondition.push([
                                (<div className={"causeCondition"}
                                      key={`${index}-${causeList[index].condition.value}`}>{causeList[index].condition.value}</div>),
                                (<div key={`${index}-${causeList[index].cause.value}`}>
                                    <CustomTooltip
                                        description={causeList[index].cause.description}
                                        label={causeList[index].cause.label}
                                    />
                                </div>),
                                (<div className={"causeCondition"} key={`${index}-)`}>)</div>)
                            ])
                        } else {
                            // causeCondition += causeList[index].condition.value + causeList[index].cause.value;
                            // causeCondition += causeList[index].condition.value + causeList[index].cause.value;
                            // causeCondition += causeList[index].condition.value + causeList[index].cause.value;
                            causeCondition.push([
                                (<div className={"causeCondition"}
                                      key={`${index}-${causeList[index].condition.value}`}>{causeList[index].condition.value}</div>),
                                (<div key={`${index}-${causeList[index].cause.value}`}>
                                    <CustomTooltip
                                        description={causeList[index].cause.description}
                                        label={causeList[index].cause.label}
                                    />
                                </div>),
                            ]);
                        }
                    }
                } else {
                    if (causeList.length === 1) {
                        const causeBlockCondtion = cArrIndex !== 0 ? causeArrList[cArrIndex].condition.value : "";
                        // causeCondition += causeBlockCondtion + "(" + causeList[index].cause.value + ")";
                        causeCondition.push([
                            (<div className={"causeCondition"}
                                  key={`${index}-${causeBlockCondtion}`}>{causeBlockCondtion}</div>),
                            (<div className={"causeCondition"} key={`${index}-${"("}`}>(</div>),
                            (<div key={`${index}-${causeList[index].cause.value}`}>
                                <CustomTooltip
                                    description={causeList[index].cause.description}
                                    label={causeList[index].cause.label}
                                />
                            </div>),
                            (<div className={"causeCondition"} key={`${index}-)`}>)</div>)
                        ]);
                    } else {
                        if (index === 0) {
                            const causeBlockCondtion = cArrIndex !== 0 ? causeArrList[cArrIndex].condition.value : "";
                            // causeCondition += causeBlockCondtion + "(" + causeList[index].cause.value;
                            causeCondition.push([
                                (<div className={"causeCondition"}
                                      key={`${index}-${causeBlockCondtion}`}>{causeBlockCondtion}</div>),
                                (<div className={"causeCondition"} key={`${index}-${"("}`}>(</div>),
                                (<div key={`${index}-${causeList[index].cause.value}`}>
                                    <CustomTooltip
                                        description={causeList[index].cause.description}
                                        label={causeList[index].cause.label}
                                    />
                                </div>),
                            ]);
                        } else if (index === causeList.length - 1) {
                            // causeCondition += causeList[index].condition.value + causeList[index].cause.value + ")";
                            causeCondition.push([
                                (<div className={"causeCondition"}
                                      key={`${index}-${causeList[index].condition.value}`}>{causeList[index].condition.value}</div>),
                                (<div key={`${index}-${causeList[index].cause.value}`}>
                                    <CustomTooltip
                                        description={causeList[index].cause.description}
                                        label={causeList[index].cause.label}
                                    />
                                </div>),
                                (<div className={"causeCondition"} key={`${index}-)`}>)</div>)
                            ]);
                        } else {
                            // causeCondition += causeList[index].condition.value + causeList[index].cause.value;
                            causeCondition.push([
                                (<div className={"causeCondition"}
                                      key={`${index}-${causeList[index].condition.value}`}>{causeList[index].condition.value}</div>),
                                (<div key={`${index}-${causeList[index].cause.value}`}>
                                    <CustomTooltip
                                        description={causeList[index].cause.description}
                                        label={causeList[index].cause.label}
                                    />
                                </div>),
                            ]);
                        }
                    }
                }
            }
        }
        return causeCondition;
    };

    onConfigDeleteClick = (event) => {
        const configId = event.target.dataset.configid;
        this.setState({
            loading: true
        });
        const onCauseDeleteSuccess = this.onConfigDeleteSuccess(configId);
        deleteOutcome(onCauseDeleteSuccess, this.onConfigDeleteFailure, configId)
    };

    onConfigDeleteSuccess = (configId) => {
        return (resp) => {
            if (true === resp.data) {
                let configListForOutcome = [...this.state.configListForOutcome];
                configListForOutcome = configListForOutcome.filter((addedCauseElement) => configId !== addedCauseElement.configId);
                // alert("delete successfule")
                this.setState({
                    loading: false,
                    configListForOutcome
                })
            } else {
                this.showAlert({
                    type: "error",
                    message: resp.data
                });
                this.setState({
                    loading: false
                })
            }
        };
    };

    onConfigDeleteFailure = () => {
        this.setState({
            loading: false
        })
    };

    /***
     * Merge Parameter Constant
     * ***/
    onAddNewParameterClick = () => {
        const parameterForm = JSON.parse(JSON.stringify(defaultNewParameterConstantForm));
        this.props.history.push({
            pathname: '/NewMergedParameterFormUI',
            data: {
                parameterForm
            }
        });
    };

    getMergeParameterTableDataSuccess = (parametersResponse, constantResponse, parameterSourceJsonResponse) => {
        let parameterSourceOptions = [];
        for (let psKey in parameterSourceJsonResponse.data) {
            parameterSourceOptions.push({
                value: psKey,
                label: parameterSourceJsonResponse.data[psKey].name
            })
        }
        const addedParameterElements = Object.entries(parametersResponse.data).map(([key, obj]) => {
            {
                const getSelectedRadioOption = (rangeObj) => {
                    return (
                        rangeObj.isRange ? "range"
                            : rangeObj.isSingleValue ? "singleValue"
                            : rangeObj.isCalculatedExpression ? "calculated" : "range"
                    );
                };

                const specifiedRangeObj = obj.specifiedRange;
                const normalRangeObj = obj.normalRange;
                const enumeratedValueObj = obj.enumeratedValue;

                const parameterObject = {
                    uId: key,
                    variableName: obj.name,
                    description: obj.description,
                    variableUnit: obj.unit,
                    machine: obj.machine,
                    informationSource: obj.informationSource,
                    type: obj.signalType,
                    precision: obj.precision,
                    rtdasMapping: obj.rtdasMapping,//todo
                    dataSource: obj.dataSource, //todo
                    specifiedRange: {
                        key: "specifiedRange",
                        isChecked: specifiedRangeObj.isSpecifiedRange,
                        selectedRadio: getSelectedRadioOption(specifiedRangeObj),
                        singleValue: specifiedRangeObj.singleValue.value,
                        from: specifiedRangeObj.range.from,
                        to: specifiedRangeObj.range.to,
                        operator: "",
                        calculatedExpression: specifiedRangeObj.calculatedExpression.expression
                    },
                    normalRange: {
                        key: "normalRange",
                        isChecked: normalRangeObj.isNormalRange,
                        selectedRadio: getSelectedRadioOption(normalRangeObj),
                        singleValue: normalRangeObj.singleValue.value,
                        from: normalRangeObj.range.from,
                        to: normalRangeObj.range.to,
                        operator: "",
                        calculatedExpression: normalRangeObj.calculatedExpression.expression
                    },
                    enumeratedValue: {
                        isChecked: enumeratedValueObj.isEnumeratedValue,
                        enumeratedValueId: -1,
                        currentValue: "",
                        selectedListValue: "",
                        list: ["-", ...enumeratedValueObj.values]
                    }
                };
                return Object.assign({
                    uId: key,
                    variableName: obj.name,
                    ...parameterObject
                })
            }
        }).reverse();
        const addedConstantElements = Object.entries(constantResponse.data).map(([key, obj]) => {
            {
                const getSelectedRadioOption = (rangeObj) => {
                    return (
                        rangeObj.isRange ? "range"
                            : rangeObj.isSingleValue ? "singleValue"
                            : rangeObj.isCalculatedExpression ? "calculated" : "range"
                    );
                };

                const specifiedRangeObj = obj.specifiedRange;
                const normalRangeObj = obj.normalRange;
                const enumeratedValueObj = obj.enumeratedValue;

                let informationSource = {};
                for (let pIndex = 0; pIndex < parameterSourceOptions.length; pIndex++) {
                    /*todo
                    * need to change this key from precision to informationSource
                    * **/
                    if (obj.precision === parameterSourceOptions[pIndex].label) {
                        informationSource = {...parameterSourceOptions[pIndex]};
                        break
                    }
                }

                const parameterObject = {
                    uId: obj.id,
                    Id: obj.id,
                    variableName: obj.name,
                    description: obj.description,
                    variableUnit: obj.unit,
                    machine: obj.machine,
                    informationSource: informationSource,
                    type: obj.signalType,
                    precision: informationSource,//todo
                    rtdasMapping: obj.rtdasMapping,
                    dataSource: obj.dataSource,
                    remark: obj.remark,
                    currentValueOfParameter: obj.currentValueOfParameter,
                    durationUnit: obj.durationUnit,
                    duration: obj.duration,
                    specifiedRange: {
                        key: "specifiedRange",
                        isChecked: specifiedRangeObj.isSpecifiedRange,
                        selectedRadio: getSelectedRadioOption(specifiedRangeObj),
                        singleValue: specifiedRangeObj.singleValue.value,
                        from: specifiedRangeObj.range.from,
                        to: specifiedRangeObj.range.to,
                        operator: "",
                        calculatedExpression: specifiedRangeObj.calculatedExpression.expression
                    },
                    normalRange: {
                        key: "normalRange",
                        isChecked: normalRangeObj.isNormalRange,
                        selectedRadio: getSelectedRadioOption(normalRangeObj),
                        singleValue: normalRangeObj.singleValue.value,
                        from: normalRangeObj.range.from,
                        to: normalRangeObj.range.to,
                        operator: "",
                        calculatedExpression: normalRangeObj.calculatedExpression.expression
                    },
                    enumeratedValue: {
                        isChecked: enumeratedValueObj.isEnumeratedValue,
                        enumeratedValueId: -1,
                        currentValue: "",
                        selectedListValue: "",
                        list: ["-", ...enumeratedValueObj.values]
                    }
                };
                return Object.assign({
                    loading: false,
                    uId: obj.id,
                    // variableName: key,
                    ...parameterObject
                })
            }
        }).reverse();

        this.setState({
            loading: false,
            addedParameterElements,
            addedConstantElements,
        })
    };
    getMergeParameterTableDataFailure = (error) => {
        //console.log(error);
        this.setState({
            loading: false
        });
    };

    onEditParameterConstantBtnClick = (event) => {
        let parameterForm;
        const parameterUId = event.target.dataset.parameteruid;
        const parameterType = event.target.dataset.parametertype;
        if("parameter" === parameterType) {
            let addedParameterElements = this.state.addedParameterElements;
            for (let eIndex = 0; eIndex < addedParameterElements.length; eIndex++) {
                if (addedParameterElements[eIndex].uId === parameterUId) {
                    parameterForm = {...addedParameterElements[eIndex]};
                    break;
                }
            }
        } else {
            let addedConstantElements = this.state.addedConstantElements;
            for (let eIndex = 0; eIndex < addedConstantElements.length; eIndex++) {
                if (addedConstantElements[eIndex].uId == parameterUId) {
                    parameterForm = {...addedConstantElements[eIndex]};
                    parameterForm.remark = "";
                    parameterForm.currentValueOfParameter = "";
                    break;
                }
            }
        }
        this.props.history.push({
            pathname: '/NewMergedParameterFormUI',
            data: {
                parameterType,
                parameterForm,
            }
        });
    };

    onDuplicateParameterConstantBtnClick = (event) => {
        let parameterForm;
        let parameterUId = event.target.dataset.parameteruid;
        const parameterType = event.target.dataset.parametertype;
        if("parameter" === parameterType) {
            let addedParameterElements = this.state.addedParameterElements;
            for (let eIndex = 0; eIndex < addedParameterElements.length; eIndex++) {
                if (addedParameterElements[eIndex].uId === parameterUId) {
                    parameterForm = {...addedParameterElements[eIndex]};
                    parameterForm.uId = -1;
                    parameterForm.variableName = `copy ${parameterForm.variableName}`;
                    parameterUId = -1
                    break;
                }
            }
        } else {
            let addedConstantElements = this.state.addedConstantElements;
            for (let eIndex = 0; eIndex < addedConstantElements.length; eIndex++) {
                if (addedConstantElements[eIndex].uId == parameterUId) {
                    parameterForm = JSON.parse(JSON.stringify(addedConstantElements[eIndex]));
                    parameterForm.uId = -1;
                    parameterForm.variableName = `copy ${parameterForm.variableName}`;
                    break;
                }
            }
        }
        this.props.history.push({
            pathname: '/NewMergedParameterFormUI',
            data: {
                isDuplicate: true,
                parameterType,
                parameterForm
            }
        });
    };
    onDeleteParameterConstantBtnClick = (event) => {
        let parameterUId = event.target.dataset.parameteruid;
        this.setState({
            loading: true
        });
        const onCauseDeleteSuccess = this.onDeleteParameterConstantBtnSuccess(parameterUId);
        deleteParameter(onCauseDeleteSuccess, this.onDeleteParameterConstantBtnFailure, parameterUId)
    };

    onDeleteParameterConstantBtnSuccess = (parameterUId) => {
        return (resp) => {
            if (true === resp.data) {
                let addedParameterElements = [...this.state.addedParameterElements];
                addedParameterElements = addedParameterElements.filter((addedParameterElement) => parameterUId !== addedParameterElement.uId);
                // alert("delete successfule")
                this.setState({
                    loading: false,
                    addedParameterElements
                })
            } else {
                this.showAlert({
                    type: "error",
                    message: resp.data
                });
                this.setState({
                    loading: false
                })
            }
        };
    };

    onDeleteParameterConstantBtnFailure = () => {
        this.setState({
            loading: false
        })
    };


    /**
     * Parameters
     * **/
    getAllParametersAndRTDASMappingSuccess = (parameterResponse, RTDASMappingResponse, unitsResponse) => {
        const {
            activePage,
            data: parameterData,
            itemsCountPerPage,
            pageRangeDisplayed,
            totalItemsCount,
        } = {...parameterResponse.data};

        const parameterPagination = {...this.state.parameterPagination};
        parameterPagination.activePage = activePage;
        parameterPagination.itemsCountPerPage = itemsCountPerPage;
        parameterPagination.pageRangeDisplayed = pageRangeDisplayed;
        parameterPagination.totalItemsCount = totalItemsCount;

        const unitOptions = unitsResponse && unitsResponse.hasOwnProperty("data") && unitsResponse.data.units;
        const addedParameterElements = Object.entries(parameterData).map(([key, obj]) => {
            {
                const getSelectedRadioOption = (rangeObj) => {
                    return (
                        rangeObj.isRange ? "range"
                            : rangeObj.isSingleValue ? "singleValue"
                            : rangeObj.isCalculatedExpression ? "calculated" : "range"
                    );
                };

                const specifiedRangeObj = obj.specifiedRange;
                const normalRangeObj = obj.normalRange;
                const enumeratedValueObj = obj.enumeratedValue;

                const parameterObject = {
                    uId: key,
                    variableName: obj.name,
                    description: obj.description,
                    variableUnit: obj.unit,
                    machine: obj.machine,
                    informationSource: obj.informationSource,
                    type: obj.signalType,
                    precision: obj.precision,
                    rtdasMapping: obj.rtdasMapping,//todo
                    dataSource: obj.dataSource, //todo
                    specifiedRange: {
                        key: "specifiedRange",
                        isChecked: specifiedRangeObj.isSpecifiedRange,
                        selectedRadio: getSelectedRadioOption(specifiedRangeObj),
                        singleValue: specifiedRangeObj.singleValue.value,
                        from: specifiedRangeObj.range.from,
                        to: specifiedRangeObj.range.to,
                        operator: "",
                        calculatedExpression: specifiedRangeObj.calculatedExpression.expression
                    },
                    normalRange: {
                        key: "normalRange",
                        isChecked: normalRangeObj.isNormalRange,
                        selectedRadio: getSelectedRadioOption(normalRangeObj),
                        singleValue: normalRangeObj.singleValue.value,
                        from: normalRangeObj.range.from,
                        to: normalRangeObj.range.to,
                        operator: "",
                        calculatedExpression: normalRangeObj.calculatedExpression.expression
                    },
                    enumeratedValue: {
                        isChecked: enumeratedValueObj.isEnumeratedValue,
                        enumeratedValueId: -1,
                        currentValue: "",
                        selectedListValue: "",
                        list: ["-", ...enumeratedValueObj.values]
                    },
                    scale: obj.scale
                };
                return Object.assign({
                    uId: key,
                    variableName: obj.name,
                    ...parameterObject
                })
            }
        });
        let rtdasMappingOptions = RTDASMappingResponse ? Object.entries(RTDASMappingResponse.data.data).map(([key, obj]) => Object.assign({
            value: key,
            label: RTDASMappingResponse.data.data[key]
        })) : [];
        addedParameterElements.sort((a,b)=> {
            if(this.state.sortingOption.value === 'asc') {
                return (a.description > b.description) ? 1 : -1;
            } else {
                return  (a.description < b.description) ? 1 : -1
            }
        });
        this.setState({
            loading: false,
            addedParameterElements,
            rtdasMappingOptions,
            unitOptions,
            parameterPagination
        });
    };

    getAllParametersAndRTDASMappingFailure = (error) => {
        this.setState({
            loading: false
        });
    };

    onAddParameterBtnClick = () => {
        const parameterForm = JSON.parse(JSON.stringify(defaultParameterForm));
        this.props.history.push({
            pathname: '/NewParametersFormUI',
            data: {
                parameterForm
            }
        });
    };

    onEditParameterClick = (event) => {
        let parameterForm;
        const parameterUId = event.target.dataset.parameteruid;
        let addedParameterElements = this.state.addedParameterElements;
        for (let eIndex = 0; eIndex < addedParameterElements.length; eIndex++) {
            if (addedParameterElements[eIndex].uId === parameterUId) {
                parameterForm = {...addedParameterElements[eIndex]};
                break;
            }
        }
        // let parameterForm = {...[...addedElements][parameterUId]};
        /*this.setState({
            parameterForm,
            isEdit: true,
            isParameterFormAddDisable: false,
            parameterUId
        })*/
        this.props.history.push({
            pathname: '/NewParametersFormUI',
            data: {
                parameterForm
            }
        });
    };

    onDuplicateParameterClick = (event) => {
        let parameterForm;
        let parameterUId = event.target.dataset.parameteruid;
        let addedParameterElements = this.state.addedParameterElements;
        for (let eIndex = 0; eIndex < addedParameterElements.length; eIndex++) {
            if (addedParameterElements[eIndex].uId === parameterUId) {
                parameterForm = {...addedParameterElements[eIndex]};
                parameterForm.uId = -1;
                parameterForm.variableName = `copy ${parameterForm.variableName}`;
                parameterUId = -1
                break;
            }
        }
        // let parameterForm = {...[...addedElements][parameterUId]};
        /*this.setState({
            parameterForm,
            isEdit: true,
            isParameterFormAddDisable: false,
            parameterUId
        })*/
        this.props.history.push({
            pathname: '/NewParametersFormUI',
            data: {
                parameterForm
            }
        });
    };

    onDeleteParameterClick = (event) => {
        let parameterForm;
        let parameterUId = event.target.dataset.parameteruid;
        /*let addedParameterElements = this.state.addedParameterElements;
        for(let eIndex=0; eIndex< addedParameterElements.length; eIndex++) {
            if(addedParameterElements[eIndex].uId === parameterUId) {
                parameterForm = {...addedParameterElements[eIndex]};
                parameterForm.uId = -1;
                parameterForm.variableName = `copy ${parameterForm.variableName}`;
                parameterUId = -1
                break;
            }
        }*/
        this.setState({
            loading: true
        });
        const onCauseDeleteSuccess = this.onDeleteParameterSuccess(parameterUId);
        deleteParameter(onCauseDeleteSuccess, this.onDeleteParameterFailure, parameterUId)
    };

    onDeleteParameterSuccess = (parameterUId) => {
        return (resp) => {
            if (true === resp.data) {
                let addedParameterElements = [...this.state.addedParameterElements];
                addedParameterElements = addedParameterElements.filter((addedParameterElement) => parameterUId !== addedParameterElement.uId);
                // alert("delete successfule")
                this.setState({
                    loading: false,
                    addedParameterElements
                })
            } else {
                this.showAlert({
                    type: "error",
                    message: resp.data
                });
                this.setState({
                    loading: false
                })
            }
        };
    };

    onDeleteParameterFailure = () => {
        this.setState({
            loading: false
        })
    };

    /***
     * Constant
     * **/
    getAllConstantSuccess = (parameterResponse, unitsResponse, parameterSourceJsonResponse) => {
        const parameterSourceOptions = [];
        for (let psKey in parameterSourceJsonResponse.data) {
            parameterSourceOptions.push({
                value: psKey,
                label: parameterSourceJsonResponse.data[psKey].name
            })
        }
        const unitOptions = unitsResponse && unitsResponse.hasOwnProperty("data") && unitsResponse.data.units;
        const addedConstantElements = Object.entries(parameterResponse.data).map(([key, obj]) => {
            {
                const getSelectedRadioOption = (rangeObj) => {
                    return (
                        rangeObj.isRange ? "range"
                            : rangeObj.isSingleValue ? "singleValue"
                            : rangeObj.isCalculatedExpression ? "calculated" : "range"
                    );
                };

                const specifiedRangeObj = obj.specifiedRange;
                const normalRangeObj = obj.normalRange;
                const enumeratedValueObj = obj.enumeratedValue;

                let informationSource = {};
                for (let pIndex = 0; pIndex < parameterSourceOptions.length; pIndex++) {
                    /*todo
                    * need to change this key from precision to informationSource
                    * **/
                    if (obj.precision === parameterSourceOptions[pIndex].label) {
                        informationSource = {...parameterSourceOptions[pIndex]};
                        break
                    }
                }

                const parameterObject = {
                    uId: obj.id,
                    Id: obj.id,
                    variableName: obj.name,
                    description: obj.description,
                    variableUnit: obj.unit,
                    machine: obj.machine,
                    informationSource: informationSource,
                    type: obj.signalType,
                    precision: informationSource,//todo
                    rtdasMapping: obj.rtdasMapping,
                    dataSource: obj.dataSource,
                    remark: obj.remark,
                    currentValueOfParameter: obj.currentValueOfParameter,
                    durationUnit: obj.durationUnit,
                    duration: obj.duration,
                    specifiedRange: {
                        key: "specifiedRange",
                        isChecked: specifiedRangeObj.isSpecifiedRange,
                        selectedRadio: getSelectedRadioOption(specifiedRangeObj),
                        singleValue: specifiedRangeObj.singleValue.value,
                        from: specifiedRangeObj.range.from,
                        to: specifiedRangeObj.range.to,
                        operator: "",
                        calculatedExpression: specifiedRangeObj.calculatedExpression.expression
                    },
                    normalRange: {
                        key: "normalRange",
                        isChecked: normalRangeObj.isNormalRange,
                        selectedRadio: getSelectedRadioOption(normalRangeObj),
                        singleValue: normalRangeObj.singleValue.value,
                        from: normalRangeObj.range.from,
                        to: normalRangeObj.range.to,
                        operator: "",
                        calculatedExpression: normalRangeObj.calculatedExpression.expression
                    },
                    enumeratedValue: {
                        isChecked: enumeratedValueObj.isEnumeratedValue,
                        enumeratedValueId: -1,
                        currentValue: "",
                        selectedListValue: "",
                        list: ["-", ...enumeratedValueObj.values]
                    }
                };
                return Object.assign({
                    loading: false,
                    uId: obj.id,
                    // variableName: key,
                    ...parameterObject
                })
            }
        }).reverse();
        this.setState({
            loading: false,
            addedConstantElements,
            unitOptions,
            parameterSourceOptions
        });
    };

    getAllConstantFailure = (error) => {
        //console.log(error);
        this.setState({
            loading: false
        });
    };

    onAddNewConstantClick = () => {
        const parameterForm = JSON.parse(JSON.stringify(defaultConstantParameterForm));
        this.props.history.push({
            pathname: '/NewConstantParameterFormUI',
            data: {
                parameterForm
            }
        });
    };

    onEditConstantClick = (event) => {
        let parameterForm;
        const parameterUId = event.target.dataset.parameteruid;
        let addedConstantElements = this.state.addedConstantElements;
        for (let eIndex = 0; eIndex < addedConstantElements.length; eIndex++) {
            if (addedConstantElements[eIndex].uId == parameterUId) {
                parameterForm = {...addedConstantElements[eIndex]};
                parameterForm.remark = "";
                parameterForm.currentValueOfParameter = "";
                break;
            }
        }
        this.props.history.push({
            pathname: '/NewConstantParameterFormUI',
            data: {
                parameterForm
            }
        });
    };

    onDuplicateConstantClick = (event) => {
        let parameterForm;
        const parameterUId = event.target.dataset.parameteruid;
        let addedConstantElements = this.state.addedConstantElements;
        for (let eIndex = 0; eIndex < addedConstantElements.length; eIndex++) {
            if (addedConstantElements[eIndex].uId == parameterUId) {
                parameterForm = JSON.parse(JSON.stringify(addedConstantElements[eIndex]));
                parameterForm.uId = -1;
                parameterForm.variableName = `copy ${parameterForm.variableName}`;
                break;
            }
        }
        this.props.history.push({
            pathname: '/NewConstantParameterFormUI',
            data: {
                parameterForm
            }
        });
    };


    /***
     * Rule
     * **/
    onGetAllRuleConfigsSuccess = (ruleConfigResponse) => {
        const ruleConfigList = Object.entries(ruleConfigResponse.data).map(([key, obj]) => {
            {
                const getSelectedRadioOption = (conditionObject) => {
                    return (
                        conditionObject.isRange ? "range"
                            : conditionObject.isSingleValue ? "singleValue"
                            : conditionObject.isCalculatedExpression ? "calculated"
                                : "range"
                    );
                };
                const selectedParameters = {
                    "value": obj.parameterId,
                    "label": obj.parameterId
                };
                const conditionObject = obj.condition;
                const ruleConfigObject = {
                    ruleConfigId: key,
                    ruleConfigName: obj.ruleName,
                    ruleConfigDescription: obj.description,
                    selectedParameters,
                    conditionDropdown: "",
                    conditionRadio: getSelectedRadioOption(conditionObject),
                    singleValue: conditionObject.singleValue.value,
                    singleValueCondition: conditionObject.singleValue.valueOperator,
                    from: conditionObject.range.from,
                    fromCondition: conditionObject.range.fromOperator,
                    to: conditionObject.range.to,
                    toCondition: conditionObject.range.toOperator,
                    calculatedExpression: conditionObject.calculatedExpression.expression,
                    enumeratedValue: {
                        isChecked: obj.hasOwnProperty("enumeratedValue") && obj.enumeratedValue.isEnumeratedValue,
                        enumeratedValueId: -1,
                        currentValue: "",
                        selectedListValue: "",
                        list: obj.hasOwnProperty("enumeratedValue") && ["-", ...obj.enumeratedValue.values]
                    }
                };
                return Object.assign({
                    uId: key,
                    ...ruleConfigObject
                })
            }
        });
        this.setState({
            ruleConfigList,
            loading: false
        })
    };
    onGetAllRuleConfigsFailure = (error) => {
        //console.log(error);
        this.setState({
            loading: false
        })
    };

    onGetAllRuleChainSuccess = (response) => {
        const ruleChainList = Object.entries(response.data).map(([key, obj]) => {
            {
                let ruleConfigs = [];
                // const ruleConfigs = obj.rules;
                // const rules = obj.rules;
                /*for(let rIndex=0; rIndex<rules.length; rIndex++) {
                    const currentValue = rules[rIndex];
                    ruleConfigs.push({
                        value: currentValue,
                        label: currentValue
                    })
                }*/
                // console.log(this.state.ruleConfigList);
                const ruleConfigList = this.state.ruleConfigList;
                for (let rcIndex = 0; rcIndex < ruleConfigList.length; rcIndex++) {
                    const currentConfig = ruleConfigList[rcIndex];
                    if (obj.rules.indexOf(currentConfig.uId) > -1) {
                        ruleConfigs.push({
                            value: currentConfig.uId,
                            label: currentConfig.ruleConfigName,
                            description: currentConfig.ruleConfigDescription
                        })
                    }
                    if (obj.rules.length === ruleConfigs.length) {
                        break;
                    }
                }


                const periodicity = obj.evaluationMethod.periodicity;
                const noOfOccurrences = obj.evaluationMethod.noOfOccurrences;
                const isEvaluationFactorChecked = obj.hasOwnProperty('evaluationFactor') ? obj.evaluationFactor.isEvaluationFactorChecked : false;
                const ruleChainObject = {
                    isActivate: true,
                    ruleChainId: key,
                    ruleChainName: obj.name,
                    ruleChainDescription: obj.description,
                    "ruleConfig": "",
                    frequency: periodicity.value,
                    frequencyUnit: periodicity.unit,
                    isNumberOfOccurrencesChecked: noOfOccurrences.isChecked,
                    numberOfOccurrences: noOfOccurrences.value,
                    ruleConfigs,
                    isEvaluationFactorChecked,
                    evaluationFactorValue: !isEvaluationFactorChecked ? "" : obj.evaluationFactor.value,
                    evaluationFactorUnit: !isEvaluationFactorChecked ? "Probability" : obj.evaluationFactor.type
                };

                return Object.assign({
                    uId: key,
                    ...ruleChainObject
                })
            }
        }).reverse();
        ruleChainList.sort((a,b)=>(a.ruleChainName > b.ruleChainName) ? 1:-1);

        this.setState({
            ruleChainList,
            loading: false
        })
    };
    onGetAllRuleChainFailure = (error) => {
        //console.log(error);
        this.setState({
            loading: false
        })
    };

    getRuleChainTableDataSuccess = (ruleConfigResponse, ruleChainResponse) => {
        const {
            activePage,
            data: ruleChainData,
            itemsCountPerPage,
            pageRangeDisplayed,
            totalItemsCount,
        } = {...ruleChainResponse.data};

        const ruleChainPagination = {...this.state.ruleChainPagination};
        ruleChainPagination.activePage = activePage;
        ruleChainPagination.itemsCountPerPage = itemsCountPerPage;
        ruleChainPagination.pageRangeDisplayed = pageRangeDisplayed;
        ruleChainPagination.totalItemsCount = totalItemsCount;

        const ruleConfigList = Object.entries(ruleConfigResponse.data).map(([key, obj]) => {
            {
                const getSelectedRadioOption = (conditionObject) => {
                    return (
                        conditionObject.isRange ? "range"
                            : conditionObject.isSingleValue ? "singleValue"
                            : conditionObject.isCalculatedExpression ? "calculated"
                                : "range"
                    );
                };
                const selectedParameters = {
                    "value": obj.parameterId,
                    "label": obj.parameterId
                };
                const conditionObject = obj.condition;
                const ruleConfigObject = {
                    ruleConfigId: obj.id.toString(),
                    ruleConfigName: obj.ruleName,
                    ruleConfigDescription: obj.description,
                    selectedParameters,
                    conditionDropdown: "",
                    conditionRadio: getSelectedRadioOption(conditionObject),
                    singleValue: conditionObject.singleValue.value,
                    singleValueCondition: conditionObject.singleValue.valueOperator,
                    from: conditionObject.range.from,
                    fromCondition: conditionObject.range.fromOperator,
                    to: conditionObject.range.to,
                    toCondition: conditionObject.range.toOperator,
                    calculatedExpression: conditionObject.calculatedExpression.expression,
                    enumeratedValue: {
                        isChecked: obj.hasOwnProperty("enumeratedValue") && obj.enumeratedValue.isEnumeratedValue,
                        enumeratedValueId: -1,
                        currentValue: "",
                        selectedListValue: "",
                        list: obj.hasOwnProperty("enumeratedValue") && ["-", ...obj.enumeratedValue.values]
                    }
                };
                return Object.assign({
                    uId: ruleConfigObject.ruleConfigId.toString(),
                    ...ruleConfigObject
                })
            }
        });
        const ruleChainList = Object.entries(ruleChainData).map(([key, obj]) => {
            {
                let ruleConfigs = [];
                for (let rcIndex = 0; rcIndex < ruleConfigList.length; rcIndex++) {
                    const currentConfig = ruleConfigList[rcIndex];
                    if (obj.rules.indexOf(currentConfig.uId) > -1) {
                        ruleConfigs.push({
                            value: currentConfig.uId,
                            label: currentConfig.ruleConfigName,
                            description: currentConfig.ruleConfigDescription
                        })
                    }
                    if (obj.rules.length === ruleConfigs.length) {
                        break;
                    }
                }


                const periodicity = obj.evaluationMethod.periodicity;
                const noOfOccurrences = obj.evaluationMethod.noOfOccurrences;
                const isEvaluationFactorChecked = obj.hasOwnProperty('evaluationFactor') ? obj.evaluationFactor.isEvaluationFactorChecked : false;
                const ruleChainObject = {
                    isActivated: obj.isActivated,
                    ruleChainId: key,
                    ruleChainName: obj.name,
                    ruleChainDescription: obj.description,
                    "ruleConfig": "",
                    frequency: periodicity.value,
                    frequencyUnit: periodicity.unit,
                    isNumberOfOccurrencesChecked: noOfOccurrences.isChecked,
                    numberOfOccurrences: noOfOccurrences.value,
                    ruleConfigs,
                    isEvaluationFactorChecked,
                    evaluationFactorValue: !isEvaluationFactorChecked ? "" : obj.evaluationFactor.value,
                    evaluationFactorUnit: !isEvaluationFactorChecked ? "Probability" : obj.evaluationFactor.type
                };

                return Object.assign({
                    uId: key,
                    ...ruleChainObject
                })
            }
        });

        ruleChainList.sort((a, b) => {
            if (this.state.sortingOption.value === 'asc') {
                return (a.ruleChainName > b.ruleChainName) ? 1 : -1
            } else {
                return (a.ruleChainName < b.ruleChainName) ? 1 : -1;
            }
        });

        this.setState({
            ruleChainList,
            ruleChainPagination,
            loading: false
        })
    };
    getRuleChainTableDataFailure = (error) => {
       // console.log(error);
        this.setState({
            loading: false
        })
    };

    onAddNewRuleChainClick = () => {
        const ruleChainForm = JSON.parse(JSON.stringify(defaultRuleChainForm));
        this.props.history.push({
            pathname: '/NewRuleChainFormUI',
            data: {
                ruleChainForm
            }
        });
    };

    onEditRuleChainClick = (event) => {
        const ruleChainId = event.target.dataset.rulechainid;
        const ruleChainList = [...this.state.ruleChainList];
        let ruleChainForm = {};
        for (let rbIndex = 0; rbIndex < ruleChainList.length; rbIndex++) {
            const ruleChainItem = ruleChainList[rbIndex];
            if (ruleChainId === ruleChainItem.ruleChainId) {
                ruleChainForm = ruleChainList[rbIndex];
                break;
            }
        }

        this.props.history.push({
            pathname: '/NewRuleChainFormUI',
            data: {
                ruleChainForm
            }
        });
    };

    onRuleChainItemDuplicate = (event) => {
        const ruleChainId = event.target.dataset.rulechainid;
        const ruleChainList = [...this.state.ruleChainList];
        let ruleChainForm = {};
        for (let rbIndex = 0; rbIndex < ruleChainList.length; rbIndex++) {
            const ruleChainItem = ruleChainList[rbIndex];
            if (ruleChainId === ruleChainItem.ruleChainId) {
                ruleChainForm = JSON.parse(JSON.stringify(ruleChainList[rbIndex]));
                ruleChainForm.uId = -1;
                ruleChainForm.ruleChainId = -1;
                ruleChainForm.ruleChainName = "copy " + ruleChainForm.ruleChainName;
                break;
            }
        }

        this.props.history.push({
            pathname: '/NewRuleChainFormUI',
            data: {
                ruleChainForm
            }
        });
    };
    onActivateDeactivateRuleChainClick = (event) => {
        let payload;
        const ruleChainId = event.target.dataset.rulechainid;
        const ruleChainList = [...this.state.ruleChainList];
        for (let rbIndex = 0; rbIndex < ruleChainList.length; rbIndex++) {
            const ruleChainItem = ruleChainList[rbIndex];
            if (ruleChainId === ruleChainItem.ruleChainId) {
                ruleChainList[rbIndex] = {
                    ...ruleChainList[rbIndex],
                    isActivated: !ruleChainList[rbIndex].isActivated
                };
                this.setState({loading:true});
                payload = {
                    [ruleChainItem.ruleChainId]: {isActivated: ruleChainList[rbIndex].isActivated},
                    ["ActivationState"]: true
                };

                break;
            }
        }
        this.setState({
            ruleChainList
        });
        updateRuleChain(this.onUpdateRuleChainSuccess, this.onUpdateRuleChainFailure, payload)
    };

    onUpdateRuleChainSuccess = (res) => {
        if (res.status === 200 ) {
            this.props.history.push({
                pathname: '/MonitorPolicies',
                data: {
                    type: "cause"
                }
            });
            this.setState({loading:false});
        }
    };

    onUpdateRuleChainFailure = (err) => {
        //console.log(err);
        this.setState({
            loading: false
        })
    };

    onRuleChainItemDeleteClick = (event) => {
        const ruleChainId = event.target.dataset.rulechainid;
        this.setState({
            loading: true
        });
        const onCauseDeleteSuccess = this.onRuleChainItemDeleteSuccess(ruleChainId);
        deleteRuleBlock(onCauseDeleteSuccess, this.onRuleChainItemDeleteFailure, ruleChainId)
    };

    onRuleChainItemDeleteSuccess = (ruleChainId) => {
        return (resp) => {
            if (true === resp.data) {
                let ruleChainList = [...this.state.ruleChainList];
                ruleChainList = ruleChainList.filter((ruleChainItem) => ruleChainId !== ruleChainItem.ruleChainId);
                // alert("delete successfule")
                this.setState({
                    loading: false,
                    ruleChainList
                })
            } else {
                this.showAlert({
                    type: "error",
                    message: resp.data
                });
                this.setState({
                    loading: false
                })
            }
        };
    };

    onRuleChainItemDeleteFailure = () => {
        this.setState({
            loading: false
        })
    };

    /***
     * RTDAS
     * ***/
    onGetAllRTDASRegsSuccess = (resp) => {
        const rtdasListFromServer = resp.data.data;
        let rtdasList = [];
        if (rtdasListFromServer) {
            let rtdasListItem = {};
            for (let clKey in rtdasListFromServer) {
               // console.log(rtdasListFromServer[clKey]);
                const currentrtdasListItem = rtdasListFromServer[clKey];
                const connectionId = clKey;
                const type = currentrtdasListItem.type;
                if ("JSON" === type) {
                    rtdasListItem = {
                        ...{
                            ...currentrtdasListItem,
                            connectionId
                        }
                    };
                } else if ("DB" === type) {
                    let tableNames = [];
                    const dbObject = currentrtdasListItem.dbObject;
                    for (let innerIndex = 0; innerIndex < dbObject.table_name.length; innerIndex++) {
                        let table = {
                            value: dbObject.table_name[innerIndex].value,
                            label: dbObject.table_name[innerIndex].value
                        };
                        tableNames.push(table);
                    }
                    rtdasListItem = {
                        connectionId,
                        type: "DB",
                        dbObject: {
                            connectionId: dbObject.id,
                            rtdasName: dbObject.rtdas_name,
                            rtdasDescription: dbObject.description,
                            databaseType: dbObject.db_type,
                            dataBaseName: dbObject.db_name,
                            host: dbObject.host,
                            port: dbObject.port,
                            username: dbObject.user_name,
                            password: dbObject.password,
                            selectedTable: tableNames
                        }
                    }
                }
                rtdasList.unshift(rtdasListItem);
            }
        }
        this.setState({
            loading: false,
            rtdasList
        })
    };

    onGetAllRTDASRegsFailure = (resp) => {
        this.setState({
            loading: false
        })
    };

    onConnectionItemEdit = (event) => {
        let selectedDbJsonTab = "DB";
        const connectionId = event.target.dataset.connectionid;
        const rtdasList = [...this.state.rtdasList];
        let connectionForm = JSON.parse(JSON.stringify(defaultConnectionForm));
        let jsonForm = JSON.parse(JSON.stringify(defaultJsonForm));
        for (let rbIndex = 0; rbIndex < rtdasList.length; rbIndex++) {
            const connectionItem = rtdasList[rbIndex];
            if (connectionId === connectionItem.connectionId) {
                const type = connectionItem.type;
                if ("DB" === type) {
                    const dbObject = JSON.parse(JSON.stringify(connectionItem.dbObject));
                    selectedDbJsonTab = type;
                    connectionForm = {
                        connectionId: connectionItem.connectionId,
                        ...dbObject
                    };
                } else if ("JSON" === type) {
                    const jsonObject = JSON.parse(JSON.stringify(connectionItem.jsonObject));
                    selectedDbJsonTab = type;
                    jsonForm = {
                        connectionId: connectionItem.connectionId,
                        fileStreamRadio: connectionItem.jsonObject.type.toLocaleLowerCase(),
                        ...jsonObject
                    };
                }
                break;
            }
        }

        /*this.setState({
            selectedDbJsonTab,
            connectionForm,
            jsonForm
        })*/
        this.props.history.push({
            pathname: '/NewRTDASFormUI',
            data: {
                selectedDbJsonTab,
                connectionForm,
                jsonForm
            }
        });
    };

    onAddNewConnectionClick = () => {
        const connectionForm = JSON.parse(JSON.stringify(defaultConnectionForm));
        const jsonForm = JSON.parse(JSON.stringify(defaultJsonForm));
        this.props.history.push({
            pathname: '/NewRTDASFormUI',
            data: {
                connectionForm,
                jsonForm
            }
        });
    };

    onConnectionItemDuplicate = (event) => {
        let selectedDbJsonTab = "DB";
        const connectionId = event.target.dataset.connectionid;
        const rtdasList = [...this.state.rtdasList];
        let connectionForm = JSON.parse(JSON.stringify(defaultConnectionForm));
        let jsonForm = JSON.parse(JSON.stringify(defaultJsonForm));
        for (let rbIndex = 0; rbIndex < rtdasList.length; rbIndex++) {
            const connectionItem = rtdasList[rbIndex];
            if (connectionId === connectionItem.connectionId) {
                const type = connectionItem.type;
                if ("DB" === type) {
                    const dbObject = JSON.parse(JSON.stringify(connectionItem.dbObject));
                    dbObject.rtdasName = `copy ${dbObject.rtdasName}`;
                    selectedDbJsonTab = type;
                    connectionForm = {
                        connectionId: "-1",
                        ...dbObject
                    };
                } else if ("JSON" === type) {
                    const jsonObject = JSON.parse(JSON.stringify(connectionItem.jsonObject));
                    selectedDbJsonTab = type;
                    if ("FILE" === jsonObject.type) {
                        jsonObject.fileObject.jsonName = `copy ${jsonObject.fileObject.jsonName}`;
                    } else if ("STREAM" === jsonObject.type) {
                        jsonObject.streamObject.jsonName = `copy ${jsonObject.streamObject.jsonName}`;
                    }
                    jsonForm = {
                        connectionId: "-1",
                        fileStreamRadio: connectionItem.jsonObject.type.toLocaleLowerCase(),
                        ...jsonObject
                    };
                }
                break;
            }
        }
        this.props.history.push({
            pathname: '/NewRTDASFormUI',
            data: {
                isDuplicate: true,
                selectedDbJsonTab,
                connectionForm,
                jsonForm
            }
        });
    };

    /**
     * Calculated Expression
     * ****/
    getAllParametersOnlyNamesSuccess = (parametersOnlyNamesResponse, calculatedExpressionResponse) => {
        const parametersObj = parametersOnlyNamesResponse.data;
        const calculatedExpressionObj = calculatedExpressionResponse.data;
        let calcExpressionList = [];
        for (let ceKey in calculatedExpressionObj) {
            const calculatedExpressionItem = calculatedExpressionObj[ceKey];
            calcExpressionList.unshift({
                uId: ceKey,
                name: calculatedExpressionItem.name,
                description: calculatedExpressionItem.description,
                expression: calculatedExpressionItem.expression,
            })
        }

        this.setState({
            loading: false,
            calcExpressionList
        })
    };
    getAllParametersOnlyNamesFauilure = (error) => {
        //console.log(error);
        this.setState({
            loading: false
        })
    };

    onAddNewCalculatedExpressionClick = () => {
        let calculatedExpressionForm = JSON.parse(JSON.stringify(defaultCalculatedExpressionForm));
        this.props.history.push({
            pathname: '/NewCalculatedExpressionFormUI',
            data: {
                calculatedExpressionForm
            }
        });
    };
    onEditCalculatedExpressionClick = (event) => {
        let calculatedExpressionForm = {};
        let calcExpressionList = [...this.state.calcExpressionList];
        const currentUid = event.target.dataset.uid;
        for (let eIndex = 0; eIndex < calcExpressionList.length; eIndex++) {
            if (currentUid === calcExpressionList[eIndex].uId) {
                calculatedExpressionForm = {...calcExpressionList[eIndex]};
                break;
            }
        }
        this.props.history.push({
            pathname: '/NewCalculatedExpressionFormUI',
            data: {
                calculatedExpressionForm
            }
        });
    };

    onDuplicateCalculatedExpressionClick = (event) => {
        let calculatedExpressionForm = {};
        let calcExpressionList = [...this.state.calcExpressionList];
        let currentUid = event.target.dataset.uid;
        for (let eIndex = 0; eIndex < calcExpressionList.length; eIndex++) {
            if (currentUid === calcExpressionList[eIndex].uId) {
                calculatedExpressionForm = {...calcExpressionList[eIndex]};
                calculatedExpressionForm.uId = -1;
                calculatedExpressionForm.name = `copy ${calculatedExpressionForm.name}`;
                break;
            }
        }
        this.props.history.push({
            pathname: '/NewCalculatedExpressionFormUI',
            data: {
                calculatedExpressionForm
            }
        });
    };

    /**
     * Monitor Policies functions
     * */
    onAllCollapseButtonClick = (eventKey) => {
        const isAllAccordionCollapse = !this.state.isAllAccordionCollapse;
        if (isAllAccordionCollapse) {
            window.collapseAllAccordions();
        } else {
            window.expandAllAccordions();
        }
        this.setState({
            isAllAccordionCollapse
        })
    };

    getParameterList = (activePage) => {
        activePage = activePage ? activePage : 1;
        this.setState({
            loading: true
        });
        const vesselName = getItemFromLocalStorage("ssAppvesselValue");
        const searchArr = this.state.searchByName ? [
            {
                searchKey: "description",
                searchValue: this.state.searchByName
            }
        ] : [];
        getAllParametersByShipAndRTDASMapping(
            this.getAllParametersAndRTDASMappingSuccess,
            this.getAllParametersAndRTDASMappingFailure,
            {
                vesselName,
                activePage,
                sortBy: this.state.sortingOption.value,
                searchByName: this.state.searchByName,
                searchArr,
                searchMachineArr: this.state.machineName
            }
        );
    };

    getRuleChainList = (activePage) => {
        activePage = activePage ? activePage : 1;
        this.setState({
            loading: true
        });
        const vesselName = getItemFromLocalStorage("ssAppvesselValue");
        const searchArr = this.state.searchByName ? [
                {
                    searchKey: "name",
                    searchValue: this.state.searchByName
                }
            ] : [];
        getRuleChainTableDataByShip(this.getRuleChainTableDataSuccess, this.getRuleChainTableDataFailure,
            {
                vesselName,
                activePage,
                sortBy: this.state.sortingOption.value,
                searchArr
            });
    };

    getCauseList = (activePage) => {
        activePage = activePage ? activePage : 1;

        this.setState({
            loading: true
        });
        const vesselName = getItemFromLocalStorage("ssAppvesselValue");
        const searchArr = this.state.searchByName ? [
            {
                searchKey: "name",
                searchValue: this.state.searchByName
            }
        ] : [];
        getAllCausesByShip(this.onGetAllElementsSuccess, this.onGetAllElementsFailure,
            {
                vesselName,
                activePage,
                sortBy: this.state.sortingOption.value,
                searchArr
            });
    };

    getLastWidgetMappingFile = () => {
        this.setState({
            loading: true
        });
        const vesselName = getItemFromLocalStorage("ssAppvesselValue");
        getLastWidgetFile(this.onGetLastWidgetFileSuccess, this.onGetLastWidgetFileFailure,vesselName);
    };

    onGetLastWidgetFileSuccess = (res) => {
        const widgetdata = res.data;
        this.setState({
            lastwidgetMappingFile: widgetdata,
            loading: false,
        });
    };

    onGetLastWidgetFileFailure = () => {
        this.setState({
            loading: false
        });
    };

    getAdvisoryList = (activePage) => {
        activePage = activePage ? activePage : 1;
        this.setState({
            loading: true
        });
        const vesselName = getItemFromLocalStorage("ssAppvesselValue");
        const searchArr = this.state.searchByName ? [
            {
                searchKey: "name",
                searchValue: this.state.searchByName
            }
        ] : [];
        getAllFailureAdvisoriesByShip(this.onGetAllAdvisoryElementsSuccess, this.onGetAllAdvisoryElementsFailure,{
            vesselName,
            activePage,
            sortBy: this.state.sortingOption.value,
            searchArr
        });
    };

    getLastRuleCsvFile = () => {

        this.setState({
            loading: true
        });
        const vesselName = getItemFromLocalStorage("ssAppvesselValue");
        getLastRuleFile(this.onGetLastRuleSuccess, this.onGetLastRuleFileFailure,vesselName);
    };

    onGetLastRuleSuccess = (res) => {

        const ruledata = res.data;
        this.setState({
            lastRuleFile: ruledata,
            loading: false,
        });
    };

    onGetLastRuleFileFailure = () => {
        this.setState({
            loading: false
        });
    };

    getLastParameterCsvFile = () => {

        this.setState({
            loading: true
        });
        const vesselName = getItemFromLocalStorage("ssAppvesselValue");
        getLastParameterFile(this.onGetLastParameterSuccess, this.onGetLastParameterFileFailure,vesselName);
    };

    onGetLastParameterSuccess = (res) => {

        const parameterdata = res.data;
        this.setState({
            lastParameterFile: parameterdata,
            loading: false,
        });
    };

    onGetLastParameterFileFailure = () => {
        this.setState({
            loading: false
        });
    };

    getOutcomeList = (activePage) => {
        activePage = activePage ? activePage : 1;
        this.setState({
            loading: true
        });
        const vesselName = getItemFromLocalStorage("ssAppvesselValue");
        const searchArr = this.state.searchByName ? [
            {
                searchKey: "failureAdvisory",
                searchValue: this.state.searchByName
            }
        ] : [];
        getRuleConfigAllDataByShip(this.getAllConfigData, this.getAllConfigDataFailed, {
            vesselName,
            activePage,
            sortBy: this.state.sortingOption.value,
            searchArr
        });
    };

    onToggleAccordion = (event) => {
        const accordionName = event.target.dataset.key;
        let {
            accordions,
            lastRuleFile,
            lastParameterFile,
            addedParameterElements,
            lastwidgetMappingFile
        } = this.state;
        accordions[accordionName] = !accordions[accordionName];
        if (accordions[accordionName]) {
            if("upload_widget_acc" === accordionName){
                if (!lastwidgetMappingFile) {
                    this.getLastWidgetMappingFile();
                }
            }else if("uploadcsv_acc" === accordionName){
                // if (!lastRuleFile) {
                //     this.getLastRuleCsvFile();
                // }
            }else if ("cause_acc" === accordionName) {
                if (!this.state.addedCauseElements) {
                    this.getCauseList();
                }
            } else if ("merged_param_constant_acc" === accordionName) {
                if (!addedParameterElements) {
                    this.setState({
                        loading: true
                    });
                    getMergeParameterTableData(this.getMergeParameterTableDataSuccess, this.getMergeParameterTableDataFailure);
                }
            } else if ("parameter_acc" === accordionName) {
                if (!addedParameterElements) {
                    this.getParameterList();
                }
            } else if ("constant_acc" === accordionName) {
                {/*TODO : Enable This after implementing Constant*/}
                // if (!this.state.addedConstantElements) {
                //     this.setState({
                //         loading: true
                //     });
                //     getAllConstantParameters(this.getAllConstantSuccess, this.getAllConstantFailure);
                // }
            } else if ("advisory_acc" === accordionName) {
                if (!this.state.addedAdvisoryElements) {
                    this.getAdvisoryList();
                }
            } else if ("outcome_acc" === accordionName) {
                if (!this.state.configListForOutcome) {
                    this.getOutcomeList();
                }
            } else if ("rule_acc" === accordionName) {
                if (!this.state.ruleChainList) {
                    this.getRuleChainList()
                }
            } else if ("rtdas_acc" === accordionName) {
                if (!lastParameterFile) {
                    this.getLastParameterCsvFile();
                }
            } else if ("calc_expr_acc" === accordionName) {
                {/*TODO : Enable This after implementing Calculated Expression*/}
                // if (!this.state.calcExpressionList) {
                //     this.setState({
                //         loading: true
                //     });
                //     getParameterTableData(this.getAllParametersOnlyNamesSuccess, this.getAllParametersOnlyNamesFauilure)
                // }
            }
        }
        this.setState({
            accordions
        });
    };
    accordionIcon = (isAccordionOpen,accordianKey) => {
        const expandIcon = expandedArrow;
        const collapseIcon = collapseArrow;
        const accIcon = isAccordionOpen ? collapseIcon : expandIcon;
        return <img
            alt=""
            width={24}
            src={accIcon}
            data-key={accordianKey}
        />
    };

    selectCsvFile = (event) => {
        const dataset = event.target.dataset;
        const key = dataset.key;
        const  csvFileData = {
            data: event.target.files[0]
        };
        if(key==='uploadcsvFile'){
            this.setState({
                csvFile : csvFileData
            })
        }
        if(key==="uploadcsvFileOfWidget"){
            this.setState({
                widgetCsvFile : csvFileData
            })
        }
    }

    onUploadCsvClick = () => {
        const isAllAccordionCollapse = this.state.isAllAccordionCollapse;
        if (isAllAccordionCollapse) {
            window.collapseAllAccordions();
        } else {
            window.expandAllAccordions();
        }
        this.setState({
            isAllAccordionCollapse
        })
        let csvFile = {...this.state.csvFile};
        const formData = this.createFileObject(csvFile);
        this.setState({
            loading:true
        })
        createRuleUsingCsv(this.uploadCsvSuccess, this.uploadCsvFail, formData);
    }

    onWidgetCsvFileUploadClick = () => {

        const isAllAccordionCollapse = this.state.isAllAccordionCollapse;
        if (isAllAccordionCollapse) {
            window.collapseAllAccordions();
        } else {
            window.expandAllAccordions();
        }
        this.setState({
            isAllAccordionCollapse
        })
        let widgetCsvFileData = {...this.state.widgetCsvFile};
        const formData = this.createFileObject(widgetCsvFileData);
        this.setState({
            loading:true
        })

        uploadWidgetFile(this.uploadWidgetFileSuccess, this.uploadWidgetFileFailure, formData);
    }

    uploadWidgetFileSuccess = (response) => {

        if(response.data){
            this.setState({
                loading:false
            })
            this.showAlert({
                type: "success",
                message: response.data
            });
        }
    }

    uploadWidgetFileFailure = () => {this.setState({
        loading:false
    })
    }

    uploadCsvSuccess = (response) => {
        if(response.data){
            this.setState({
                loading:false
            })
            this.showAlert({
                type: "success",
                message: response.data
            });
        }
    }

    uploadCsvFail = () => {this.setState({
        loading:false
    })
    //console.log("Failed to create rule using csv")
    }

    createFileObject = (csvFile) => {
        let formData = new FormData();
        formData.append('file', csvFile.data);
        return formData;
    };

    getAllShipsAndMachinesSuccess = (response) => {
        const {
            shipArr: shipNameData,
            machineArr
        } = response.data;

        let defaultIndex = 0;

        let shipNameDataLabel, shipNameDataValue;

        if (shipNameData && shipNameData.length > 0) {
            for (let i = 0; i < shipNameData.length; i++) {
                if (shipNameData[i].value === "nova-china-express") {  // for demo we have to keep china express as default in dropdown
                    defaultIndex = i;
                    if(defaultIndex)
                    {
                        getUserByShipId(shipNameData[i].vesselId,this.getAllUserSuccess,this.getAllUserFailure);//set default ship users
                    } 
                }
            }
            shipNameDataLabel = shipNameData[defaultIndex].label;
            shipNameDataValue = shipNameData[defaultIndex].value;

        }


        if (shipNameData && shipNameData.length > 0) {
            if (!getVesselName()) {
                setItemInLocalStorage("ssAppvesselLabel", shipNameDataLabel);
                setItemInLocalStorage("ssAppvesselValue", shipNameDataValue);
                this.setState({
                    machineArr,
                    shipList: shipNameData,
                    vesselLabel: shipNameDataLabel,
                    vesselValue: shipNameDataValue,
                    loading: false
                });
            } else {
                this.setState({
                    machineArr,
                    shipList: shipNameData,
                    vesselLabel: getItemFromLocalStorage("ssAppvesselLabel"),
                    vesselValue: getItemFromLocalStorage("ssAppvesselValue"),
                    loading: false
                });
            }
        }
        // const vesselName = this.state.vesselValue;
        // getAllFailureAdvisoriesByShip(this.onGetAllAdvisoryElementsSuccess, this.onGetAllAdvisoryElementsFailure, vesselName);
    };

    getAllShipsAndMachinesFail = () => {
        this.setState({
            loading: false
        })
    }

    onVesselChange = (e) => {
        const vesselValue = e.value;
        const vesselLabel = e.label;

        this.setState({
            vesselLabel: vesselLabel,
            vesselValue: vesselValue,
        });

        setItemInLocalStorage("ssAppvesselLabel", vesselLabel);
        setItemInLocalStorage("ssAppvesselValue", vesselValue);
        // window.location.reload(false);
        if(e.vesselId)
        {
            getUserByShipId(e.vesselId,this.getAllUserSuccess,this.getAllUserFailure);
        } 
    }

    onDropdownmachineValueChange = (selectedValue) => {
        let selectedValueArr = [];
        {
            if(!(selectedValue==null)){
                for(let i=0;i<selectedValue.length;i++){
                    selectedValueArr.push(selectedValue[i].label);
                }
            }
        }
        this.setState({
            machineName:selectedValueArr
        })
    };

    onSearchByNameValueChange = (e) => {
        this.setState({
            searchByName: e.target.value
        });
    }

    onApplyFilter = () => {
        const allAccordions = this.state.accordions;
        const allOpenAccordionsKeys = Object.keys(allAccordions).filter((item) => allAccordions[item]);
        this.setState({
            isAllAccordionCollapse: true,
            lastwidgetMappingFile: null,
            addedParameterElements: null,
            ruleChainList: null,
            addedCauseElements: null,
            addedAdvisoryElements: null,
            configListForOutcome: null,
            rtdasList: null,//??
            lastRuleFile:null,
            lastParameterFile:null
        }, () => {
            for(let oKeyIndex=0; oKeyIndex < allOpenAccordionsKeys.length; oKeyIndex++) {
                const accordionName = allOpenAccordionsKeys[oKeyIndex];
                this.getDataForAccordion(accordionName);
            }
        })
    }

    getDataForAccordion = (accordionName) => {
        let {
            lastRuleFile,
            lastParameterFile,
            addedParameterElements,
            addedCauseElements,
            addedAdvisoryElements,
            configListForOutcome,
            ruleChainList,
            lastwidgetMappingFile
        } = this.state;

        this.setState({
            loading: true
        });

        if ("cause_acc" === accordionName) {
            if (!addedCauseElements) {
                this.getCauseList();
            }
        } else if ("parameter_acc" === accordionName) {
            if (!addedParameterElements) {
                this.getParameterList();
            }
        }
        if ("advisory_acc" === accordionName) {
            if (!addedAdvisoryElements) {
                this.getAdvisoryList();
            }
        } else if ("outcome_acc" === accordionName) {
            if (!configListForOutcome) {
                this.getOutcomeList();
            }
        }else if ("uploadcsv_acc" === accordionName) {
            if (!lastRuleFile) {
                this.getLastRuleCsvFile();
            }
        } else if ("rtdas_acc" === accordionName) {
            if (!lastParameterFile) {
                this.getLastParameterCsvFile();
            }
        } else if ("rule_acc" === accordionName) {
            if (!ruleChainList) {
                this.getRuleChainList()
            }
        } else if ("upload_widget_acc" === accordionName) {
            if (!lastwidgetMappingFile) {
                this.getLastWidgetMappingFile();
            }
        }
    }

    onSortDropdownValueChange = (selectedSort) => {
        this.setState({sortingOption: selectedSort})
    }

    /**
     * Pagination
     * **/

    onPageChange = (paginationFor, activePage) => {
        switch (paginationFor) {
            case "parameter":
                const parameterPagination = {...this.state.parameterPagination};
                parameterPagination.activePage = activePage;
                this.setState({parameterPagination}, () => this.getParameterList(activePage));
                break;
            case "rule":
                const ruleChainPagination = {...this.state.ruleChainPagination};
                ruleChainPagination.activePage = activePage;
                this.setState({ruleChainPagination}, () => this.getRuleChainList(activePage));
                break;
            case 'cause':
                const causePagination = {...this.state.causePagination};
                causePagination.activePage = activePage;
                this.setState({causePagination}, () => this.getCauseList(activePage));
                break;
            case 'advisory':
                const advisoryPagination = {...this.state.advisoryPagination};
                advisoryPagination.activePage = activePage;
                this.setState({advisoryPagination}, () => this.getAdvisoryList(activePage));
                break;
            case 'outcome':
                const outcomePagination = {...this.state.outcomePagination};
                outcomePagination.activePage = activePage;
                this.setState({outcomePagination}, () => this.getOutcomeList(activePage));
                break;
        }
    };

    onOutcomePageChange = (activePage) => {
    };

    checkBoxActionHandler=(event)=>{
        const configId = event.target.dataset.configid;
        const sendEmail = event.target.dataset.sendemail;
        let checkSelectedItem=[...this.state.configListForOutcome].map((item)=>{
            if(item.configId==configId)
            {   
                if(sendEmail=='true')//due to string 
                {
                    item['sendEmail'].send=false;
                }else{
                    item['sendEmail'].send=true;
                }
            }
            return item;
        });
        
        this.setState({configListForOutcome:checkSelectedItem});
    }
    checkBoxAllActionHandler=(event)=>{
        if(event.target.checked){
            let checkSelectedItem=[...this.state.configListForOutcome].map((item)=>{
                item['sendEmail'].send=true;
                return item;
            });
            this.setState({configListForOutcome:checkSelectedItem});
        }else{
            let checkSelectedItem=[...this.state.configListForOutcome].map((item)=>{
                item['sendEmail'].send=false;
                return item;
            });
            this.setState({configListForOutcome:checkSelectedItem});
        }
    }
    handleCloseAutoEmailModal=(event)=>{
        this.setState({showAutoEmailModal:false});
    };
    handleOpenAutoEmailModal=(event)=>{
        // let configListSelected=[...this.state.configListForOutcome].filter(item=>item.sendEmail.send===true);
        // if(configListSelected.length)
        // {
        //  this.setState({showAutoEmailModal:true});
        // }else{
        //  this.showAlert({
        //      type: "error",
        //      message: 'Select the check box of the rule to set the email notification'
        //  });
        // }configList
        this.setState({showAutoEmailModal:true});
    };
    saveEmailNotificationHandler=(event,selectedUsersList)=>{
        let userListSelected=[...selectedUsersList];
        if(userListSelected.length)
        {
            let checkSelectedItem=[...this.state.configListForOutcome].map((item)=>{
                if(item['sendEmail'].send)
                {
                    item['sendEmail'].users=userListSelected;
                }else{
                    item['sendEmail'].users=[];
                }
                return item;
            });
            
            this.setState({configListForOutcome:checkSelectedItem});

            let dataToModify=[...this.state.configListForOutcome].map((item)=>{
                return {configId:item.configId,sendEmail:item.sendEmail};
            });
    
          setResetEmailForFailureAdvisoriesRefCause((response)=>{
            if (response.data.status == 'success') {
                this.onApplyFilter();
                this.setState({showAutoEmailModal:false});
                this.showAlert({
                    type: "success",
                    message: response.data.message
                });
            } else {
                this.showAlert({
                    type: "error",
                    message: response.data.message
                });
            }
            }, (error) => {
                this.showAlert({
                    type: "error",
                    message: 'Update set auto email for advisory and cause failed'
                });
            }, dataToModify);
        }else{
            this.showAlert({
                type: "error",
                message: 'Please select user to notify by email'
            });
        }
    }

    render() {
        const {
            loading,
            accordions,
            addedCauseElements,
            ruleChainList,
            addedParameterElements,
            addedConstantElements,
            rtdasList,
            lastRuleFile,
            lastParameterFile,
            csvFile,
            calcExpressionList,
            addedAdvisoryElements,
            shipList,
            vesselValue,
            vesselLabel,
            searchByName,
            sortingOption,
            machineArr,
            configListForOutcome,
            parameterPagination,
            ruleChainPagination,
            causePagination,
            advisoryPagination,
            outcomePagination,
            lastwidgetMappingFile,
            widgetCsvFile,
            allUserDataForShip,
            showAutoEmailModal
        } = {...this.state};

        return (
            <div className="smartShipBody d-flex flex-column h-100">
                <SMSidebar history={this.props.history} screenPath={"/Alarm"}>
                    <SmartShipLoader isVisible={loading}/>
                    <CustomAlert ref={this.customAlertRef}/>
                    <NavigationBar/>
                    <div className="flex-1 overflow-auto cbm-wrapper" >
                        <div style={{display:"flex",justifyContent:"space-between",margineBottom:15}}>
                            <div className="config-form-block w-100 d-flex flex-row">
                                <div className="w-100 d-flex flex-row">
                                    <Form.Group size="sm" as={Col} className="pr-0 sm-w-200">
                                        <Form.Label>Select Ship</Form.Label>
                                        <Select
                                            theme={theme}
                                            options={shipList}
                                            name="shipName"
                                            onChange={this.onVesselChange}
                                            isMulti={false}
                                            closeMenuOnSelect={true}
                                            value={
                                                [
                                                    {
                                                        label: vesselLabel,
                                                        value: vesselValue
                                                    }
                                                ]
                                            }
                                        />
                                    </Form.Group>
                                    <Form.Group size="sm" as={Col} className="pr-0 sm-w-200">
                                        <Form.Label>Machine Name</Form.Label>
                                        <Select
                                            theme={theme}
                                            options={machineArr}
                                            data-key="machineName"
                                            onChange={this.onDropdownmachineValueChange}
                                            isMulti={true}
                                            closeMenuOnSelect={false}
                                            // defaultValue={}
                                        />
                                    </Form.Group>
                                    <Form.Group size="sm" as={Col} className="pr-0 sm-w-200">
                                        <Form.Label>Search by Name</Form.Label>
                                        <Form.Control
                                            placeholder="Name"
                                            data-key="variableName"
                                            onChange={this.onSearchByNameValueChange}
                                            value={searchByName}
                                            autoComplete="off"
                                        />
                                    </Form.Group>
                                    <Form.Group size="sm" as={Col} className="pr-0 sm-w-200">
                                        <Form.Label>Sort by</Form.Label>
                                        <Select
                                            theme={theme}
                                            data-key="sortby"
                                            options={sortByDropdownList}
                                            onChange={this.onSortDropdownValueChange}
                                            isMulti={false}
                                            closeMenuOnSelect={true}
                                            value={sortingOption}
                                            // defaultValue={}
                                        />
                                    </Form.Group>
                                    <Form.Group size="sm" as={Col} className="pr-0 d-flex align-items-center">
                                        <Button
                                            size="sm"
                                            className="parameter-add-button mt-3"
                                            onClick={this.onApplyFilter}
                                            variant="outline-secondary"
                                            disabled={false}
                                        >
                                            Apply
                                        </Button>
                                    </Form.Group>
                                </div>
                                <div size="sm" as={Col} className="pr-0 d-flex justify-content-end align-items-center pr-3">
                                    {
                                        this.state.isAllAccordionCollapse ? (
                                            <div
                                                className="collapseButton"
                                                onClick={this.onAllCollapseButtonClick}
                                                style={{width:123,height:28}}
                                            >
                                                <img
                                                    alt="Expand All"
                                                    src={plus64Icon}
                                                    style={{
                                                        width: 22,
                                                        height: 22
                                                    }}
                                                />
                                                <span className="ml-1">
                                    Expand All
                                </span>
                                            </div>) : (
                                            <div
                                                className="collapseButton"
                                                onClick={this.onAllCollapseButtonClick}
                                                style={{width:123,height:28}}
                                            >
                                                <img
                                                    alt="Collapse All"
                                                    src={minus64Icon}
                                                    style={{
                                                        width: 22,
                                                        height: 22
                                                    }}
                                                />
                                                <span className="ml-1">
                                    Collapse All
                                </span>
                                            </div>)
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="policiesBlock">
                            <div className="combineTableHeader">
                                RULE CONFIGURATION FOR ALERT AND ALARM ADVISORY
                            </div>
                            <div>
                                <Accordion className="mb-2"
                                           defaultActiveKey={accordions["parameter_acc"] ? "parameter_acc" : null}>
                                    <Accordion.Toggle
                                        as={Card.Header}
                                        eventKey="parameter_acc"
                                        data-key="parameter_acc"
                                        onClick={this.onToggleAccordion}
                                        className={accordions["parameter_acc"] ? "accordionOpen" : "accordionClose"}
                                    >
                                        {this.accordionIcon(accordions["parameter_acc"],"parameter_acc")}
                                        View Configured Parameters | Add New | Edit | Delete Parameter
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey="parameter_acc">
                                        <NewParametersTableUI
                                            addedElements={addedParameterElements}
                                            parameterPagination={parameterPagination}
                                            showAddParameterForm={this.onAddParameterBtnClick}
                                            onEditParameterClick={this.onEditParameterClick}
                                            onDuplicateParameterClick={this.onDuplicateParameterClick}
                                            onDeleteParameterClick={this.onDeleteParameterClick}
                                            onPageChange={this.onPageChange}
                                        />
                                    </Accordion.Collapse>
                                </Accordion>
                                {/*<Accordion className="mb-2" defaultActiveKey="rule_acc">todo uncomment this*/}
                                <Accordion className="mb-2" defaultActiveKey={accordions["rule_acc"] ? "rule_acc" : null}>
                                    <Accordion.Toggle
                                        as={Card.Header}
                                        eventKey="rule_acc"
                                        data-key="rule_acc"
                                        onClick={this.onToggleAccordion}
                                        className={accordions["rule_acc"] ? "accordionOpen" : "accordionClose"}
                                    >
                                        {this.accordionIcon(accordions["rule_acc"],"rule_acc")}
                                        View Configured Rules and Rule Blocks | Add New | Edit | Delete Rule and Rule Block
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey="rule_acc">
                                        <div>
                                            {/*{JSON.stringify(ruleChainList)}*/}
                                            <NewRuleChainTableUI
                                                ruleChainList={ruleChainList}
                                                pagination={ruleChainPagination}
                                                onAddNewRuleChainClick={this.onAddNewRuleChainClick}
                                                onEditRuleChainClick={this.onEditRuleChainClick}
                                                onRuleChainItemDeleteClick={this.onRuleChainItemDeleteClick}
                                                onRuleChainItemDuplicate={this.onRuleChainItemDuplicate}
                                                onActivateDeactivateRuleChainClick={this.onActivateDeactivateRuleChainClick}
                                                onPageChange={this.onPageChange}
                                                // addedElements={addedAdvisoryElements}
                                                // onAddNewRuleChainClick={this.onAddNewRuleChainClick}
                                                // onAdvisoryEditClick={this.onAdvisoryEditClick}
                                            />
                                        </div>
                                    </Accordion.Collapse>
                                </Accordion>

                                {/*<Accordion className="mb-2" defaultActiveKey="cause_acc">*/}
                                <Accordion className="mb-2"
                                           defaultActiveKey={accordions["cause_acc"] ? "cause_acc" : null}>
                                    <Accordion.Toggle
                                        as={Card.Header}
                                        eventKey="cause_acc"
                                        data-key="cause_acc"
                                        onClick={this.onToggleAccordion}
                                        className={accordions["cause_acc"] ? "accordionOpen" : "accordionClose"}
                                    >
                                        {this.accordionIcon(accordions["cause_acc"],"cause_acc")}
                                        View Configured Causes | Add New | Edit | Delete Cause
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey="cause_acc">
                                        <NewCauseTableUI
                                            addedElements={addedCauseElements}
                                            pagination={causePagination}
                                            onAddNewCauseClick={this.onAddNewCauseClick}
                                            onEditCauseClick={this.onEditCauseClick}
                                            onCauseDeleteClick={this.onCauseDeleteClick}
                                            onPageChange={this.onPageChange}
                                        />
                                    </Accordion.Collapse>
                                </Accordion>

                                <Accordion className="mb-2"
                                           defaultActiveKey={accordions["advisory_acc"] ? "advisory_acc" : null}>
                                    <Accordion.Toggle
                                        as={Card.Header}
                                        eventKey="advisory_acc"
                                        data-key="advisory_acc"
                                        onClick={this.onToggleAccordion}
                                        className={accordions["advisory_acc"] ? "accordionOpen" : "accordionClose"}
                                    >
                                        {this.accordionIcon(accordions["advisory_acc"],"advisory_acc")}
                                        View Configured Advisories | Add New | Edit | Delete Advisory
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey="advisory_acc">
                                        <div>
                                            {/*<div style={{width: 50, height: 50, backgroundColor: "gray"}}></div>*/}
                                            <NewAdvisoryTableUI
                                                addedElements={addedAdvisoryElements}
                                                pagination={advisoryPagination}
                                                onAddNewAdvisoryClick={this.onAddNewAdvisoryClick}
                                                onAdvisoryEditClick={this.onAdvisoryEditClick}
                                                onAdvisoryDeleteClick={this.onAdvisoryDeleteClick}
                                                onPageChange={this.onPageChange}
                                            />
                                        </div>
                                    </Accordion.Collapse>
                                </Accordion>

                                <Accordion className="mb-2"
                                           defaultActiveKey={accordions["outcome_acc"] ? "outcome_acc" : null}>
                                    <Accordion.Toggle
                                        as={Card.Header}
                                        eventKey="outcome_acc"
                                        data-key="outcome_acc"
                                        onClick={this.onToggleAccordion}
                                        className={accordions["outcome_acc"] ? "accordionOpen" : "accordionClose"}
                                    >
                                        {this.accordionIcon(accordions["outcome_acc"],"outcome_acc")}
                                        View and Configure Condition-based Rules and Causes
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey="outcome_acc">
                                        <div>
                                            {/*<NewOutcomeFormUI />*/}

                                            <NewOutcomeTableUI
                                                pagination={outcomePagination}
                                                configList={configListForOutcome}
                                                onConfigItemEdit={this.onConfigItemEdit}
                                                onConfigDeleteClick={this.onConfigDeleteClick}
                                                onAddNewConfigClick={this.onAddNewConfigClick}
                                                onConfigItemDuplicate={this.onConfigItemDuplicate}
                                                createExpression={this.createExpression}
                                                getCauseExpressionTableUI={this.getCauseExpressionTableUI}
                                                onPageChange={this.onPageChange}
                                                checkBoxActionHandler={this.checkBoxActionHandler}
                                                checkBoxAllActionHandler={this.checkBoxAllActionHandler}
                                                saveEmailNotificationHandler={this.saveEmailNotificationHandler}
                                                allUserDataForShip={allUserDataForShip}
                                                showAutoEmailModal={showAutoEmailModal}
                                                handleCloseAutoEmailModal={this.handleCloseAutoEmailModal}
                                                handleOpenAutoEmailModal={this.handleOpenAutoEmailModal}
                                            />
                                        </div>
                                    </Accordion.Collapse>
                                </Accordion>

                            </div>
                        </div>
                        <div className="policiesBlock">
                            <div className="combineTableHeader">
                                CONFIGURE CONSTANT AND UPLOAD CSV
                            </div>
                            <div>


                                {/*<Accordion className="mb-2"
                                       defaultActiveKey={accordions["merged_param_constant_acc"] ? "merged_param_constant_acc" : null}>
                                <Accordion.Toggle
                                    as={Card.Header}
                                    eventKey="merged_param_constant_acc"
                                    data-key="merged_param_constant_acc"
                                    onClick={this.onToggleAccordion}
                                    className={accordions["merged_param_constant_acc"] ? "accordionOpen" : "accordionClose"}
                                >
                                    {this.accordionIcon(accordions["merged_param_constant_acc"])}
                                    Parameter | Constant
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey="merged_param_constant_acc">
                                    <NewMergedParameterTableUI
                                        addedElements={addedParameterElements}
                                        addedConstantElements={addedConstantElements}

                                        onAddNewParameterClick={this.onAddNewParameterClick}
                                        onEditParameterConstantBtnClick={this.onEditParameterConstantBtnClick}
                                        onDuplicateParameterConstantBtnClick={this.onDuplicateParameterConstantBtnClick}
                                        onDeleteParameterConstantBtnClick={this.onDeleteParameterConstantBtnClick}
                                    />
                                </Accordion.Collapse>
                            </Accordion>*/}
                                <Accordion className="mb-2"
                                           defaultActiveKey={accordions["constant_acc"] ? "constant_acc" : null}>
                                    <Accordion.Toggle
                                        as={Card.Header}
                                        eventKey="constant_acc"
                                        data-key="constant_acc"
                                        onClick={this.onToggleAccordion}
                                        className={accordions["constant_acc"] ? "accordionOpen" : "accordionClose"}
                                    >
                                        {this.accordionIcon(accordions["constant_acc"],"constant_acc")}
                                        Define and Configure Constant
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey="constant_acc">
                                        <NewConstantParameterTableUI
                                            addedConstantElements={addedConstantElements}
                                            onAddConstantBtnClick={this.onAddNewConstantClick}
                                            onEditConstantClick={this.onEditConstantClick}
                                            onDuplicateConstantClick={this.onDuplicateConstantClick}
                                        />
                                    </Accordion.Collapse>
                                </Accordion>
                                <Accordion defaultActiveKey={accordions["calc_expr_acc"] ? "calc_expr_acc" : null}>
                                    <Accordion.Toggle
                                        as={Card.Header}
                                        eventKey="calc_expr_acc"
                                        data-key="calc_expr_acc"
                                        onClick={this.onToggleAccordion}
                                        className={accordions["calc_expr_acc"] ? "accordionOpen" : "accordionClose"}
                                    >
                                        {this.accordionIcon(accordions["calc_expr_acc"],"calc_expr_acc")}
                                        Configure Calculated Expression
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey="calc_expr_acc">
                                        <NewCalculatedExpressionTableUI
                                            addedElements={calcExpressionList}
                                            onAddNewCalculatedExpressionClick={this.onAddNewCalculatedExpressionClick}
                                            onEditCalculatedExpressionClick={this.onEditCalculatedExpressionClick}
                                            onDuplicateCalculatedExpressionClick={this.onDuplicateCalculatedExpressionClick}
                                        />
                                    </Accordion.Collapse>
                                </Accordion>

                                <Accordion className="mb-2" defaultActiveKey={accordions["rtdas_acc"] ? "rtdas_acc" : null}>
                                    <Accordion.Toggle
                                        as={Card.Header}
                                        eventKey="rtdas_acc"
                                        data-key="rtdas_acc"
                                        onClick={this.onToggleAccordion}
                                        className={accordions["rtdas_acc"] ? "accordionOpen" : "accordionClose"}
                                    >
                                        {this.accordionIcon(accordions["rtdas_acc"],"rtdas_acc")}
                                        Upload RTDAS Parameter CSV
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey="rtdas_acc">
                                        <div>
                                            <NewRTDASTableUI
                                                connectionList={rtdasList}
                                                onAddNewConnectionClick={this.onAddNewConnectionClick}
                                                onConnectionItemEdit={this.onConnectionItemEdit}
                                                onConnectionItemDuplicate={this.onConnectionItemDuplicate}
                                            />
                                            <NewParameterFileTableUI
                                                addedElements={lastParameterFile}
                                                onDownloadParameterFileClick={this.onDownloadParameterFileClick}
                                            />
                                        </div>
                                    </Accordion.Collapse>
                                </Accordion>

                                <Accordion className="mb-2"
                                           defaultActiveKey={accordions["uploadcsv_acc"] ? "uploadcsv_acc" : null}>
                                    <Accordion.Toggle
                                        as={Card.Header}
                                        eventKey="uploadcsv_acc"
                                        data-key="uploadcsv_acc"
                                        onClick={this.onToggleAccordion}
                                        className={accordions["uploadcsv_acc"] ? "accordionOpen" : "accordionClose"}
                                    >
                                        {this.accordionIcon(accordions["uploadcsv_acc"],"uploadcsv_acc")}
                                        Upload Rules, Alarms, Advisories via CSV
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey="uploadcsv_acc">
                                        <div>
                                            <Row style={{marginLeft:10}}>
                                                <Form.Group size="sm" as={Col}>
                                                    <FormControl
                                                        type="file"
                                                        data-key="uploadcsvFile"
                                                        onChange={this.selectCsvFile}
                                                        multiple={false}
                                                        accept=".csv"
                                                    />
                                                </Form.Group>
                                                {
                                                    (!!csvFile)?(
                                                        <Button
                                                            style={{marginRight:'35px'}}
                                                            className="SM-p-button"
                                                            variant="outline-secondary"
                                                            onClick={this.onUploadCsvClick}>
                                                            Upload CSV
                                                        </Button>
                                                    ):(<span></span>)
                                                }
                                            </Row>
                                            <NewRuleFileTableUI
                                                addedElements={lastRuleFile}
                                                onDownloadRuleFileClick={this.onDownloadRuleFileClick}
                                            />
                                        </div>
                                    </Accordion.Collapse>
                                </Accordion>

                                <Accordion className="mb-2"
                                           defaultActiveKey={accordions["upload_widget_acc"] ? "upload_widget_acc" : null}>
                                    <Accordion.Toggle
                                        as={Card.Header}
                                        eventKey="upload_widget_acc"
                                        data-key="upload_widget_acc"
                                        onClick={this.onToggleAccordion}
                                        className={accordions["upload_widget_acc"] ? "accordionOpen" : "accordionClose"}
                                    >
                                        {this.accordionIcon(accordions["upload_widget_acc"],"upload_widget_acc")}
                                        Upload Dashboard Widget Mapping CSV
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey="upload_widget_acc">
                                        <div>
                                            <Row style={{marginLeft:10}}>
                                                <Form.Group size="sm" as={Col}>
                                                    <FormControl
                                                        type="file"
                                                        data-key="uploadcsvFileOfWidget"
                                                        onChange={this.selectCsvFile}
                                                        multiple={false}
                                                        accept=".csv"
                                                    />
                                                </Form.Group>
                                                {
                                                    (!!widgetCsvFile)?(
                                                    <Button
                                                        style={{marginRight:'35px'}}
                                                        className="SM-p-button"
                                                        variant="outline-secondary"
                                                        onClick={this.onWidgetCsvFileUploadClick}>
                                                        Confirm CSV Upload
                                                    </Button>
                                                    ):(<span></span>)
                                                }
                                            </Row>
                                            <NewWidgetMappingTableUI
                                                addedElements={lastwidgetMappingFile}
                                                onDownloadFileClick={this.onDownloadFileClick}
                                            />
                                        </div>
                                    </Accordion.Collapse>
                                </Accordion>
                            </div>
                        </div>
                    </div>
                </SMSidebar>
            </div>
        );
    }
}

export default MonitorPolicies;
