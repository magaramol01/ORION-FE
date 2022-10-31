import * as React from "react";
import {Col, Row} from "react-bootstrap";
import CustomSparkBarChart from "../common/CustomSparkBarChart";
import {getItemFromLocalStorage, setItemInLocalStorage} from "../common/helper";

const blue = "rgb(87, 148, 242)";
const green = "rgb(115, 191, 105)";
const orange = "rgb(255, 152, 48)";
const red = "rgb(242, 73, 92)";

// this function can be moved to Utils so that everyone can access
function generateRandomNo(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// this function can be moved to Utils so that everyone can access
function getSparkLineData(key, latestValue) {
    let sparkLineDataArr = getItemFromLocalStorage(key);
    if (!sparkLineDataArr) {
        sparkLineDataArr = [];
    }
    if (sparkLineDataArr.length > 30) {
        sparkLineDataArr.shift();
    }
    sparkLineDataArr.push(latestValue);

    setItemInLocalStorage(key, JSON.stringify(sparkLineDataArr));

    return sparkLineDataArr;
}

class CustomBarGauge extends React.Component {

    constructor(props) {
        super(props);
        const barGaugeData = props.barGaugeData;

        this.state = {
            value: barGaugeData.value,
            outOfValue: barGaugeData.outOfValue,
            limitValue: barGaugeData.limitValue,
            unit: barGaugeData.unit,
            headerText: barGaugeData.headerText,
            sparkBarData: barGaugeData.sparkBarData
        };
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const updatedValue = nextProps.barGaugeData.value;
        if (this.state.value !== updatedValue) {
            this.setState({
                value: updatedValue
            });
        }
    }

    getBarValueColor = (barFillWidth) => {
        if (barFillWidth <= 20) {
            return blue;
        } else if (barFillWidth <= 40) {
            return green;
        } else if (barFillWidth <= 70) {
            return orange;
        } else {
            return red;
        }
    };

    getGradientColor = (barFillWidth) => {
        const bluePosition = " 10%";
        const greenPosition = " 30%";
        const orangePosition = " 60%";
        // const redPosition = " 75%";

        const degree = "90deg";
        const commaSeparator = ", ";

        if (barFillWidth <= 20) {
            return "linear-gradient(" + degree + commaSeparator + blue + commaSeparator + blue;
        } else if (barFillWidth <= 40) {
            return "linear-gradient(" + degree + commaSeparator + blue + commaSeparator + blue + bluePosition + commaSeparator + green;
        } else if (barFillWidth <= 70) {
            return "linear-gradient(" + degree + commaSeparator + blue + commaSeparator + blue + bluePosition + commaSeparator + green + greenPosition + commaSeparator + orange;
        } else {
            return "linear-gradient(" + degree + commaSeparator + blue + commaSeparator + blue + bluePosition + commaSeparator + green + greenPosition + commaSeparator + orange + orangePosition + commaSeparator + red;
        }
    };

    getBarFillWidth = () => {
        return ((this.state.value / this.state.outOfValue) * 100);
    };

    render() {
        const {value, headerText, unit} = this.state;
        const barFillWidth = this.getBarFillWidth();
        const gradientColor = this.getGradientColor(barFillWidth);
        const barValueColor = this.getBarValueColor(barFillWidth);
        const chartID = "1212212121"; // ideally this should be unique and id should come in spark bar data object

        const sparkLineData = getSparkLineData("customBar-" + headerText, generateRandomNo(1, 20));

        return (
            <div style={{display: 'flex', width: '100%', height: '48px'}}>
                <div style={{display: 'flex', overflow: 'hidden', width: 'inherit', flexDirection: 'column'}}>
                    <Row className="bar-gauge-wrapper">
                        <Col lg="auto" className="bar-gauge__value">
                            <div style={{color: barValueColor}}>
                                <span>{value}</span>
                                <span style={{fontSize: '18px'}}> {unit} </span>
                            </div>
                        </Col>
                        <Col lg="auto" className="bar-gauge__spark-bar">
                            <CustomSparkBarChart chartId={chartID} sparkLineData={sparkLineData}/>
                        </Col>
                        <Col style={{paddingRight: 0}}>
                            <div className="bar-gauge-header-wrapper">
                                <div className="bar-gauge-header-ellipsis">
                                    {headerText}
                                </div>
                            </div>
                            <div className="bar-gauge-filler-wrapper">
                                <div className="bar-gauge-fill" style={{width: barFillWidth + "%", background: gradientColor}}/>
                                <div className="bar-gauge-non-fill"/>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        );

    }
}

export default CustomBarGauge;
