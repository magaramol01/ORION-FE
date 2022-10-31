import React, {Component} from "react";
import {RadialGauge} from "react-canvas-gauges";
import _ from "lodash";

class CanvasGauge1 extends Component {

    constructor(props) {
        super(props);

        this.state = {
            gaugeData: this.props.gaugeData
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!_.isEqual(nextProps.gaugeData, prevState.gaugeData)) {
            return {gaugeData: nextProps.gaugeData};
        } else return null;
    }

    render() {
        let gaugeData = this.state.gaugeData;
        if (gaugeData.value === " ") {
            gaugeData.value = 0;
        }

        return (
            <RadialGauge {...gaugeData}/>
        );
    }
}

export default CanvasGauge1;
