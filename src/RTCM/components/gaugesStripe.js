import React, {Component, Fragment} from "react";
import CustomScrollBar from "./CustomScrollBar";
import CustomGaugeWithSparkBarAndLabel from "./customGaugeWithSparkBarAndLabel";
import _ from "lodash";
import '../common/css/App.css';
import CustomRecharts from "../common/CustomRecharts";
import {getSelectedGaugeData} from "../common/helper";

function GaugesStripeRenderer(allGaugesData) {
    const gaugesData = allGaugesData.gaugesData;
    const noOfGaugesInRow = allGaugesData.noOfGaugesInRow;

    let rechartModbusParameterIdentifier = "";
    let rechartGaugeData = {};
    const customRechartsRef = React.createRef();

    function onGaugePanelSelection(modbusParameterId) {
        let selectedGauge = getSelectedGaugeData(modbusParameterId,gaugesData,rechartGaugeData)
        customRechartsRef.current.onGaugeSelectionChange(modbusParameterId,selectedGauge);

        let element = document.getElementById(modbusParameterId);

        for (let i = 0; i < element.parentElement.childElementCount; i++) {
            let tempElement = element.parentElement.children[i];
            tempElement.style.border = '0px solid #d8d9da';
            tempElement.children[0].style.color = '#d8d9da';
        }

        element.style.border = '1px solid #7eb26d';
        element.children[0].style.color = "#33b5e5";
    }

    const allGauges = _.map(gaugesData, gaugeData => {
        const modbusParameterIdentifier = gaugeData.widgetData.modbusParameterIdentifier;
        let isGaugeSelected = false;

        if (!rechartModbusParameterIdentifier) { // scenario : default no selected
            rechartModbusParameterIdentifier = modbusParameterIdentifier;
            rechartGaugeData = gaugeData;
            isGaugeSelected = true;
        }

        return (
            <div id={modbusParameterIdentifier} onClick={() => onGaugePanelSelection(modbusParameterIdentifier)}
                 key={modbusParameterIdentifier}
                 style={{
                     height: "auto",
                     width: "212px",
                     margin: "1px",
                     border: isGaugeSelected ? "1px solid #7eb26d" : "0px solid #d8d9da",
                     cursor: "pointer"
                 }}
            >
                <div className="custom-gauge-header"
                     style={{color: isGaugeSelected ? "#33b5e5" : "#d8d9da"}}>
                    {gaugeData.widgetData.caption}
                </div>
                <CustomGaugeWithSparkBarAndLabel gaugeData={gaugeData}/>
            </div>
        );
    });

    let rowWiseGauges = {};
    let rowNo = 1;
    let counter = 1;
    _.map(allGauges, gaugeData => {
        if (counter > noOfGaugesInRow) {
            rowNo++;
            counter = 1;
        }
        if (!rowWiseGauges[rowNo]) {
            rowWiseGauges[rowNo] = [];
        }
        rowWiseGauges[rowNo].push(gaugeData);
        counter++;

    });

    const configuredGaugesInRow = _.map(rowWiseGauges, gaugeData => {
        return (
            <div style={{display: "flex", justifyContent: "space-around"}} key="gaugeRow">
                {gaugeData}
            </div>
        );
    });

    return (
        <Fragment>
            {configuredGaugesInRow}
            <div className="rechart-container">
                <CustomRecharts
                    ref={customRechartsRef}
                    rechartModbusParameterIdentifier={rechartModbusParameterIdentifier}
                    rechartGaugeData={rechartGaugeData}
                />
            </div>
        </Fragment>
    );
}

class GaugesStripe extends Component {

    constructor(props) {
        super(props);

        this.state = {
            element: this.props.element
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!_.isEqual(nextProps.element, prevState.element)) {
            return {element: nextProps.element};
        } else return null;
    }

    getGaugesDataFromState() {
        return this.state.element.configuration.body.data;
    }

    render() {
        const allGaugeData = this.getGaugesDataFromState();

        return (
            <CustomScrollBar height={"100%"} width={"auto"}>
                {GaugesStripeRenderer(allGaugeData)}
            </CustomScrollBar>
        );
    }
}

export default GaugesStripe;
