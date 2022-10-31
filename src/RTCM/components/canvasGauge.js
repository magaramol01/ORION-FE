import React, {Component} from "react";
import {RadialGauge} from "react-canvas-gauges";

class CanvasGauge extends Component {

    constructor(props) {
        super(props);

        this.state = {
            element: this.props.element,
            gaugeData: this.props.element.configuration.body.gaugeData,
            value: this.props.element.configuration.body.gaugeData.value
        };
        this.startTimer = this.startTimer.bind(this);
        this.stopTimer = this.stopTimer.bind(this);
    }

    startTimer() {
        this.timer = setInterval(() => this.setState({
            value: Math.round(Math.random() * 500)
        }), 1000);
    }

    stopTimer() {
        clearInterval(this.timer);
    }

    componentDidMount() {
        this.startTimer();
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    /*render() {
        const gaugeData = this.state.gaugeData;

        return (
            <RadialGauge
                startAngle={gaugeData.startAngle}
                ticksAngle={gaugeData.ticksAngle}
                width={gaugeData.width}
                height={gaugeData.height}
                value={this.state.value}
                units={gaugeData.units}
                title={gaugeData.title}
                valueBox={gaugeData.valueBox}
                minValue={gaugeData.minValue}
                maxValue={gaugeData.maxValue}
                majorTicks={gaugeData.majorTicks}
                minorTicks={gaugeData.minorTicks}
                strokeTicks={gaugeData.strokeTicks}
                ticksWidth={gaugeData.ticksWidth}
                ticksWidthMinor={gaugeData.ticksWidthMinor}
                highlights={gaugeData.highlights}
                colorMajorTicks={gaugeData.colorMajorTicks}
                colorMinorTicks={gaugeData.colorMinorTicks}
                colorTitle={gaugeData.colorTitle}
                colorUnits={gaugeData.colorUnits}
                colorNumbers={gaugeData.colorNumbers}
                colorPlate={gaugeData.colorPlate}
                // colorPlateEnd={gaugeData.colorPlateEnd}
                borderShadowWidth={gaugeData.borderShadowWidth}
                borders={gaugeData.borders}
                // borderRadius={gaugeData.borderRadius}
                needleType={gaugeData.needleType}
                needleWidth={gaugeData.needleWidth}
                needleCircleSize={gaugeData.needleCircleSize}
                animationDuration={gaugeData.animationDuration}
                needleCircleOuter={gaugeData.needleCircleOuter}
                needleCircleInner={gaugeData.needleCircleInner}
                animationRule={gaugeData.animationRule}
                colorValueBoxBackground={gaugeData.colorValueBoxBackground}
                colorValueText={gaugeData.colorValueText}
                fontValue={gaugeData.fontValue}
                fontNumbersSize={gaugeData.fontNumbersSize}
                fontUnitsSize={gaugeData.fontUnitsSize}
                fontValueSize={gaugeData.fontValueSize}
                // animatedValue={gaugeData.animatedValue}
                // colorNeedle={gaugeData.colorNeedle}
                // colorNeedleEnd={gaugeData.colorNeedleEnd}
                colorBarProgress={gaugeData.colorBarProgress}
                colorBar={gaugeData.colorBar}
                // barStroke={gaugeData.barStroke}
                barWidth={gaugeData.barWidth}
                // barBeginCircle={gaugeData.barBeginCircle}
            >
            </RadialGauge>
        );
    }*/

    render() {
        return (
            <RadialGauge {...this.state.gaugeData}/>
        );
    }
}

export default CanvasGauge;

/*return           /   <div style={{border: "1px solid red", height: "100%"}}>
                <GridLayout className="layout"
                            style={{background: "#ddd"}}>
                    <div style={{background: "white"}} key="a" data-grid={{x: 0, y: 0, w: 1, h: 2, static: true}}>
                        <RadialGauge
                            renderTo='canvas-id'
                            width={300}
                            height={300}
                            units="Km/h"
                            minValue={0}
                            maxValue={220}
                            majorTicks={["0", "20", "40", "60", "80", "100", "120", "140", "160", "180", "200", "220"]}
                            minorTicks={2}
                            // strokeTicks:{true}
                            highlights='[ {"from": 0, "to": 20, "color": "rgba(0,0, 255, .3)"},
                            {"from": 100, "to": 150, "color": "rgba(255, 0, 0, .3)"} ]'
                            colorPlate="#fff"
                            borderShadowWidth={0}
                            borders={false}
                            needleType="arrow"
                            needleWidth={2}
                            needleCircleSize={7}
                            needleCircleOuter={true}
                            needleCircleInner={false}
                            animationDuration={1500}
                            animationRule="linear"
                        >
                        </RadialGauge>
                        <RadialGauge
                            width="1500"
                            height="400"
                            units="°C"
                            title="Temperature"
                            min-value="-500"
                            max-value="50"
                            major-ticks="[-50,-40,-30,-20,-10,0,10,20,30,40,50]"
                            minor-ticks="5"
                            stroke-ticks="true"
                            ticks-width="15"
                            ticks-width-minor="7.5"
                            highlights='[ {"from": -50, "to": 0, "color": "rgba(0,0, 255, .3)"},
    {"from": 0, "to": 50, "color": "rgba(255, 0, 0, .3)"} ]'
                            color-major-ticks="#ffe66a"
                            color-minor-ticks="#ffe66a"
                            color-title="#eee"
                            color-units="#ccc"
                            color-numbers="#eee"
                            color-plate="#2465c0"
                            color-plate-end="#327ac0"
                            border-shadow-width="0"
                            borders="false"
                            border-radius="10"
                            needle-type="arrow"
                            needle-width="3"
                            animation-duration="250"
                            animation-rule="linear"
                            animated-value="true"
                            color-needle="#222"
                            color-needle-end=""
                            color-bar-progress="#327ac0"
                            color-bar="#f5f5f5"
                            bar-stroke="0"
                            bar-width="8"
                            bar-begin-circle="false"
                        >
                        </RadialGauge>
                    </div>
                </GridLayout>
            </div>
        );*/


{/*
<RadialGauge
    renderTo={gaugeData.renderTo}
    width={gaugeData.width}
    height={gaugeData.height}
    units={gaugeData.units}
    minValue={gaugeData.minValue}
    maxValue={gaugeData.maxValue}
    // majorTicks={gaugeData.majorTicks}
    // minorTicks={gaugeData.minorTicks}
    // strokeTicks:{gaugeData.strokeTicks}
    // highlights={gaugeData.highlights}
    // colorPlate={gaugeData.colorPlate}
    borderShadowWidth={gaugeData.borderShadowWidth}
    borders={gaugeData.borders}
    needleType={gaugeData.needleType}
    needleWidth={gaugeData.needleWidth}
    needleCircleSize={gaugeData.needleCircleSize}
    needleCircleOuter={gaugeData.needleCircleOuter}
    needleCircleInner={gaugeData.needleCircleInner}
    animationDuration={gaugeData.animationDuration}
    animationRule={gaugeData.animationRule}
>
</RadialGauge>*/
}
