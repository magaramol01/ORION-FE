import * as React from "react";
import {Col, Row} from "react-bootstrap";

const blue = "rgb(87, 148, 242)";
const green = "rgb(115, 191, 105)";
const orange = "rgb(255, 152, 48)";
const red = "rgb(242, 73, 92)";

class BarGauge extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            value: 69,
            outOfValue: 100,
            unit: "°C",
            headerText: "Custom"
        };
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
        /*
        100% = 680 = 0 68 204 407 last
        95% = 645 = 0 68 204 407 last
        80% = 546 = 0 68 204 407 last
        76% = 519 = 0 68 204 407 last
        72% = 490 = 0 68 204 407 last
        69% = 470 = 0 68 204 last
        63% = 430 = 0 68 204 last
        59% = 398 = 0 68 204 last
        49% = 333 = 0 68 204 last
        45% = 308 = 0 68 204 last
        39% = 262 = 0 68 last
        26% = 178 = 0 68 last
        23% = 153 = 0 68 last
        18% = 123 = 0 last
        4.7% = 32 = 0 last

        0-20-40-70-100
        0 68 204 407
        10-30-60
        */

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

        const barFillWidth = this.getBarFillWidth();
        const gradientColor = this.getGradientColor(barFillWidth);
        const barValueColor = this.getBarValueColor(barFillWidth);

        return (
            <div style={{display: 'flex', flexDirection: 'column'}}>

                <div style={{display: 'flex', marginBottom: '10px', width: '100%', height: '57.2px'}}>
                    <div style={{display: 'flex', overflow: 'hidden', width: 'inherit', flexDirection: 'column'}}>
                        <div className="bar-gauge-header-wrapper">{this.state.headerText}</div>
                        <Row fluid className="bar-gauge-wrapper">
                            <Col lg="auto" style={{width: "115px"}} className="bar-gauge__value">
                                <div style={{color: barValueColor}}>
                                    <span>{this.state.value}</span>
                                    <span style={{fontSize: '18px'}}> {this.state.unit} </span>
                                </div>
                            </Col>
                            <Col className="bar-gauge-filler-wrapper">
                                <div className="bar-gauge-fill" style={{width: barFillWidth + "%", background: gradientColor}}/>
                                <div className="bar-gauge-non-fill" />
                            </Col>
                        </Row>
                    </div>
                </div>

            </div>
        );

    }
}

export default BarGauge;
