import React from "react";

class WidgetHeader extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="panel-header grid-drag-handle">
                <div className="panel-title-container" aria-label="Panel header title item server requests">
                    <div className="panel-title">
                        <span className="icon-gf panel-alert-icon"/>
                        <span className="panel-title-text">
                            {this.props.headerText}
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

export default WidgetHeader;
