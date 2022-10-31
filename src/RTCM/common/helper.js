import {OverlayTrigger, Tooltip, useAccordionToggle} from "react-bootstrap";
import React from "react";
import _ from "lodash";
import {shipName, deploymentType, timeZone} from "../../api";
import {format} from "date-fns";

export function renderTooltip(props, actualProps, tooltipText) {
    return (
        <Tooltip className="popper" id="" {...props}>
            <div className="popper__background">{tooltipText}</div>
        </Tooltip>
    );
}

export function cycleKioskMode() {
    let navBar = document.querySelector("div[class=navbar]");
    let isNavBarVisible = navBar.style.display;
    if (isNavBarVisible === "") {
        navBar.style.display = "none";
        document.body.classList.add("view-mode--kiosk");
    } else {
        navBar.style.display = "";
        document.body.classList.remove("view-mode--kiosk");
    }
}

export function escFunction(event) {
    if (event.keyCode === 27) {
        if (document.querySelector("div[class=navbar]").style.display === "none") {
            cycleKioskMode();
        }
    }
}

export function DetailViewRendererIcon(children, eventKey, data) {

    const decoratedOnClick = useAccordionToggle(eventKey, (event) => {
        data.onAccordionToggle(event.target.classList.contains("fa-angle-double-down") ? eventKey : null);
    });

    let isAccordionOpen = data.state.openAccordionKey === eventKey;

    return (
        <OverlayTrigger
            placement="top"
            delay={{show: 250, hide: 400}}
            overlay={(props) => renderTooltip(props, {}, isAccordionOpen ? "Collapse": "Expand")}
        >
            <span>
                <i className={isAccordionOpen ? "fa fa-angle-double-up" : "fa fa-angle-double-down"}
                   style={{fontSize: '25px', marginRight: '10px', color: "#d8d9da", padding: "8px", cursor: "pointer"}}
                   onClick={decoratedOnClick}/>
            </span>
        </OverlayTrigger>
    );
}

export function getItemFromLocalStorage(key) {
    const item = localStorage.getItem(key);
    if (item !== null && isJSON(_.cloneDeep(item))) {
        return JSON.parse(item);
    } else {
        return item;
    }
}

export function setItemInLocalStorage(key, value) {
    localStorage.setItem(key, value)
}

export function removeItemFromLocalStorage(key) {
    localStorage.removeItem(key);
}

export function clearLocalStorage() {
    localStorage.clear();
}

export function isJSON(item) {
    item = typeof item !== "string"
        ? JSON.stringify(item)
        : item;

    try {
        item = JSON.parse(item);
    } catch (e) {
        return false;
    }

    return typeof item === "object" && item !== null;
}

export function getShipName() {
    let sName = null;
    if (deploymentType === "ship") {
        sName = shipName;
    } else {
        sName = getItemFromLocalStorage("shipName");
        if (!sName) {
            sName = null;
        }
    }
    return sName;
}

export function getFilterName() {
    let filterName = null;
    filterName = getItemFromLocalStorage("ssAppFilterName");
    if (!filterName) {
        filterName = null;
    }
    return filterName;
}

export function getCheckBoxValue() {
    let checkboxValue = null;
    checkboxValue = getItemFromLocalStorage("ssAppCheckBoxValue");
    if (!checkboxValue) {
        checkboxValue = null;
    }
    return checkboxValue;
}

export function getFilterValue() {
    let filterValue = null;
    filterValue = getItemFromLocalStorage("ssAppFilterValue");
    if (!filterValue) {
        filterValue = null;
    }
    return filterValue;
}

export function getVesselName() {
    let vesselName = null;
    let vesselValue = null;
    if (deploymentType === "ship") {
        vesselName = shipName;
    } else {
        vesselName = getItemFromLocalStorage("ssAppvesselValue");
        vesselValue = getItemFromLocalStorage("ssAppvesselLabel");
        if (!vesselName && !vesselValue) {
            vesselName = null;
        }
    }
    return vesselName;
}

export function getAlarmVesselName() {

    let alarmvesselName = null;
    let alarmvesselValue = null;
    if (deploymentType === "ship") {
        alarmvesselName = shipName;
    } else {
        alarmvesselName = getItemFromLocalStorage("ssAppAlarmVesselValue");
        alarmvesselValue = getItemFromLocalStorage("ssAppAlarmVesselLabel");
        if (!alarmvesselName && !alarmvesselValue) {
            alarmvesselName = null;
        }
    }
    return alarmvesselName;
}

