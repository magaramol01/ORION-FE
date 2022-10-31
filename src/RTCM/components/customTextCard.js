import React, {Component} from "react";
import CanvasGauge from "./canvasGauge";
import CanvasGaugeJsonData from "../json/gaugeData";

class CustomTextCard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            containerHeight: this.props.height,
            containerWidth: this.props.width,
            carouselIndex: 0
        };
    }

    render() {

        return (
            <div style={{height: this.state.containerHeight, width: this.state.containerWidth}}>

                    <div className="panel-header grid-drag-handle">
                        <div className="panel-title-container" aria-label="Panel header title item server requests">
                            <div className="panel-title">
                                <span className="icon-gf panel-alert-icon"/>
                                <span className="panel-title-text">
                                    Unit
                                </span>
                            </div>
                        </div>
                    </div>
                    {/*<div style={{textAlign: "center"}}>
                        Unit {i}
                    </div>*/}
                    {/*<div className="panel-content">
                        <div className="panel-height-helper">
                            <CanvasGauge gaugeData={CanvasGaugeJsonData["gauge1"]}/>
                        </div>
                    </div>*/}
                    <div style={{textAlign: "center", padding: "8px"}}>
                        Main Engine
                    </div>
            </div>
        );
    }
}

export default CustomTextCard;
