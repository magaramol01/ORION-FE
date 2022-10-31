import React, {Component} from "react";
import {Col} from "react-bootstrap";
import CustomGauge from "./customGauge";
import _ from "lodash";
import {checkValueStatus} from "../common/helper";

class CustomGaugeWithSparkBarAndLabel extends Component {

    constructor(props) {
        super(props);

        this.state = {
            gaugeData: props.gaugeData
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!_.isEqual(nextProps.gaugeData, prevState.gaugeData)) {
            return {gaugeData: nextProps.gaugeData};
        } else return null;
    }

    render() {
        const gaugeData = {...this.state.gaugeData};
        const gaugeDataCopy = {...this.state.gaugeData};
        delete gaugeDataCopy["col1"];
        delete gaugeDataCopy["col2"];

        const col1 = gaugeData.col1.widgetData;
        const col2 = gaugeData.col2.widgetData;

        const col1Caption = col1.caption ? col1.caption : "";
        const col2Caption = col2.caption ? col2.caption : "";

        const col1startvalue = col1.startValue;
        const col1endvalue = col1.endValue;
        const col1minValue = col1.hideMinValue;
        const col1maxValue = col1.hideMaxValue;

        const col2startvalue = col2.startValue;
        const col2endvalue = col2.endValue;
        const col2minValue = col2.hideMinValue;
        const col2maxValue = col2.hideMaxValue;

        const col1status = checkValueStatus(col1startvalue,col1endvalue, col1.value);
        const col2status = checkValueStatus(col2startvalue,col2endvalue,col2.value);

        const col1MinMaxStatus = checkValueStatus(col1minValue, col1maxValue, col1.value);
        const col2MinMaxStatus = checkValueStatus(col2minValue, col2maxValue, col2.value);


        return (
            <Col style={{padding: 0}}>
                <div style={{padding: "0", display: "flex", justifyContent: "center"}}>
                    <CustomGauge gaugeData={gaugeDataCopy}/>
                </div>
                <div className="custom-gauge-data-separator">
                    <div className="item">
                        <div className="primary-data">
                            {
                                col1MinMaxStatus &&
                                ((col1status)?(<span>{col1.value} </span>):(<span style={{color:"red"}}>{col1.value} </span>))
                            }
                            <span style={{color: "#8e8e8e"}}>{col1.unit ? col1.unit : ""}</span>
                        </div>
                        <div className="secondary-data">{col1Caption}</div>
                    </div>
                    <div className="item">
                        <div className="primary-data">
                            {
                                col2MinMaxStatus &&
                                ((col2status)?(<span>{col2.value} </span>):(<span style={{color:"red"}}>{col2.value} </span>))
                            }
                            <span style={{color: "#8e8e8e"}}>{col2.unit ? col2.unit : ""}</span>
                        </div>
                        <div className="secondary-data">{col2Caption}</div>
                    </div>
                </div>
            </Col>
        )
    }
}

export default CustomGaugeWithSparkBarAndLabel;
