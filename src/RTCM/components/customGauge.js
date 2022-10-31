import React, {Component} from "react";
import {buildStyles, CircularProgressbarWithChildren} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {Col} from "react-bootstrap";
import _ from "lodash";
import {checkValueStatus} from "../common/helper";

class CustomGauge extends Component {

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

    getPercentageData = (actualValue, outOfValue) => {
        return (actualValue / outOfValue) * 100;
    };

    render() {
        const {gaugeData} = this.state;
        // const color = "#2FE3FF"; // rgb(47, 227, 255)
        // const color = "#40E0D0"; // color name : turquoise
        let value = this.getPercentageData(gaugeData.widgetData.value, gaugeData.widgetData.maxValue);

        const startValue = gaugeData.widgetData.startValue;
        const endValue = gaugeData.widgetData.endValue;
        const hideMinValue = gaugeData.widgetData.hideMinValue;
        const hideMaxValue = gaugeData.widgetData.hideMaxValue;
        const actualValue = gaugeData.widgetData.value;
        const gaugeStatus = checkValueStatus(startValue,endValue,actualValue);
        const gaugeMinMaxStatus = checkValueStatus(hideMinValue,hideMaxValue,actualValue);

        value = isNaN(value) ? 0 : value;

        return (
            <Col style={{padding: 0}}>
                <div className="custom-circular-progressbar-container-center-text">
                    {
                        gaugeMinMaxStatus &&
                        ((gaugeStatus)?(<div>{gaugeData.widgetData.value}</div>):(<div style={{color:"red"}}>{gaugeData.widgetData.value}</div>))
                    }
                    <div>{gaugeData.widgetData.unit}</div>
                </div>
                <div style={{padding: "10px", height: 80, paddingTop: 0, paddingBottom: 0}}>
                    <CircularProgressbarWithChildren
                        value={value}
                        // text={`${gaugeData.value} / ${gaugeData.maxValue}`}
                        circleRatio={gaugeData.circleRatio}
                        strokeWidth={gaugeData.strokeWidth}
                        className="custom-circular-progressbar-container"
                        styles={buildStyles({
                            rotation: gaugeData.rotation,
                            strokeLinecap: gaugeData.strokeLinecap,
                            textSize: gaugeData.textSize,
                            textColor: gaugeData.textColor,
                            // pathColor: `rgba(47, 227, 255, ${value / 100})`,
                            pathColor: gaugeData.pathColor,
                            trailColor: gaugeData.trailColor,
                            // rotation: gaugeData.rotation
                        })}
                    />
                </div>
            </Col>
        )
    }
}

export default CustomGauge;