export function getVesselId() {
    let vId = getItemFromLocalStorage("ssAppVesselId");
    if (!vId) {
        vId = null;
    }

    return vId;
}

export function getNewDate() {
    return new Date(new Date().toLocaleString('en-US', {timeZone: timeZone}));
}

export function getCommonDateFormat() { // format used on backend everywhere
    return "yyyy-MM-dd HH:mm:ss";
}

export function getCommonPresentationDateFormat() {
    return "dd-MM-yyyy HH:mm:ss";
}

export function dateFormatter(stringDate, requiredDateFormat) {
    return format(new Date(stringDate), requiredDateFormat);
}

export function getDateInCommonStrFormat(strDate) {   // accepted strDate is 2020-10-24 16:59:55  (yyyy-MM-dd HH:mm:ss)
    if (strDate) {
        const strDateArr = strDate.split(" ");
        const dateArr = strDateArr[0].split("-");
        return dateArr[2] + "-" + dateArr[1] + "-" + dateArr[0] + " " + strDateArr[1];
    }
    return strDate;
}

export function getCorrectFormattedDate1(dateString){ //eg format 2020-10-21T10:00:00+00:00
    if(dateString) {
        const datePart = (dateString).split("T");
        const timePart = datePart[1].split("+")
        const formattedDate = datePart[0].split("-");
        return formattedDate[2]+"-"+formattedDate[1]+"-"+formattedDate[0] + " " + timePart[0]
    }
}

export function getCorrectFormattedDate2(dateString){ //eg format 2020-10-21T10:00:00.560
    if(dateString) {
        const datePart = (dateString).split("T")
        const timePart = datePart[1].split(".")
        const formattedDate = datePart[0].split("-");
        if(formattedDate[0] !== "1970")
            return formattedDate[2] + "-" + formattedDate[1] + "-" + formattedDate[0] + " " + timePart[0]
    }
}

export const isValidRoute = (routeName) => {
    const screenMappingRouteObj = {
        DashboardHome: "Dashboard",
        MainEngineHome: "Main Engine",
        MainGaugesHome: "Gauge",
    };
    const ScreenMappingKey = screenMappingRouteObj[routeName];
    const ScreenMappings = getItemFromLocalStorage("ScreenMapping");
    return ScreenMappings.indexOf(ScreenMappingKey) > -1;
}

export const getRedirectionPage = () => {
    let redirectTo = "DashboardHome";
    const DefaultScreenMapping = getItemFromLocalStorage('DefaultScreenMapping');

    switch (DefaultScreenMapping[0]) {
        case "Dashboard":
        case "All":
            redirectTo = "DashboardHome"
            break;
        case "Gauge":
            redirectTo = "MainGaugesHome"
            break;
        case "Main Engine":
            redirectTo = "MainEngineHome"
            break;
        case "Analytics":
            redirectTo = "DashboardPage"
            break;
        case "Alarm":
            redirectTo = "Alarm"
            break;
        default :
            redirectTo = "Alarm"
    }
    return redirectTo;
}

export function getDiffBetweenDatesInMinutes(startDate, endDate) {
    let diff = new Date(endDate).getTime() - new Date(startDate).getTime();
    return (diff / 60000);
}

export function checkValueStatus(startValue, endValue, actualValue) {

    let status = true;
    const startvalue = parseInt(startValue);
    const endvalue = parseInt(endValue);
    const actualvalue = parseInt(actualValue);
    if(startValue!=="" && endValue!=="" && actualValue!==" "){
        if(!(actualvalue>=startvalue && actualvalue<=endvalue)){
            status = false;
        }
    }
    return status
}

export function getSelectedGaugeData(modbusParameterId,gaugesData,rechartGaugeData) {

    let selectedGauge;
    for(let gaugeDataId in gaugesData){
        const gaugeIdentifier = gaugesData[gaugeDataId].widgetData.modbusParameterIdentifier;
        if (!!gaugeIdentifier) {
            if(modbusParameterId === gaugeIdentifier){
                selectedGauge = gaugesData[gaugeDataId];
                break;
            }
        }
    }
    if(!selectedGauge){
        selectedGauge = rechartGaugeData;
    }
    return selectedGauge;
}