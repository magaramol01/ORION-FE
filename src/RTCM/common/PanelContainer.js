import React from 'react';

const PanelContainer = (props) => {
    const element = props.element;
    const elementLayout = element.layout;

    return (
        <div key={elementLayout.i} data-grid={elementLayout}>
            <div className="panel-container panel-container--absolute"/>
        </div>
    );
};

export default PanelContainer;
