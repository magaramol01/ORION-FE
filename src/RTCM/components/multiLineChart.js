import React, { Component, Fragment, useState } from "react";
import _ from "lodash";
import { Carousel } from "react-bootstrap";
import MachineryAndEquipmentAccordion from "./machineryAndEquipmentAccordion";
import { establishSocketConnection, getRechartData } from "../../api";
import { addMinutes, format, getMinutes, subDays, subMinutes } from "date-fns";
import { checkValueStatus, getNewDate, getShipName, getVesselId } from "../common/helper";
import ResponsiveContainer from "recharts/es6/component/ResponsiveContainer";
import {
    CartesianGrid,
    Label,
    Legend,
    Line,
    LineChart,
    ReferenceArea,
    ReferenceLine,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

const fontSize = 12;
const dateFormatter = (date, isFull) => {
    if (isFull) {
        return format(new Date(date), "dd-MM-yyyy HH:mm:ss");
    }
    return format(new Date(date), "HH");
};

const CustomTooltips = ({ active, payload, label, meFuelconsRateTableData, toolTip, valuesForTooltips }) => {

    if (active && payload) {
        const tooltipData = payload[0];
        let currentMerpmValues;
        let currentMeFuelConsRateValues;
        let currentMeanDraftValues;
        let currentShaftPowerValues;
        let currentWindSpeedValues;
        let currentCurrentSpeedValues;
        let currentVesselSpeedValues;
        let currentMeFuelEffValues;
        let currentMeEstEngineLoadValues;


        // for (let i = 0; i < valuesForTooltips.length; i++) {
        //     if (payload.length > 0) {
        //         if (payload[0].payload.timestampValue === valuesForTooltips[i].timestampValue) {

        //             currentMerpmValues = valuesForTooltips[i].MERPM;
        //             currentMeFuelConsRateValues = valuesForTooltips[i].MeFualConsRate;
        //             currentMeanDraftValues = valuesForTooltips[i].MeanDraft;
        //             currentShaftPowerValues = valuesForTooltips[i].ShaftPower;
        //             currentWindSpeedValues = valuesForTooltips[i].WindSpeed;
        //             currentCurrentSpeedValues = valuesForTooltips[i].currentSpeed;
        //             currentVesselSpeedValues = valuesForTooltips[i].VesselSpeed;
        //             currentMeFuelEffValues = valuesForTooltips[i].MeFuelEff;
        //             currentMeEstEngineLoadValues = valuesForTooltips[i].MeEstEngineLoad;
        //         }
        //     }
        // }
        if (payload.length > 0) {
            if (valuesForTooltips.length > 0) {
                let res = valuesForTooltips.reduce(function (prev, curr) {
                    let currTV = curr.timestampValue;
                    let prevTV = isObject(prev) ? prev.timestampValue : prev === undefined ? isObject(prev) ? prev.timestampValue : prev : isObject(prev) ? prev.timestampValue : prev;
                    if (currTV != undefined && prevTV != undefined) {

                        return (Math.abs(currTV - payload[0].payload.timestampValue) < Math.abs(prevTV - payload[0].payload.timestampValue) ? currTV : prevTV);
                    }
                });
                // let tempData = valuesForTooltips.filter(x => x.timestampValue === res.timestampValue);
                let tempData = valuesForTooltips.filter(x => x.timestampValue === (isObject(res) ? res.timestampValue : res));
                if (tempData.length > 0) {
                    currentMerpmValues = parseFloat(tempData[0].MERPM).toFixed(2);
                    currentMeFuelConsRateValues = parseFloat(tempData[0].MeFualConsRate).toFixed(2);
                    currentMeanDraftValues = parseFloat(tempData[0].MeanDraft).toFixed(2);
                    currentShaftPowerValues = parseFloat(tempData[0].ShaftPower).toFixed(2);
                    currentWindSpeedValues = parseFloat(tempData[0].WindSpeed).toFixed(2);
                    currentCurrentSpeedValues = parseFloat(tempData[0].currentSpeed).toFixed(2);
                    currentVesselSpeedValues = parseFloat(tempData[0].VesselSpeed).toFixed(2);
                    currentMeFuelEffValues = parseFloat(tempData[0].MeFuelEff).toFixed(2);
                    currentMeEstEngineLoadValues = parseFloat(tempData[0].MeEstEngineLoad).toFixed(2);
                }
            }
        }
        return (
            <div className="rechart-custom-tooltip" style={{ color: "#fff", display: "flex", flexDirection: "row" }}>
                <div style={{ marginLeft: "1px" }}>
                    <div >Time
                        : {dateFormatter(payload.length > 0 && payload[0].payload.timestampValue != undefined ? payload[0].payload.timestampValue : 0, true)}</div>

                    <div> <label style={{ color: "grey" }}>Current Speed </label>
                        :<label style={{ marginLeft: "5px" }}>{currentCurrentSpeedValues}</label>
                        <label className="tootlTipUnit">
                            {meFuelconsRateTableData[2].widgetData.unit}</label></div>

                    <div> <label style={{ color: "grey" }}>Wind Speed </label>
                        :<label style={{ marginLeft: "5px" }}>{currentWindSpeedValues}</label>
                        <label className="tootlTipUnit">
                            {meFuelconsRateTableData[3].widgetData.unit}</label></div>


                    <div> <label style={{ color: "grey" }}>{meFuelconsRateTableData[0].widgetData.caption} </label>
                        :<label style={{ marginLeft: "5px" }}>{currentMeFuelConsRateValues}</label>
                        <label className="tootlTipUnit">
                            {meFuelconsRateTableData[0].widgetData.unit}</label></div>

                    <div> <label style={{ color: "grey" }}>{meFuelconsRateTableData[1].widgetData.caption} </label>
                        :<label style={{ marginLeft: "5px" }}>{currentMerpmValues}</label>
                        <label className="tootlTipUnit">
                            {meFuelconsRateTableData[1].widgetData.unit}</label></div>

                    <div> <label style={{ color: "grey" }}>{toolTip[0].caption} </label>
                        :<label style={{ marginLeft: "5px" }}>{toolTip[0].value}</label>
                        <label className="tootlTipUnit">
                            mts</label></div>

                    <div> <label style={{ color: "grey" }}>{toolTip[1].caption} </label>
                        :<label style={{ marginLeft: "5px" }}>{toolTip[1].value}</label>
                        <label className="tootlTipUnit">
                            mts</label></div>

                </div>

                <div style={{ marginTop: "20px" }}>

                    <div> <label style={{ color: "grey" }}>Vessel Speed </label>
                        :<label style={{ marginLeft: "5px" }}>{currentVesselSpeedValues}</label>
                        <label className="tootlTipUnit">
                            {meFuelconsRateTableData[4].widgetData.unit}</label></div>

                    <div> <label style={{ color: "grey" }}>{meFuelconsRateTableData[5].widgetData.caption}</label>
                        :<label style={{ marginLeft: "5px" }}>{currentShaftPowerValues}</label>
                        <label className="tootlTipUnit">
                            {meFuelconsRateTableData[5].widgetData.unit}</label></div>



                    <div> <label style={{ color: "grey" }}>{meFuelconsRateTableData[6].widgetData.caption} </label>
                        :<label style={{ marginLeft: "5px" }}>{currentMeanDraftValues}</label>
                        <label className="tootlTipUnit">
                            {meFuelconsRateTableData[6].widgetData.unit}</label></div>

                    <div> <label style={{ color: "grey" }}>{meFuelconsRateTableData[7].widgetData.caption} </label>
                        :<label style={{ marginLeft: "5px" }}>{currentMeFuelEffValues}</label>
                        <label className="tootlTipUnit">
                            {meFuelconsRateTableData[7].widgetData.unit}</label></div>

                    <div> <label style={{ color: "grey" }}>{meFuelconsRateTableData[8].widgetData.caption} </label>
                        :<label style={{ marginLeft: "5px" }}>{currentMeEstEngineLoadValues}</label>
                        <label className="tootlTipUnit">
                            {meFuelconsRateTableData[8].widgetData.unit}</label></div>



                </div>



            </div>
        );
    }

    return null;
};
const CustomTooltipForThreeLine = ({ active, payload, label, meFuelconsRateTableData }) => {
    if (active && payload) {
        const tooltipData = payload[0];

        return (
            <div className="rechart-custom-tooltip">
                <div style={{ color: "#00FF00" }}>Time : {dateFormatter(payload[0].payload.timestampValue, true)}</div>

                <div className="" style={{ color: "#7eb26d" }}>{meFuelconsRateTableData[0].widgetData.caption}</div>
                <div style={{ color: "#7eb26d" }}>
                    : {payload[0].value} {meFuelconsRateTableData[0].widgetData.unit}</div>

                <div className="" style={{ color: "#b36314" }}>{meFuelconsRateTableData[1].widgetData.caption}</div>
                <div style={{ color: "#b36314" }}>
                    : {payload[1].value} {meFuelconsRateTableData[1].widgetData.unit}</div>

                {/*  <div className="" style={{color: "#c421c4"}}>{meFuelconsRateTableData[2].widgetData.caption}</div>
                <div style={{color: "#c421c4"}}>Value
                    : {payload[2].value} {meFuelconsRateTableData[2].widgetData.unit}</div>*/}

                {/* <div style={{color: "#cccc14"}}>Wind Speed</div>
                <div style={{color: "#cccc14"}}>Value : {payload[3].value} {meFuelconsRateTableData[3].widgetData.unit}</div>

                <div style={{color: "#0acccc"}}>Vessel Speed</div>
                <div style={{color: "#0acccc"}}>Value : {payload[4].value} {meFuelconsRateTableData[4].widgetData.unit}</div>*/}

                {/*<div>Lower Threshold : {meFuelconsRateTableData.lowerBoundValue} °C</div>*/}
                {/*<div>Upper Threshold : {meFuelconsRateTableData.upperBoundValue} °C</div>*/}
            </div>
        );
    }

    return null;
};

const getTicks = (startDate, endDate, num, timeDiffBetwLabelsInMinutes) => {
    let currentDate = _.cloneDeep(startDate);
    const currentDateMinutes = getMinutes(startDate);
    if (currentDateMinutes > 0 && currentDateMinutes < timeDiffBetwLabelsInMinutes) {
        currentDate = subMinutes(currentDate, currentDateMinutes);
    } else if (currentDateMinutes > timeDiffBetwLabelsInMinutes && currentDateMinutes <= 59) {
        currentDate = subMinutes(currentDate, currentDateMinutes - timeDiffBetwLabelsInMinutes);
    }

    const ticks = [currentDate.getTime()];

    for (let i = 0; i < num; i++) {
        currentDate = addMinutes(currentDate, timeDiffBetwLabelsInMinutes);
        ticks.push(currentDate.getTime());
    }

    return ticks;
};

const getStartDate = () => {
    return subDays(getNewDate(), 1)
};

const getEndDate = () => {
    return getNewDate();
};
const isObject = (val) => {
    return (typeof val === 'object')
}
const validateMultiline24Data = (reChartData) => {
    if (Object.keys(reChartData).length > 0) {
        let validatedReChartData = [];
        const reChartDataLength = reChartData.length;
        const latestDataPointTimestamp = reChartData[reChartDataLength - 1].timestampValue;
        const rollingWindowStartingTimestamp = latestDataPointTimestamp - 86400000;

        for (let i = 0; i < reChartData.length; i++) {
            const dataPoint = reChartData[i];
            const dataPointTimestamp = dataPoint.timestampValue;
            if (dataPointTimestamp && latestDataPointTimestamp && rollingWindowStartingTimestamp && dataPointTimestamp >= rollingWindowStartingTimestamp && dataPointTimestamp <= latestDataPointTimestamp) {
                validatedReChartData.push(dataPoint);
            }
        }
        return validatedReChartData;
    }
    return reChartData;
}
const structureGraphData = (data, widgetData, windData) => {

    //---------------------------Value check its is green or red part-------------------

    let vesselHeading = windData.nmeaData === undefined ? undefined : windData.nmeaData.vesselHeading;
    let vesselHeadingRed1StDirection;
    let vesselHeadingRed2ndDirection;
    let vesselHeadingGreen1StDirection;
    let vesselHeadingGreen2ndDirection;
    if (vesselHeading != undefined) {

        let vesselHeadingDirectionValue = parseInt(vesselHeading) - 45;
        let vesselHeadingOpposite = parseInt(vesselHeading) - 180;
        vesselHeadingRed1StDirection = vesselHeadingDirectionValue >= 360 ? 0 + 45 : vesselHeadingDirectionValue - 45;
        vesselHeadingRed2ndDirection = vesselHeadingDirectionValue - 360 >= 360 ? 360 - 45 : vesselHeadingDirectionValue + 45;
        vesselHeadingGreen1StDirection = vesselHeadingOpposite - 45;
        vesselHeadingGreen2ndDirection = vesselHeadingOpposite + 45;
    }
    //---------------------------------End-------------------------------------------


    const lengths = data.map(a => a.length);
    const highestLength = Math.max(...lengths)
    const structuredData = new Array();
    const structuredDataForThreeLine = new Array()
    const boundValues = new Array();
    let k = 0;
    const uniquetimestamp = new Array();
    const modbusparameteridentifierarr = new Array();
    for (k = 0; k < data.length; k++) {
        if (data[k].length == highestLength) {
            break;
        }
    }
    const startTime = new Date().getTime() - 86400000;
    const endTime = new Date().getTime();
    for (let p = 0; p < data.length; p++) {
        for (let q = 0; q < data[p].length; q++) {
            if (uniquetimestamp.indexOf(data[p][q]) === -1 && startTime <= data[p][q].timestampValue && data[p][q].timestampValue <= endTime)
                uniquetimestamp.push(data[p][q].timestampValue);
        }

    }

    // for (let q = 0; q < data.length; q++) {
    //     if (data[q].length > 0) {

    //         const last24HoursData = data[q];

    //         for (let d = 0; d < last24HoursData.length; d++) {

    //             if (uniquetimestamp.indexOf(data[p][q]) === -1 && starttime>=data[p][q].timestampValue && data[p][q].timestampValue<=endtime)
    //                         uniquetimestamp.push(data[p][q].timestampValue);
    //                 }

    //         }
    //     }
    // }
    for (let q = 0; q < data.length; q++) {
        if (data[q][0] != undefined) {
            modbusparameteridentifierarr.push(data[q][0].rechartModbusParameterIdentifier);

        }
        else {
            modbusparameteridentifierarr.push("");
        }
    }
    if (uniquetimestamp.length > 0) {
        for (let i = 0; i < uniquetimestamp.length; i++) {

            let currentValues = new Object();
            let currentValuesForThreeLine = new Object();
            for (let j = 0; j < data.length; j++) {
                let res = {};
                if (data[j].length > 0) {

                    res = data[j].reduce(function (prev, curr) {
                        let currTV = curr.timestampValue;
                        let prevTV = prev.timestampValue === undefined ? prev : prev.timestampValue;
                        if (currTV != undefined && prevTV != undefined) {

                            return (Math.abs(currTV - uniquetimestamp[i]) < Math.abs(prevTV - uniquetimestamp[i]) ? currTV : prevTV);
                        }
                    });
                }
                let tempData = data[j].filter(x => x.timestampValue === (isObject(res) ? res.timestampValue : res));


                switch (modbusparameteridentifierarr[j]) {
                    case "stormGlassCurrentSpeed":
                     
                        currentValues['currentSpeed'] = tempData.length > 0 ? tempData[0].value : 0;

                        break;
                    case "VDVBW_1":
                        currentValues['VesselSpeed'] = tempData.length > 0 ? tempData[0].value : 0;
                        currentValuesForThreeLine['VesselSpeed'] = tempData.length > 0 ? tempData[0].value : 0;
                        break;
                    case "WIMWV_3":

                        currentValues['WindSpeed'] = tempData.length > 0 ? parseInt(tempData[0].value) : 0;
                        break;
                    case "AI01C063":
                        currentValues['MERPM'] = tempData.length > 0 ? tempData[0].value : 0;
                        currentValuesForThreeLine['MERPM'] = tempData.length > 0 ? tempData[0].value : 0;
                        break;

                    case "AI03B006":
                        currentValues['ShaftPower'] = tempData.length > 0 ? tempData[0].value : 0;
                        break;
                    case "AI03C001":
                        currentValues['MeanDraft'] = tempData.length > 0 ? tempData[0].value : 0;
                        break;

                    case "AI03B019":
                      
                        currentValues['MeFuelEff'] = tempData.length > 0 ? tempData[0].value : 0;
                        break;
                    case "AI02C026":
                     
                        currentValues['MeEstEngineLoad'] = tempData.length > 0 ? tempData[0].value : 0;
                        break;
                    case "AI03B001":
                    
                        currentValues['MeFualConsRate'] = tempData.length > 0 ? tempData[0].value : 0;
                        currentValuesForThreeLine['MeFualConsRate'] = tempData.length > 0 ? tempData[0].value : 0;
                        break;

                }
                currentValues['timestampValue'] = uniquetimestamp[i];
                currentValuesForThreeLine['timestampValue'] = uniquetimestamp[i];

            }

            structuredData.push(currentValues);
            structuredDataForThreeLine.push(currentValuesForThreeLine);

        }
    }
    widgetData.map((widget) => {
        const currentWidget = new Object()
        currentWidget.upperBoundValue = widget.upperBoundValue
        currentWidget.lowerBoundValue = widget.lowerBoundValue
        boundValues.push(currentWidget)
    })
    return { structuredData: structuredData, boundValues: boundValues, structuredDataForThreeLine: structuredDataForThreeLine }

}


const structureGraphDataTwoLineGraph = (data, widgetData, windData) => {

    //---------------------------Value check its is green or red part-------------------

    const structuredData = new Array()
    const boundValues = new Array()
    let vesselHeading;
    let vesselHeadingRed1StDirection;
    let vesselHeadingRed2ndDirection;
    let vesselHeadingGreen1StDirection;
    let vesselHeadingGreen2ndDirection;
    if (data[0].length != 0) {

        /*  vesselHeadingRed1StDirection = vesselHeadingDirectionValue >= 360 ? 0 + 45 : vesselHeadingDirectionValue - 45;
          vesselHeadingRed2ndDirection = vesselHeadingDirectionValue - 360 >= 360 ? 360 - 45 : vesselHeadingDirectionValue + 45;
          vesselHeadingGreen1StDirection = vesselHeadingOpposite - 45;
          vesselHeadingGreen2ndDirection = vesselHeadingOpposite + 45;*/

        //---------------------------------End-------------------------------------------

        const lengths = data.map(a => a.length);
        const highestLength = Math.max(...lengths)


        let k = 0;
        for (k = 0; k < data.length; k++) {
            if (data[k].length == highestLength) {
                break;
            }
        }
        const uniquetimestamp = new Array();
        const modbusparameteridentifierarr = new Array();

        const startTime = new Date().getTime() -  86400000;
        const endTime = new Date().getTime();
        for (let p = 0; p < data.length; p++) {
            for (let q = 0; q < data[p].length; q++) {
                if (uniquetimestamp.indexOf(data[p][q]) === -1 && startTime <= data[p][q].timestampValue && data[p][q].timestampValue <= endTime)
                    uniquetimestamp.push(data[p][q].timestampValue);
            }

        }
        for (let q = 0; q < data.length; q++) {
            if (data[q][0] != undefined) {
                modbusparameteridentifierarr.push(data[q][0].rechartModbusParameterIdentifier);

            }
            else {
                modbusparameteridentifierarr.push("");
            }
        }

        for (let i = 0; i < uniquetimestamp.length; i++) {

            let tempCurrentValues = new Object();
            let tempWindCurrentValues = new Object();
            let traingleValidationValues = new Array();
            let currentValues = new Object();

            for (let j = 0; j < data.length; j++) {

                let res = {};
                if (data[j].length > 0) {
                    res = data[j].reduce(function (prev, curr) {
                        let currTV = curr.timestampValue;
                        let prevTV = prev.timestampValue === undefined ? prev : prev.timestampValue;
                        if (currTV != undefined && prevTV != undefined) {

                            return (Math.abs(currTV - uniquetimestamp[i]) < Math.abs(prevTV - uniquetimestamp[i]) ? currTV : prevTV);
                        }
                    });
                }
                // let tempData = data[j].filter(x => x.timestampValue === res);

                let tempData = data[j].filter(x => x.timestampValue === (isObject(res) ? res.timestampValue : res));

                switch (modbusparameteridentifierarr[j]) {
                    case "HEHDT_1":

                        traingleValidationValues.push({
                            tagName: "HEHDT_1",
                            value: tempData.length > 0 ? tempData[0].value : 0
                        });
                        let vesselHeadingDirectionValue = parseInt(tempData.length > 0 ? tempData[0].value : 0);

                        vesselHeadingRed1StDirection = vesselHeadingDirectionValue - 45 < 0 ? vesselHeadingDirectionValue + 360 - 45 : (vesselHeadingDirectionValue - 45 >= 360 ? vesselHeadingDirectionValue - 45 - 360 : vesselHeadingDirectionValue - 45);

                        vesselHeadingRed2ndDirection = vesselHeadingDirectionValue + 45 >= 360 ? vesselHeadingDirectionValue + 45 - 360 : vesselHeadingDirectionValue + 45;


                        vesselHeadingGreen1StDirection = vesselHeadingDirectionValue - 225 < 0 ? vesselHeadingDirectionValue - 225 + 360 : (vesselHeadingDirectionValue - 225 >= 360 ? vesselHeadingDirectionValue - 225 - 360 : vesselHeadingDirectionValue - 225);

                        vesselHeadingGreen2ndDirection = vesselHeadingDirectionValue - 135 < 0 ? vesselHeadingDirectionValue - 135 + 360 : (vesselHeadingDirectionValue - 135 >= 360 ? vesselHeadingDirectionValue - 135 - 360 : vesselHeadingDirectionValue - 135);
                        break;
                    case "stormGlassCurrentDirection":
                        traingleValidationValues.push({
                            tagName: "stormGlassCurrentDirection",
                            value: tempData.length > 0 ? tempData[0].value : 0
                        });
                        break;
                    case "WIMWV_1":
                        traingleValidationValues.push({
                            tagName: "WIMWV_1",
                            value: tempData.length > 0 ? tempData[0].value : 0
                        });
                        break;
                    case "stormGlassCurrentSpeed":
                        tempCurrentValues['currentSpeed'] = tempData.length > 0 ? tempData[0].value : 0;
                        break;
                    case "WIMWV_3":
                        tempWindCurrentValues['WindSpeed'] = tempData.length > 0 ? tempData[0].value : 0;
                        break;

                }
                if ((traingleValidationValues.length === 2 && tempWindCurrentValues['WindSpeed'] != undefined) || (traingleValidationValues.length === 2 && tempCurrentValues['currentSpeed'] != undefined) || (traingleValidationValues.length === 3 && tempWindCurrentValues['WindSpeed'] != undefined && tempCurrentValues['currentSpeed'] != undefined)) {

                    let currentSpeedDirectionValue = traingleValidationValues.find(x => x.tagName === 'stormGlassCurrentDirection');
                    let checkCurrentSpeedDataInRedTriangle;
                    let checkCurrentSpeedInGreenTriangle;

                    if (currentSpeedDirectionValue != undefined) {
                        currentSpeedDirectionValue = currentSpeedDirectionValue.value;
                        checkCurrentSpeedDataInRedTriangle = checkValueStatus(vesselHeadingRed1StDirection, vesselHeadingRed2ndDirection, currentSpeedDirectionValue);
                        // checkWindDataInRedTriangle1 = checkValueStatus(0, vesselHeadingRed2ndDirection, currentSpeedValue);
                        checkCurrentSpeedInGreenTriangle = checkValueStatus(vesselHeadingGreen1StDirection, vesselHeadingGreen2ndDirection, currentSpeedDirectionValue);
                        // checkWindDataInGreenTriangle1 = checkValueStatus(180, vesselHeadingGreen2ndDirection,currentSpeedValue);
                    }
                    if (checkCurrentSpeedDataInRedTriangle) {
                        currentValues['currentSpeed'] = -tempCurrentValues['currentSpeed'];
                    } else if (checkCurrentSpeedInGreenTriangle) {
                        currentValues['currentSpeed'] = tempCurrentValues['currentSpeed'];
                    } else {
                        currentValues['currentSpeed'] = 0;
                    }



                    let checkWindDataInRedTriangle;
                    let checkWindInGreenTriangle;
                    let windDirectionValue = traingleValidationValues.find(x => x.tagName === 'WIMWV_1');
                    if (windDirectionValue != undefined) {
                        windDirectionValue = windDirectionValue.value;
                        checkWindDataInRedTriangle = checkValueStatus(vesselHeadingRed1StDirection, vesselHeadingRed2ndDirection, windDirectionValue);
                        checkWindInGreenTriangle = checkValueStatus(vesselHeadingGreen1StDirection, vesselHeadingGreen2ndDirection, windDirectionValue);
                    }
                    if (checkWindDataInRedTriangle) {
                        currentValues['WindSpeed'] = -tempWindCurrentValues['WindSpeed'];
                    } else if (checkWindInGreenTriangle) {
                        currentValues['WindSpeed'] = tempWindCurrentValues['WindSpeed'];
                    } else {
                        currentValues['WindSpeed'] = 0;
                    }

                }

                currentValues['timestampValue'] = uniquetimestamp[i];

            }
            structuredData.push(currentValues);
        }
    }
    widgetData.map((widget) => {
        const currentWidget = new Object()
        currentWidget.upperBoundValue = widget.upperBoundValue
        currentWidget.lowerBoundValue = widget.lowerBoundValue
        boundValues.push(currentWidget)
    })

    return { structuredData: structuredData, boundValues: boundValues }

}

const checkProps = (data) => {

    if (Object.keys(data).length == 0) {
        return new MultLineChart(data);
    } else {
        let {
            meFuelConsRateWidgetData,
            currentSpeedWidgetData,
            windSpeedWidgetData,
            speedOverGroundWidgetData,
            meRpmWidgetData,
            shaftPowerWidgetData,
            meanDraftWidgetData,
            meFuelEffWidgetData,
            meEstEngineLoadWidgetData,
            currentDirectionWidgetData,
            windDirectionWidgetData,
            vesselHeadingWidgetData,
            speedThruWaterWidgetData
        } = widgetDataData(data);
        return {
            meFuelConsRateWidgetData,
            currentSpeedWidgetData,

            windSpeedWidgetData,
            speedOverGroundWidgetData,
            meRpmWidgetData,
            shaftPowerWidgetData,
            meanDraftWidgetData,
            meFuelEffWidgetData,
            meEstEngineLoadWidgetData,
            currentDirectionWidgetData,
            windDirectionWidgetData,
            vesselHeadingWidgetData,
            speedThruWaterWidgetData
        };

    }
}

const widgetDataData = (widgets) => {

    let meFuelConsRateWidgetData;
    let currentSpeedWidgetData;

    let windSpeedWidgetData;
    let speedOverGroundWidgetData;
    let meRpmWidgetData;
    let shaftPowerWidgetData;
    let meanDraftWidgetData;
    let meFuelEffWidgetData;
    let meEstEngineLoadWidgetData;
    let currentDirectionWidgetData;
    let windDirectionWidgetData;
    let vesselHeadingWidgetData;
    let speedThruWaterWidgetData;
    for (let key in widgets) {
        let currentObj = widgets[key];
        if (!widgets.hasOwnProperty(key)) {
            continue;
        }

        /* Nawroz___17-02-2022 */
        if ((key === 'widget-3' || currentObj.type === "dash_home_3_carousel")) {
            const carousel1Container = currentObj.configuration.body.data.carousel1;
            _.map(carousel1Container, carousel1 => { ///.group1.data.row1.colData

                if (carousel1.level == 1) {

                    shaftPowerWidgetData = carousel1.tableData.table3.group1.data.row3.colData.col1;
                    meRpmWidgetData = carousel1.tableData.table1.group1.data.row1.colData.col1;
                }

            });
        }

        if ((key === 'widget_1' || currentObj.type === "dash_home_information_carousel")) {
            const carousel1Container = currentObj.configuration.body.data.carousel1;
            _.map(carousel1Container, carousel1 => { ///.group1.data.row1.colData

                if (carousel1.caption === "Fuel") {

                    meFuelConsRateWidgetData = carousel1.data.row1.colData.col1;

                }
                if (carousel1.caption === "Navigation") {
                    // currentSpeedWidgetData = carousel1.data.row6.colData.col1;
                    windSpeedWidgetData = carousel1.data.row5.colData.col1;
                    windDirectionWidgetData = carousel1.data.row5.colData.col2;
                    vesselHeadingWidgetData = carousel1.data.row6.colData.col1;
                    speedThruWaterWidgetData = carousel1.data.row6.colData.col2;
                    speedOverGroundWidgetData = carousel1.data.row6.colData.col2;
                }
            });
            const carousel2Container = currentObj.configuration.body.data.carousel2;
            _.map(carousel2Container, carousel2 => {
                if (carousel2.caption === "Navigation") {
                    currentSpeedWidgetData = carousel2.data.row6.colData.col1;
                    currentDirectionWidgetData = carousel2.data.row6.colData.col2;
                }
            })
            const carousel3Container = currentObj.configuration.body.data.carousel3;
            _.map(carousel3Container, carousel3 => {
                if (carousel3.caption === "Fuel-Draft") {
                    meanDraftWidgetData = carousel3.data.row3.colData.col1;
                    meFuelEffWidgetData = carousel3.data.row1.colData.col1;
                    meEstEngineLoadWidgetData = carousel3.data.row2.colData.col1;

                }
            })

        }
    }
    return {
        meFuelConsRateWidgetData,
        currentSpeedWidgetData,
        windSpeedWidgetData,
        speedOverGroundWidgetData,
        meRpmWidgetData,
        shaftPowerWidgetData,
        meanDraftWidgetData,
        meFuelEffWidgetData,
        meEstEngineLoadWidgetData,
        currentDirectionWidgetData,
        windDirectionWidgetData,
        vesselHeadingWidgetData,
        speedThruWaterWidgetData
    };
}

let domainMaxValue;
let domainMinValue;
function domainCheck(min, max) {
    if (max > min) {
        if (max >= (-min)) {

            return domainMaxValue = Math.floor(max / 10) * 10 + 10, domainMinValue = -(Math.floor(max / 10) * 10 + 10);
        } else if (max < (-min)) {
            return domainMinValue = Math.floor(min / 10) * 10, domainMaxValue = -Math.floor(min / 10) * 10;
        }
    }
}


class MultLineChart extends Component {

    constructor(props) {

        super(props);
        const {
            meFuelConsRateWidgetData,
            currentSpeedWidgetData,
            windSpeedWidgetData,
            speedOverGroundWidgetData,
            meRpmWidgetData,
            shaftPowerWidgetData,
            meanDraftWidgetData,
            meFuelEffWidgetData,
            meEstEngineLoadWidgetData,
            currentDirectionWidgetData,
            windDirectionWidgetData,
            vesselHeadingWidgetData,
            speedThruWaterWidgetData

        } = checkProps(this.props.dashboardtStateForCompass);


        const shipName = getShipName();
        const vesselId = getVesselId();
        this.state = {
            shipName: shipName,
            vesselId: vesselId,
            meRpmData: [],

            shaftPowerData: [],
            meanDraftData: [],
            meFuelEffData: [],
            meEstEngineLoadData: [],
            powerShaftTableData: shaftPowerWidgetData,
            meanDraftTableData: meanDraftWidgetData,
            meFuelEffTableData: meFuelEffWidgetData,
            meEstEngineLoadTableData: meEstEngineLoadWidgetData,
            meFuelEffmodbusParameterIdentifier: meFuelEffWidgetData.widgetData.modbusParameterIdentifier,
            meEstEngineLoadmodbusParameterIdentifier: meEstEngineLoadWidgetData.widgetData.modbusParameterIdentifier,

            shaftPowermodbusParameterIdentifier: shaftPowerWidgetData.widgetData.modbusParameterIdentifier,
            meanDraftmodbusParameterIdentifier: meanDraftWidgetData.widgetData.modbusParameterIdentifier,

            lastDataPointTimeOfShaftPower: "",
            lastDataPointTimeOfMeanDraft: "",
            lastDataPointTimeOfMeFuelEff: "",
            lastDataPointTimeOfMeEstEngineLoad: "",

            meRpmTableData: meRpmWidgetData,
            meFuelconsRateTableData: meFuelConsRateWidgetData,
            currentSpeedTableData: currentSpeedWidgetData,
            windSpeedTableData: windSpeedWidgetData,
            speedOverGroundTableData: speedOverGroundWidgetData,
            speedOverGroundData: [],
            meFuelConsRateData: [],
            currentSpeedData: [],
            currentDirectionData: [],
            windSpeedData: [],
            windDirectionData: [],
            vesselHeadingData: [],
            speedThruWaterData: [],
            windData: this.props.windData,

            modbusParameterIdentifier: meRpmWidgetData.widgetData.modbusParameterIdentifier,
            meFuelConsRatemodbusParameterIdentifier: meFuelConsRateWidgetData.widgetData.modbusParameterIdentifier,
            currentSpeedmodbusParameterIdentifier: currentSpeedWidgetData.widgetData.modbusParameterIdentifier,
            currentDirectionmodbusParameterIdentifier: currentDirectionWidgetData.widgetData.modbusParameterIdentifier,
            windSpeedmodbusParameterIdentifier: windSpeedWidgetData.widgetData.modbusParameterIdentifier,
            windDirectionmodbusParameterIdentifier: windDirectionWidgetData.widgetData.modbusParameterIdentifier,
            speedOverGroundmodbusParameterIdentifier: speedOverGroundWidgetData.widgetData.modbusParameterIdentifier,
            vesselHeadingmodbusParameterIdentifier: vesselHeadingWidgetData.widgetData.modbusParameterIdentifier,
            speedThruWatermodbusParameterIdentifier: speedThruWaterWidgetData.widgetData.modbusParameterIdentifier,
            lastDataPointTime: "",
            lastDataPointTimeOfMeFuelconsRate: "",
            lastDataPointTimeOfCurrentSpeed: "",
            lastDataPointTimeOfCurrentDirection: "",
            lastDataPointTimeOfWindSpeed: "",
            lastDataPointTimeOfWindDirection: "",
            lastDataPointTimeOfSpeedOverGrount: "",
            lastDataPointTimeOfVesselHeading: "",
            socket: establishSocketConnection("subscribeToGaugeChart", { shipName: shipName, vesselId: vesselId }),
            ticks: [],
            domain: []
        };

        this.onGetMeFuelEffDataSuccess = this.onGetMeFuelEffDataSuccess.bind(this);
        this.onGetMeFuelEffDataFail = this.onGetMeFuelEffDataFail.bind(this);

        this.onGetMeEstEngineLoadDataSuccess = this.onGetMeEstEngineLoadDataSuccess.bind(this);
        this.onGetMeEstEngineLoadDataFail = this.onGetMeEstEngineLoadDataFail.bind(this);

        this.onGetShaftPowerDataSuccess = this.onGetShaftPowerDataSuccess.bind(this);
        this.onGetShaftPowerDataFail = this.onGetShaftPowerDataFail.bind(this);

        this.onGetMeanDraftDataSuccess = this.onGetMeanDraftDataSuccess.bind(this);
        this.onGetMeanDraftDataFail = this.onGetMeanDraftDataFail.bind(this);

        this.onGetMeRpmDataSuccess = this.onGetMeRpmDataSuccess.bind(this);
        this.onGetMeRpmDataFail = this.onGetMeRpmDataFail.bind(this);
        this.onGetMeFuelConsRateDataSuccess = this.onGetMeFuelConsRateDataSuccess.bind(this);
        this.onGetMeFuelConsRatDataFail = this.onGetMeFuelConsRatDataFail.bind(this);
        this.onGetCurrentSpeedDataSuccess = this.onGetCurrentSpeedDataSuccess.bind(this);
        this.onGetCurrentSpeedDataFail = this.onGetCurrentSpeedDataFail.bind(this);
        this.onGetCurrentDirectionDataSuccess = this.onGetCurrentDirectionDataSuccess.bind(this);
        this.onGetCurrentDirectionDataFail = this.onGetCurrentDirectionDataFail.bind(this);
        this.onGetWindSpeedDataSuccess = this.onGetWindSpeedDataSuccess.bind(this);
        this.onGetWindSpeedDataFail = this.onGetWindSpeedDataFail.bind(this);
        this.onGetWindDirectionDataSuccess = this.onGetWindDirectionDataSuccess.bind(this);
        this.onGetWindDirectionDataFail = this.onGetWindDirectionDataFail.bind(this);
        this.onGetspeedOverGroundDataSuccess = this.onGetspeedOverGroundDataSuccess.bind(this);
        this.onGetspeedOverGroundDataFail = this.onGetspeedOverGroundDataFail.bind(this);

        this.onGetVesselHeadingDataSuccess = this.onGetVesselHeadingDataSuccess.bind(this);
        this.onGetVesselHeadingDataFail = this.onGetVesselHeadingDataFail.bind(this);

        this.onGetSpeedThruWaterDataSuccess = this.onGetSpeedThruWaterDataSuccess.bind(this);
        this.onGetSpeedThruWaterDataFail = this.onGetSpeedThruWaterDataFail.bind(this);

        this.getToolTipFields = this.getToolTipFields.bind(this);

        this.subscribeToSocketCS("subscribeToGaugeChart");
        this.subscribeToSocketWS("subscribeToGaugeChart");
        this.subscribeToSocketMEFE("subscribeToGaugeChart");
        this.subscribeToSocketMEEL("subscribeToGaugeChart");
        this.subscribeToSocketSP("subscribeToGaugeChart");
        this.subscribeToSocketMDP("subscribeToGaugeChart");
        this.subscribeToSocketMERPM("subscribeToGaugeChart");
        this.subscribeToSocketMEFCR("subscribeToGaugeChart");
        this.subscribeToSocketMEFCR("subscribeToGaugeChart");
        this.subscribeToSocketSOG("subscribeToGaugeChart");
        this.subscribeToSocketCD("subscribeToGaugeChart");
        this.subscribeToSocketWD("subscribeToGaugeChart");
        this.subscribeToSocketVH("subscribeToGaugeChart");
        this.subscribeToSocketSTW("subscribeToGaugeChart");
    }

    subscribeToSocketMEFE(socketSubscriberName) {

        this.state.socket.on(socketSubscriberName, dataSentOverSocket => {

            if (dataSentOverSocket) {
                const newDataPoint = JSON.parse(dataSentOverSocket);

                if (newDataPoint.rechartModbusParameterIdentifier === this.state.meFuelEffmodbusParameterIdentifier && this.state.lastDataPointTimeOfMeFuelEff !== newDataPoint.time) {
                    let rechartDataClone = _.cloneDeep(this.state.meFuelEffData);
                    rechartDataClone.push(newDataPoint);

                    const startDate = getStartDate();
                    const endDate = getEndDate();

                    const validatedReChartData = this.validateReChartData(rechartDataClone);

                    const ticks = getTicks(startDate, endDate, 24, 60);
                    const domain = [dataMin => dataMin, () => endDate.getTime()];

                    this.setState({
                        meFuelEffData: validatedReChartData,
                        lastDataPointTimeOfMeFuelEff: newDataPoint.time,
                        ticks: ticks,
                        domain: domain,
                    });
                }
            }
        });
    }

    subscribeToSocketMEEL(socketSubscriberName) {
        this.state.socket.on(socketSubscriberName, dataSentOverSocket => {
            if (dataSentOverSocket) {
                const newDataPoint = JSON.parse(dataSentOverSocket);

                if (newDataPoint.rechartModbusParameterIdentifier === this.state.meEstEngineLoadmodbusParameterIdentifier && this.state.lastDataPointTimeOfMeEstEngineLoad !== newDataPoint.time) {
                    let rechartDataClone = _.cloneDeep(this.state.meEstEngineLoadData);
                    rechartDataClone.push(newDataPoint);

                    const startDate = getStartDate();
                    const endDate = getEndDate();

                    const validatedReChartData = this.validateReChartData(rechartDataClone);

                    const ticks = getTicks(startDate, endDate, 24, 60);
                    const domain = [dataMin => dataMin, () => endDate.getTime()];

                    this.setState({
                        meEstEngineLoadData: validatedReChartData,
                        lastDataPointTimeOfMeEstEngineLoad: newDataPoint.time,
                        ticks: ticks,
                        domain: domain,
                    });
                }
            }
        });
    }

    subscribeToSocketSP(socketSubscriberName) {
        this.state.socket.on(socketSubscriberName, dataSentOverSocket => {
            if (dataSentOverSocket) {
                const newDataPoint = JSON.parse(dataSentOverSocket);

                if (newDataPoint.rechartModbusParameterIdentifier === this.state.shaftPowermodbusParameterIdentifier && this.state.lastDataPointTimeOfShaftPower !== newDataPoint.time) {
                    let rechartDataClone = _.cloneDeep(this.state.shaftPowerData);
                    rechartDataClone.push(newDataPoint);

                    const startDate = getStartDate();
                    const endDate = getEndDate();

                    const validatedReChartData = this.validateReChartData(rechartDataClone);

                    const ticks = getTicks(startDate, endDate, 24, 60);
                    const domain = [dataMin => dataMin, () => endDate.getTime()];

                    this.setState({
                        shaftPowerData: validatedReChartData,
                        lastDataPointTimeOfShaftPower: newDataPoint.time,
                        ticks: ticks,
                        domain: domain,
                    });
                }
            }
        });
    }

    subscribeToSocketMDP(socketSubscriberName) {
        this.state.socket.on(socketSubscriberName, dataSentOverSocket => {
            if (dataSentOverSocket) {
                const newDataPoint = JSON.parse(dataSentOverSocket);

                if (newDataPoint.rechartModbusParameterIdentifier === this.state.meanDraftmodbusParameterIdentifier && this.state.lastDataPointTimeOfMeanDraft !== newDataPoint.time) {
                    let rechartDataClone = _.cloneDeep(this.state.meanDraftData);
                    rechartDataClone.push(newDataPoint);

                    const startDate = getStartDate();
                    const endDate = getEndDate();

                    const validatedReChartData = this.validateReChartData(rechartDataClone);

                    const ticks = getTicks(startDate, endDate, 24, 60);
                    const domain = [dataMin => dataMin, () => endDate.getTime()];

                    this.setState({
                        meanDraftData: validatedReChartData,
                        lastDataPointTimeOfMeanDraft: newDataPoint.time,
                        ticks: ticks,
                        domain: domain,
                    });
                }
            }
        });
    }

    subscribeToSocketMERPM(socketSubscriberName) {
        this.state.socket.on(socketSubscriberName, dataSentOverSocket => {
            if (dataSentOverSocket) {
                const newDataPoint = JSON.parse(dataSentOverSocket);

                if (newDataPoint.rechartModbusParameterIdentifier === this.state.modbusParameterIdentifier && this.state.lastDataPointTime !== newDataPoint.time) {
                    let rechartDataClone = _.cloneDeep(this.state.meRpmData);
                    rechartDataClone.push(newDataPoint);

                    const startDate = getStartDate();
                    const endDate = getEndDate();

                    const validatedReChartData = this.validateReChartData(rechartDataClone);

                    const ticks = getTicks(startDate, endDate, 24, 60);
                    const domain = [dataMin => dataMin, () => endDate.getTime()];

                    this.setState({
                        meRpmData: validatedReChartData,
                        lastDataPointTime: newDataPoint.time,
                        ticks: ticks,
                        domain: domain,
                    });
                }
            }
        });
    }

    subscribeToSocketMEFCR(socketSubscriberName) {
        this.state.socket.on(socketSubscriberName, dataSentOverSocket => {
            if (dataSentOverSocket) {
                const newDataPoint = JSON.parse(dataSentOverSocket);

                if (newDataPoint.rechartModbusParameterIdentifier === this.state.meFuelConsRatemodbusParameterIdentifier && this.state.lastDataPointTimeOfMeFuelconsRate !== newDataPoint.time) {
                    let rechartDataClone = _.cloneDeep(this.state.meFuelConsRateData);
                    rechartDataClone.push(newDataPoint);

                    const startDate = getStartDate();
                    const endDate = getEndDate();

                    const validatedReChartData = this.validateReChartData(rechartDataClone);

                    const ticks = getTicks(startDate, endDate, 24, 60);
                    const domain = [dataMin => dataMin, () => endDate.getTime()];

                    this.setState({
                        meFuelConsRateData: validatedReChartData,
                        lastDataPointTimeOfMeFuelconsRate: newDataPoint.time,
                        ticks: ticks,
                        domain: domain,
                    });
                }
            }
        });
    }

    subscribeToSocketCS(socketSubscriberName) {
        this.state.socket.on(socketSubscriberName, dataSentOverSocket => {
            if (dataSentOverSocket) {

                const newDataPoint = JSON.parse(dataSentOverSocket);

                if (newDataPoint.rechartModbusParameterIdentifier === this.state.currentSpeedmodbusParameterIdentifier && this.state.lastDataPointTimeOfCurrentSpeed !== newDataPoint.time) {
                    let rechartDataClone = _.cloneDeep(this.state.currentSpeedData);
                    rechartDataClone.push(newDataPoint);

                    const startDate = getStartDate();
                    const endDate = getEndDate();

                    const validatedReChartData = this.validateReChartData(rechartDataClone);

                    const ticks = getTicks(startDate, endDate, 24, 60);
                    const domain = [dataMin => dataMin, () => endDate.getTime()];

                    this.setState({
                        currentSpeedData: validatedReChartData,
                        lastDataPointTimeOfCurrentSpeed: newDataPoint.time,
                        ticks: ticks,
                        domain: domain,
                    });
                }
            }
        });
    }

    subscribeToSocketWS(socketSubscriberName) {
        this.state.socket.on(socketSubscriberName, dataSentOverSocket => {
            if (dataSentOverSocket) {
                const newDataPoint = JSON.parse(dataSentOverSocket);

                if (newDataPoint.rechartModbusParameterIdentifier === this.state.windSpeedmodbusParameterIdentifier && this.state.lastDataPointTimeOfWindSpeed !== newDataPoint.time) {
                    let rechartDataClone = _.cloneDeep(this.state.windSpeedData);
                    rechartDataClone.push(newDataPoint);

                    const startDate = getStartDate();
                    const endDate = getEndDate();

                    const validatedReChartData = this.validateReChartData(rechartDataClone);

                    const ticks = getTicks(startDate, endDate, 24, 60);
                    const domain = [dataMin => dataMin, () => endDate.getTime()];

                    this.setState({
                        windSpeedData: validatedReChartData,
                        lastDataPointTimeOfWindSpeed: newDataPoint.time,
                        ticks: ticks,
                        domain: domain,
                    });
                }
            }
        });
    }

    subscribeToSocketSOG(socketSubscriberName) {
        this.state.socket.on(socketSubscriberName, dataSentOverSocket => {
            if (dataSentOverSocket) {
                const newDataPoint = JSON.parse(dataSentOverSocket);

                if (newDataPoint.rechartModbusParameterIdentifier === this.state.speedOverGroundmodbusParameterIdentifier && this.state.lastDataPointTimeOfSpeedOverGrount !== newDataPoint.time) {
                    let rechartDataClone = _.cloneDeep(this.state.speedOverGroundData);
                    rechartDataClone.push(newDataPoint);

                    const startDate = getStartDate();
                    const endDate = getEndDate();

                    const validatedReChartData = this.validateReChartData(rechartDataClone);

                    const ticks = getTicks(startDate, endDate, 24, 60);
                    const domain = [dataMin => dataMin, () => endDate.getTime()];

                    this.setState({
                        speedOverGroundData: validatedReChartData,
                        lastDataPointTimeOfSpeedOverGrount: newDataPoint.time,
                        ticks: ticks,
                        domain: domain,
                    });
                }
            }
        });
    }

    subscribeToSocketCD(socketSubscriberName) {
        this.state.socket.on(socketSubscriberName, dataSentOverSocket => {
            if (dataSentOverSocket) {
                const newDataPoint = JSON.parse(dataSentOverSocket);

                if (newDataPoint.rechartModbusParameterIdentifier === this.state.currentDirectionmodbusParameterIdentifier && this.state.lastDataPointTimeOfCurrentDirection !== newDataPoint.time) {
                    let rechartDataClone = _.cloneDeep(this.state.currentDirectionData);
                    rechartDataClone.push(newDataPoint);

                    const startDate = getStartDate();
                    const endDate = getEndDate();

                    const validatedReChartData = this.validateReChartData(rechartDataClone);

                    const ticks = getTicks(startDate, endDate, 24, 60);
                    const domain = [dataMin => dataMin, () => endDate.getTime()];

                    this.setState({
                        currentDirectionData: validatedReChartData,
                        lastDataPointTimeOfCurrentDirection: newDataPoint.time,
                        ticks: ticks,
                        domain: domain,
                    });
                }
            }
        });
    }

    subscribeToSocketWD(socketSubscriberName) {
        this.state.socket.on(socketSubscriberName, dataSentOverSocket => {
            if (dataSentOverSocket) {
                const newDataPoint = JSON.parse(dataSentOverSocket);

                if (newDataPoint.rechartModbusParameterIdentifier === this.state.windDirectionmodbusParameterIdentifier && this.state.lastDataPointTimeOfWindDirection !== newDataPoint.time) {
                    let rechartDataClone = _.cloneDeep(this.state.windDirectionData);
                    rechartDataClone.push(newDataPoint);

                    const startDate = getStartDate();
                    const endDate = getEndDate();

                    const validatedReChartData = this.validateReChartData(rechartDataClone);

                    const ticks = getTicks(startDate, endDate, 24, 60);
                    const domain = [dataMin => dataMin, () => endDate.getTime()];

                    this.setState({
                        windDirectionData: validatedReChartData,
                        lastDataPointTimeOfWindDirection: newDataPoint.time,
                        ticks: ticks,
                        domain: domain,
                    });
                }
            }
        });
    }

    subscribeToSocketSTW(socketSubscriberName) {
        this.state.socket.on(socketSubscriberName, dataSentOverSocket => {
            if (dataSentOverSocket) {
                const newDataPoint = JSON.parse(dataSentOverSocket);

                if (newDataPoint.rechartModbusParameterIdentifier === this.state.speedThruWatermodbusParameterIdentifier && this.state.lastDataPointTimeOfWindDirection !== newDataPoint.time) {
                    let rechartDataClone = _.cloneDeep(this.state.speedThruWaterData);
                    rechartDataClone.push(newDataPoint);

                    const startDate = getStartDate();
                    const endDate = getEndDate();

                    const validatedReChartData = this.validateReChartData(rechartDataClone);

                    const ticks = getTicks(startDate, endDate, 24, 60);
                    const domain = [dataMin => dataMin, () => endDate.getTime()];

                    this.setState({
                        windDirectionData: validatedReChartData,
                        lastDataPointTimeOfWindDirection: newDataPoint.time,
                        ticks: ticks,
                        domain: domain,
                    });
                }
            }
        });
    }

    subscribeToSocketVH(socketSubscriberName) {
        this.state.socket.on(socketSubscriberName, dataSentOverSocket => {
            if (dataSentOverSocket) {
                const newDataPoint = JSON.parse(dataSentOverSocket);

                if (newDataPoint.rechartModbusParameterIdentifier === this.state.vesselHeadingmodbusParameterIdentifier && this.state.lastDataPointTimeOfVesselHeading !== newDataPoint.time) {


                    let rechartDataClone = _.cloneDeep(this.state.vesselHeadingData);
                    rechartDataClone.push(newDataPoint);

                    const startDate = getStartDate();
                    const endDate = getEndDate();

                    const validatedReChartData = this.validateReChartData(rechartDataClone);

                    const ticks = getTicks(startDate, endDate, 24, 60);
                    const domain = [dataMin => dataMin, () => endDate.getTime()];

                    this.setState({
                        vesselHeadingData: validatedReChartData,
                        lastDataPointTimeOfvesselHeading: newDataPoint.time,
                        ticks: ticks,
                        domain: domain,
                    });
                }
            }
        });
    }


    validateReChartData(reChartData) {
        if (Object.keys(reChartData).length > 0) {
            let validatedReChartData = [];
            const reChartDataLength = reChartData.length;
            const latestDataPointTimestamp = reChartData[reChartDataLength - 1].timestampValue;
            const rollingWindowStartingTimestamp = latestDataPointTimestamp - 86400000;

            for (let i = 0; i < reChartData.length; i++) {
                const dataPoint = reChartData[i];
                const dataPointTimestamp = dataPoint.timestampValue;
                if (dataPointTimestamp && latestDataPointTimestamp && rollingWindowStartingTimestamp && dataPointTimestamp >= rollingWindowStartingTimestamp && dataPointTimestamp <= latestDataPointTimestamp) {
                    validatedReChartData.push(dataPoint);
                }
            }
            return validatedReChartData;
        }
        return reChartData;
    }

    async componentDidMount() {
        await Promise.all([
            getRechartData(this.onGetCurrentDirectionDataSuccess, this.onGetCurrentDirectionDataFail, {
                vesselId: this.state.vesselId,
                parameterId: this.state.currentDirectionmodbusParameterIdentifier
            }),

            getRechartData(this.onGetWindDirectionDataSuccess, this.onGetCurrentDirectionDataFail, {
                vesselId: this.state.vesselId,
                parameterId: this.state.windDirectionmodbusParameterIdentifier

            }),

            getRechartData(this.onGetVesselHeadingDataSuccess, this.onGetVesselHeadingDataFail, {
                vesselId: this.state.vesselId,
                parameterId: this.state.vesselHeadingmodbusParameterIdentifier
            }),

            getRechartData(this.onGetSpeedThruWaterDataSuccess, this.onGetSpeedThruWaterDataFail, {
                vesselId: this.state.vesselId,
                parameterId: this.state.speedThruWatermodbusParameterIdentifier
            }),

            getRechartData(this.onGetMeFuelEffDataSuccess, this.onGetMeFuelEffDataFail, {
                vesselId: this.state.vesselId,
                parameterId: this.state.meFuelEffmodbusParameterIdentifier

            }),
            getRechartData(this.onGetMeEstEngineLoadDataSuccess, this.onGetMeEstEngineLoadDataFail, {
                vesselId: this.state.vesselId,
                parameterId: this.state.meEstEngineLoadmodbusParameterIdentifier

            }),

            getRechartData(this.onGetShaftPowerDataSuccess, this.onGetShaftPowerDataFail, {
                vesselId: this.state.vesselId,
                parameterId: this.state.shaftPowermodbusParameterIdentifier

            }),
            getRechartData(this.onGetMeanDraftDataSuccess, this.onGetMeanDraftDataFail, {
                vesselId: this.state.vesselId,
                parameterId: this.state.meanDraftmodbusParameterIdentifier

            }),

            getRechartData(this.onGetMeRpmDataSuccess, this.onGetMeRpmDataFail, {
                vesselId: this.state.vesselId,
                parameterId: this.state.modbusParameterIdentifier

            }),
            getRechartData(this.onGetMeFuelConsRateDataSuccess, this.onGetMeFuelConsRatDataFail, {
                vesselId: this.state.vesselId,
                parameterId: this.state.meFuelConsRatemodbusParameterIdentifier

            }),

            getRechartData(this.onGetCurrentSpeedDataSuccess, this.onGetCurrentSpeedDataFail, {
                vesselId: this.state.vesselId,
                parameterId: this.state.currentSpeedmodbusParameterIdentifier

            }),

            getRechartData(this.onGetWindSpeedDataSuccess, this.onGetWindSpeedDataFail, {
                vesselId: this.state.vesselId,
                parameterId: this.state.windSpeedmodbusParameterIdentifier

            }),


            getRechartData(this.onGetspeedOverGroundDataSuccess, this.onGetspeedOverGroundDataFail, {
                vesselId: this.state.vesselId,
                parameterId: this.state.speedOverGroundmodbusParameterIdentifier

            })
        ]).catch((err)=>{
            console.log(err);
        })
    }

    onGetMeFuelEffDataSuccess(response) {

        //const rechartData = response.data;
        const validatedReChartData = this.validateReChartData(response.data);
        const rechartData = validatedReChartData;
     
        const startDate = getStartDate();
        const endDate = getEndDate();

        const ticks = getTicks(startDate, endDate, 24, 60);
        const domain = [dataMin => dataMin, () => endDate.getTime()];

        this.setState({
            meFuelEffData: rechartData,
            ticks: ticks,
            domain: domain,
        });
    }

    onGetMeEstEngineLoadDataSuccess(response) {

        //const rechartData = response.data;
        const validatedReChartData = this.validateReChartData(response.data);
        const rechartData = validatedReChartData;
     
        const startDate = getStartDate();
        const endDate = getEndDate();

        const ticks = getTicks(startDate, endDate, 24, 60);
        const domain = [dataMin => dataMin, () => endDate.getTime()];

        this.setState({
            meEstEngineLoadData: rechartData,
            ticks: ticks,
            domain: domain,
        });
    }

    onGetShaftPowerDataSuccess(response) {

        //const rechartData = response.data;
        const validatedReChartData = this.validateReChartData(response.data);
        const rechartData = validatedReChartData;
       
        const startDate = getStartDate();
        const endDate = getEndDate();

        const ticks = getTicks(startDate, endDate, 24, 60);
        const domain = [dataMin => dataMin, () => endDate.getTime()];

        this.setState({
            shaftPowerData: rechartData,
            ticks: ticks,
            domain: domain,
        });
    }

    onGetMeanDraftDataSuccess(response) {

        //const rechartData = response.data;
        const validatedReChartData = this.validateReChartData(response.data);
        const rechartData = validatedReChartData;
     
        const startDate = getStartDate();
        const endDate = getEndDate();

        const ticks = getTicks(startDate, endDate, 24, 60);
        const domain = [dataMin => dataMin, () => endDate.getTime()];

        this.setState({
            meanDraftData: rechartData,
            ticks: ticks,
            domain: domain,
        });
    }

    onGetMeFuelEffDataFail() {
        this.setState({
            shaftPowerData: []
        });
    }

    onGetMeEstEngineLoadDataFail() {
        this.setState({
            meanDraftData: []
        });
    }

    onGetShaftPowerDataFail() {
        this.setState({
            shaftPowerData: []
        });
    }

    onGetMeanDraftDataFail() {
        this.setState({
            meanDraftData: []
        });
    }

    onGetMeRpmDataSuccess(response) {
        //const rechartData = response.data;
        const validatedReChartData = this.validateReChartData(response.data);
        const rechartData = validatedReChartData;
      
        const startDate = getStartDate();
        const endDate = getEndDate();

        const ticks = getTicks(startDate, endDate, 24, 60);
        const domain = [dataMin => dataMin, () => endDate.getTime()];

        this.setState({
            meRpmData: rechartData,
            ticks: ticks,
            domain: domain,
        });
    }

    onGetMeFuelConsRateDataSuccess(response) {

        //const rechartData = response.data;
    
        const validatedReChartData = this.validateReChartData(response.data);
        const rechartData = validatedReChartData;
      
        const startDate = getStartDate();
        const endDate = getEndDate();

        const ticks = getTicks(startDate, endDate, 24, 60);
        const domain = [dataMin => dataMin, () => endDate.getTime()];

        this.setState({
            meFuelConsRateData: rechartData,
            ticks: ticks,
            domain: domain,
        });
    }

    onGetCurrentSpeedDataSuccess(response) {

        //const rechartData = response.data;
        const validatedReChartData = this.validateReChartData(response.data);
        const rechartData = validatedReChartData;
      
        const startDate = getStartDate();
        const endDate = getEndDate();

        const ticks = getTicks(startDate, endDate, 24, 60);
        const domain = [dataMin => dataMin, () => endDate.getTime()];

        this.setState({
            currentSpeedData: rechartData,
            ticks: ticks,
            domain: domain,
        });
    }

    onGetCurrentDirectionDataSuccess(response) {

        //const rechartData = response.data;
        const validatedReChartData = this.validateReChartData(response.data);
        const rechartData = validatedReChartData;

        const startDate = getStartDate();
        const endDate = getEndDate();

        const ticks = getTicks(startDate, endDate, 24, 60);
        const domain = [dataMin => dataMin, () => endDate.getTime()];

        this.setState({
            currentDirectionData: rechartData,
            ticks: ticks,
            domain: domain,
        });
    }

    onGetWindSpeedDataSuccess(response) {

        //const rechartData = response.data;
        const validatedReChartData = this.validateReChartData(response.data);
        const rechartData = validatedReChartData;
     
        const startDate = getStartDate();
        const endDate = getEndDate();

        const ticks = getTicks(startDate, endDate, 24, 60);
        const domain = [dataMin => dataMin, () => endDate.getTime()];

        this.setState({
            windSpeedData: rechartData,
            ticks: ticks,
            domain: domain,
        });
    }

    onGetWindDirectionDataSuccess(response) {

        //const rechartData = response.data;
        const validatedReChartData = this.validateReChartData(response.data);
        const rechartData = validatedReChartData;

        const startDate = getStartDate();
        const endDate = getEndDate();

        const ticks = getTicks(startDate, endDate, 24, 60);
        const domain = [dataMin => dataMin, () => endDate.getTime()];

        this.setState({
            windDirectionData: rechartData,
            ticks: ticks,
            domain: domain,
        });
    }

    onGetspeedOverGroundDataSuccess(response) {

        //const rechartData = response.data;
        const validatedReChartData = this.validateReChartData(response.data);
        const rechartData = validatedReChartData;
    
        const startDate = getStartDate();
        const endDate = getEndDate();

        const ticks = getTicks(startDate, endDate, 24, 60);
        const domain = [dataMin => dataMin, () => endDate.getTime()];

        this.setState({
            speedOverGroundData: rechartData,
            ticks: ticks,
            domain: domain,
        });
    }

    onGetMeRpmDataFail() {
        this.setState({
            rechartData: []
        });
    }

    onGetMeFuelConsRatDataFail() {
        this.setState({
            meFuelConsRateData: []
        });
    }

    onGetCurrentSpeedDataFail() {
        this.setState({
            currentSpeedData: []
        });
    }

    onGetCurrentDirectionDataFail() {
        this.setState({
            currentDirectionData: []
        });
    }

    onGetWindSpeedDataFail() {
        this.setState({
            windSpeedData: []
        });
    }

    onGetWindDirectionDataFail() {
        this.setState({
            windDirectionData: []
        });
    }

    onGetspeedOverGroundDataFail() {
        this.setState({
            speedOverGroundData: []
        });
    }

    onGetVesselHeadingDataSuccess(response) {

        const rechartData = response.data;
     
        const startDate = getStartDate();
        const endDate = getEndDate();

        const ticks = getTicks(startDate, endDate, 24, 60);
        const domain = [dataMin => dataMin, () => endDate.getTime()];

        this.setState({
            vesselHeadingData: rechartData,
            ticks: ticks,
            domain: domain,
        });
    }

    onGetVesselHeadingDataFail() {
        this.setState({
            vesselHeadingData: []
        });
    }
    onGetSpeedThruWaterDataSuccess(response) {

        const rechartData = response.data;
     
        const startDate = getStartDate();
        const endDate = getEndDate();

        const ticks = getTicks(startDate, endDate, 24, 60);
        const domain = [dataMin => dataMin, () => endDate.getTime()];

        this.setState({
            speedThruWaterData: rechartData,
            ticks: ticks,
            domain: domain,
        });
    }

    onGetSpeedThruWaterDataFail() {
        this.setState({
            speedThruWaterData: []
        });
    }

    getToolTipFields(windData) {

        let nameDataFilter = windData.stormGlassData != undefined ? windData.stormGlassData.data.filter(x => x.nmeaData.sog != undefined) : "";
        let nameDataDateWiseFilter = [];
        if (nameDataFilter != undefined) {
            if (nameDataFilter.length > 0) {
                nameDataDateWiseFilter = nameDataFilter.sort((a, b) => new Date(b.packetTs) - new Date(a.packetTs));

            }
        }
        let tooltipData = [];
        let obj4 = {
            caption: 'Stw',
            value: this.props.dashboardtStateForCompass.widget_1.configuration.body.data.carousel1 != undefined ? parseInt(this.props.dashboardtStateForCompass.widget_1.configuration.body.data.carousel1.group2.data.row6.colData.col2.widgetData.value) : 0
        }
        if (nameDataDateWiseFilter.length > 0) {
            if (Object.keys(nameDataDateWiseFilter[0].weatherData).length > 0) {

                let obj2 = {
                    caption: 'waveHeight',
                    value: nameDataDateWiseFilter[0].weatherData.waveHeight != undefined ? nameDataDateWiseFilter[0].weatherData.waveHeight.sg : 0
                };
                let obj3 = {
                    caption: 'swellHeight',
                    value: nameDataDateWiseFilter[0].weatherData.swellHeight !== undefined ? nameDataDateWiseFilter[0].weatherData.swellHeight.sg : 0
                };
                let objCS = {
                    caption: 'windSpeed',
                    value: nameDataDateWiseFilter[0].weatherData.windSpeed != undefined ? nameDataDateWiseFilter[0].weatherData.windSpeed.sg : 0
                };
                let objWD = {
                    caption: 'currentSpeed',
                    value: nameDataDateWiseFilter[0].weatherData.currentSpeed !== undefined ? nameDataDateWiseFilter[0].weatherData.currentSpeed.sg : 0
                };
                tooltipData.push(obj2);
                tooltipData.push(obj3);
                tooltipData.push(objCS);
                tooltipData.push(objWD);

            }
            else {
                let obj2 = {
                    caption: 'waveHeight',
                    value: 0
                };
                let obj3 = {
                    caption: 'swellHeight',
                    value: 0
                };

                tooltipData.push(obj2);
                tooltipData.push(obj3);

            }
        }
        else {
            let obj2 = {
                caption: 'waveHeight',
                value: 0
            };
            let obj3 = {
                caption: 'swellHeight',
                value: 0
            };

            tooltipData.push(obj2);
            tooltipData.push(obj3);
        }
        tooltipData.push(obj4);
        return tooltipData;
    }


    render() {

        let toolTip;
        let windData = this.props.windData;


        if (windData != undefined) {
            toolTip = this.getToolTipFields(windData);
        }
        const {
            meRpmData, meFuelConsRateData, currentSpeedData, windSpeedData, speedOverGroundData,
            ticks, domain, meRpmTableData, windSpeedTableData, currentSpeedTableData,
            meFuelconsRateTableData, speedOverGroundTableData,
            shaftPowerData,
            powerShaftTableData, meanDraftTableData, meanDraftData,
            meFuelEffTableData, meEstEngineLoadTableData, meFuelEffData, meEstEngineLoadData,
            currentDirectionData, windDirectionData, vesselHeadingData
        } = this.state;

        const arrData = [meFuelConsRateData, meRpmData, currentSpeedData,
            windSpeedData, speedOverGroundData,
            shaftPowerData, meanDraftData, meFuelEffData, meEstEngineLoadData];
        const arrTableData = [meFuelconsRateTableData, meRpmTableData,
            currentSpeedTableData, windSpeedTableData, speedOverGroundTableData,
            powerShaftTableData, meanDraftTableData, meFuelEffTableData, meEstEngineLoadTableData];
        const triangleValidationData = [windSpeedData, currentSpeedData, currentDirectionData, windDirectionData, vesselHeadingData];

        const valuesForTooltips = structureGraphData(arrData, arrTableData, this.props.windData).structuredData;

        let domainMax;
        let domainMin;

        if (windSpeedData.length !== 0) {
            let windVal = []
            for (let i in windSpeedData) {
                windVal.push(windSpeedData[i].value)
            }
            domainMin = Math.min(...windVal);
            domainMax = Math.max(...windVal);
        }

        domainCheck(domainMin, domainMax);

        const DataFormater = (number) => {
            if (number < 0) {
                number = number * (-1);
                return number;
            } else {
                return number.toString();
            }
        }

        let offsetNum = (domainMaxValue / 10) - 7

        const domainof = [domainMinValue, domainMaxValue];
        const windSpeedtickArray = [domainMinValue, domainMinValue / 2, 0, domainMaxValue / 2, domainMaxValue]
        return (
            <>
                <div className="multilineChart" style={{ height: "50%", marginTop: "10px" }}>
                    <div style={{ position: "absolute", width: "100%" }}>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: fontSize,
                            marginTop: "59px",
                            paddingRight: "26px"
                        }}>
                            <div style={{
                                color: "#d8d9da",
                                marginTop: "67px"
                            }}>{format(getStartDate(), "dd-MM-yyyy")}</div>
                            <div style={{
                                color: "#d8d9da",
                                marginTop: "67px"
                            }}>{format(getEndDate(), "dd-MM-yyyy")}</div>

                        </div>
                        <div style={{
                            color: "#55db55",
                            marginTop: "-112px",
                            marginLeft: "89%"
                        }}>Assisting</div>

                        <div style={{
                            color: "#f87878",
                            marginTop: "23px",
                            marginLeft: "89%"
                        }}>Resisting </div>
                    </div>
                    <ResponsiveContainer height='100%' width='88%'>

                        <LineChart width={880} height={100}
                            margin={{ top: 10, right: 0, left: 15, bottom: 15 }}
                            dataKey='timestampValue'
                            data={structureGraphDataTwoLineGraph(triangleValidationData, arrTableData, this.state.windData).structuredData}>


                            <XAxis
                                dataKey="timestampValue"
                                axisLine={false}
                                stroke="#d8d9da"
                                scale="time"
                                tickFormatter={dateFormatter}
                                type="number"
                                domain={domain}
                                ticks={ticks}
                                tick={{ fontSize: fontSize }}
                                tickLine={false}
                                width={5}

                            />
                            <YAxis

                                tickFormatter={DataFormater}

                                type='number' yAxisId="idWS"
                                stroke="#cccc14" orientation="left"
                                dataKey="WindSpeed"
                                domain={domainof}
                                allowDecimals={true}>
                                <Label
                                    style={{
                                        textAnchor: "middle",
                                        fontSize: 14,
                                        fill: "#cccc14",
                                    }}
                                    value="Wind Speed"
                                    angle={-90}

                                    fill='#cccc14'
                                    position='insideLeft'
                                    offset={23} //offsetNum


                                />
                            </YAxis>

                            <YAxis yAxisId="idCS" stroke="#c421c4" orientation="left" dataKey="currentSpeed" domain={[-10, 10]}
                                tickFormatter={DataFormater} allowDecimals={true}>
                                <Label
                                    value="Current Speed"
                                    angle={-90}
                                    position='outside'
                                    fill='#c421c4'
                                    style={{
                                        fontSize: 14,
                                        fontWeight: '500',
                                    }}

                                />
                            </YAxis>

                            <Tooltip
                                viewBox={{ background: "#212124" }} //212124
                                contentStyle={{ background: "#212124", border: "#d8d9da" }}
                                content={<CustomTooltips meFuelconsRateTableData={arrTableData}
                                    toolTip={toolTip}
                                    valuesForTooltips={valuesForTooltips}
                                />}
                            />

                            <ReferenceArea
                                y1={arrTableData[3].lowerBoundValue}
                                y2={arrTableData[3].upperBoundValue}
                                stroke="#7eb26d"
                                fill="#578fc3"
                                opacity={0.2}
                            />
                            <ReferenceArea
                                y1={arrTableData[2].lowerBoundValue}
                                y2={arrTableData[2].upperBoundValue}
                                stroke="#7eb26d"
                                fill="#578fc3"
                                opacity={0.2}
                            />

                            <Line
                                yAxisId="idWS"
                                type="dashed"
                                dataKey="WindSpeed"
                                dot={false}
                                stroke="#cccc14"
                            />

                            <Line
                                yAxisId="idCS"
                                type="dashed"
                                dataKey="currentSpeed"
                                dot={false}
                                stroke="#c421c4"
                            />
                            <ReferenceLine yAxisId="idCS" y={0} stroke="#fff" />

                        </LineChart>
                    </ResponsiveContainer>

                    <div style={{ position: "absolute", width: "100%" }}>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: fontSize,
                            marginTop: "59px",
                            paddingRight: "26px"
                        }}>
                            <div style={{
                                color: "#d8d9da",
                                marginTop: "67px"
                            }}>{format(getStartDate(), "dd-MM-yyyy")}</div>
                            <div style={{
                                color: "#d8d9da",
                                marginTop: "67px"
                            }}>{format(getEndDate(), "dd-MM-yyyy")}</div>
                        </div>
                    </div>
                    <ResponsiveContainer height='100%' width='93%'>

                        <LineChart width={880} height={200}
                            margin={{ top: 40, right: 0, left: 15, bottom: 15 }}
                            dataKey='timestampValue'
                            data={structureGraphData(arrData, arrTableData, this.state.windData).structuredDataForThreeLine}>


                            <XAxis
                                dataKey="timestampValue"
                                axisLine={true}
                                tickLine={true}
                                stroke="#d8d9da"
                                scale="time"
                                tickFormatter={dateFormatter}
                                type="number"
                                domain={domain}
                                ticks={ticks}
                                tick={{ fontSize: fontSize }}

                            />


                            <YAxis yAxisId="idSP" orientation="right" stroke="#dc3545c4" dataKey="VesselSpeed">
                                <Label
                                    value="Vessel Speed"
                                    angle={-90}
                                    position='outside'
                                    fill='#dc3545c4'
                                    style={{
                                        fontSize: 14,
                                        fontWeight: '500',
                                    }}
                                />
                            </YAxis>
                            <YAxis yAxisId="idMERPM" stroke="#28a74585" orientation="left" dataKey="MERPM">
                                <Label
                                    value="ME RPM"
                                    angle={-90}
                                    position='outside'
                                    fill='#28a74585'
                                    style={{
                                        fontSize: 14,
                                        fontWeight: '500',
                                    }}
                                />
                            </YAxis>
                            <YAxis yAxisId="idMEFCons" stroke="#2196F3" orientation="left" dataKey="MeFualConsRate">


                                <Label
                                    value="ME FCR (Kg/h)"
                                    angle={-90}
                                    position='insideLeft'
                                    offset={23}
                                    fill='#2196F3'

                                    style={{

                                        fontWeight: '500',
                                        textAnchor: "middle",
                                        fontSize: 14

                                    }}
                                />
                            </YAxis>

                            <Tooltip
                                viewBox={{ background: "#212124" }} //212124
                                contentStyle={{ background: "#212124", border: "#d8d9da" }}
                                // content={<CustomTooltipForThreeLine meFuelconsRateTableData={arrTableData}/>}
                                content={<CustomTooltips meFuelconsRateTableData={arrTableData}
                                    toolTip={toolTip}
                                    valuesForTooltips={valuesForTooltips}
                                />}
                            />

                            <ReferenceArea
                                // x1={domain[0]}
                                // x2={domain[1]}
                                y1={arrTableData[4].lowerBoundValue}
                                y2={arrTableData[4].upperBoundValue}
                                stroke="#7eb26d"
                                fill="#578fc3"
                                opacity={0.2}
                            />

                            <ReferenceArea
                                // x1={domain[0]}
                                // x2={domain[1]}
                                y1={arrTableData[1].lowerBoundValue}
                                y2={arrTableData[1].upperBoundValue}
                                stroke="#7eb26d"
                                fill="#578fc3"
                                opacity={0.2}
                            />

                            <ReferenceArea
                                // x1={domain[0]}
                                // x2={domain[1]}
                                y1={arrTableData[0].lowerBoundValue}
                                y2={arrTableData[0].upperBoundValue}
                                stroke="#7eb26d"
                                fill="#578fc3"
                                opacity={0.2}
                            />


                            <Line yAxisId="idSP"
                                type="monotone"
                                dataKey="VesselSpeed"
                                dot={false}
                                stroke="#dc3545c4"
                            />
                            <Line yAxisId="idMERPM"
                                type="monotone"
                                dataKey="MERPM"
                                dot={false}
                                stroke="#28a74585"
                            />
                            <Line
                                yAxisId="idMEFCons"
                                type="monotone"
                                dataKey="MeFualConsRate"
                                dot={false}
                                stroke="#2196F3"
                            />


                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </>
        )


    }

}

export default MultLineChart;