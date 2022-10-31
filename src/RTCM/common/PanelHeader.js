import React from 'react';

const PanelHeader = (props) => {
    const element = props.element;
    const elementLayout = element.layout;

    return (
        <div className="panel-header grid-drag-handle">
            <div className="panel-title-container" aria-label="Panel header title item server requests">
                <div className="panel-title">
                    <span className="icon-gf panel-alert-icon"/>
                    <span className="panel-title-text">
                                {element.configuration.headerText}
                        <span className="fa fa-caret-down panel-menu-toggle"/>
                            </span>
                </div>
            </div>
        </div>
    );
};

export default PanelHeader;
