import React from "react";
import WidgetTypes from "../json/widgetTypes"
import CustomScrollBar from "../components/CustomScrollBar";
import {dimgray} from "color-name";

const SideBar = ({triggerSideBarClick}) => {

    return (
        <div style={{marginTop: "20px"}}>

            <div style={{marginBottom: "20px", marginLeft: "27px", marginRight: "50px"}}>
                <button onClick={() => triggerSideBarClick()}
                        className="btn btn--radius-right-0 navbar-button navbar-button--border-right-0">
                    <i className="fa fa-arrow-circle-left" style={{marginRight: "5px"}}/>
                    Dashboard Widgets
                </button>
            </div>

            <CustomScrollBar height={"585px"} width={"auto"}>
                <ul style={{paddingLeft: "30px", paddingRight: "30px"}}>
                    {
                        Object.keys(WidgetTypes).map((widgetKey, arrIndex) => {
                        const widgetType = WidgetTypes[widgetKey];

                        return (
                            <div key={widgetType.id} style={{padding: "5px", cursor: "pointer", userSelect: "none"}}
                                 className="droppable-element"
                                 draggable={true}
                                 unselectable="on"
                                 onDoubleClick={() => {}}
                                 onDragStart={e => {
                                     debugger
                                     e.dataTransfer.setData("widgetData", JSON.stringify(widgetType))
                                 }}
                                 data-widgetData={widgetType}
                            >
                                {
                                    widgetType.src
                                        ? <i className="fa fa-circle" style={{color: "dimgray"}}/>
                                        : null
                                }
                                <span style={{marginLeft: "10px"}}>{widgetType.name}</span>
                            </div>
                        );
                    })}
                </ul>
            </CustomScrollBar>
        </div>
    );
};

export default SideBar;
