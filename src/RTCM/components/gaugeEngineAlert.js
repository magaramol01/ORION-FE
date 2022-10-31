import React, {Component} from "react";
import CustomScrollBar from "./CustomScrollBar";

function renderCriticalAlert(props) {
    return (
        <div className="alert-rule-item__text alert-state-critical">
            <i className="fa fa-exclamation-triangle"/>
            <span className="alert-state-text">ALERTING</span>
            <span className="alert-rule-item__time"> 2 minutes ago </span>
        </div>
    );
}

function renderWarningAlert(props) {
    return (
        <div className="alert-rule-item__text alert-state-warning">
            <i className="fa fa-exclamation-triangle"/>
            <span className="alert-state-text">WARNING</span>
            <span className="alert-rule-item__time"> 30 seconds ago </span>
        </div>
    );
}

function renderOkAlert(props) {
    return (
        <div className="alert-rule-item__text alert-state-ok">
            <i className="fa fa-exclamation-triangle"/>
            <span className="alert-state-text">OK</span>
            <span className="alert-rule-item__time"> 1 minutes ago </span>
        </div>
    );
}

function renderNeutralAlert(props) {

}

class GaugeEngineAlert extends Component {

    constructor(props) {
        super(props);

        this.state = {
            containerHeight: this.props.height,
            containerWidth: this.props.width,
            alerts: props.element.configuration.body.alertData
        };

        this.getAlertTypeRenderer = this.getAlertTypeRenderer.bind(this);
    }

    getAlertTypeRenderer = (alertType) => {
        if (alertType === "critical") {
            return renderCriticalAlert();
        } else if (alertType === "warning") {
            return renderWarningAlert();
        } else if (alertType === "ok") {
            return renderOkAlert();
        } else if (alertType === "neutral") {
            return renderNeutralAlert();
        }
    };

    render() {

        return (
            <div style={{background: "rgb(33, 33, 36)"}}>
                <CustomScrollBar height={"230px"} width={"auto"}>
                    {
                        this.state.alerts.map((alertObj, i) => {
                            return (
                                <div className="acc-list-item" style={{margin: "2px"}} key={i}>
                                    <div className="acc-list-link alert-rule-item__body">
                                        <div className="alert-rule-item__header">
                                            <p className="alert-rule-item__name">
                                                <span>{alertObj.alert}</span>
                                            </p>
                                            {this.getAlertTypeRenderer(alertObj.type)}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    }
                </CustomScrollBar>
            </div>

        );
    }
}

export default GaugeEngineAlert;
