import React from "react";
import {Image} from "react-bootstrap";
import SingleGaugePanelSrc from "../common/images/single-gauge.png";
import SingleGaugeLeftPanelSrc from "../common/images/gauge-left-panel.png";
import SingleGaugeRightPanelSrc from "../common/images/gauge-right-panel.png";
import CustomScrollBar from "./CustomScrollBar";
import _ from "lodash";

class SingleGaugeCylinderWidget extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            element: props.element
        };

        this.blankRow = this.blankRow.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!_.isEqual(nextProps.element, prevState.element)) {
            return {element: nextProps.element};
        } else return null;
    }

    blankRow = (styleObj) => {
        return (
            <tr style={styleObj.trStyle}>
                <td style={styleObj.tdStyle}> &nbsp; </td>
            </tr>
        );
    };

    getGaugesCylinderHeaderRenderer = (headerData) => {
        return (
            <div style={{display: "flex", marginLeft: 0, marginRight: '-90px'}}> {/*, marginRight: '-2px'*/}
                <div style={{height: '400px', width: '140px'}}/>
                <div style={{position: "absolute"}}>
                    <table id="singleCylinderWidgetId" className="single-cylinder-table">
                        <tbody>
                        {this.blankRow({trStyle: {}, tdStyle: {height: '30px'}})}
                        <tr>
                            <td className="single-cylinder-blank-panel-caption">
                                <div className="single-cylinder-table-data-normal"> {headerData.value1} </div>
                            </td>
                        </tr>
                        <tr>
                            <td className="single-cylinder-blank-panel-caption">
                                <div className="single-cylinder-table-data-normal"> {headerData.value2} </div>
                            </td>
                        </tr>
                        {this.blankRow({trStyle: {height: '25px'}, tdStyle: {}})}
                        <tr>
                            <td className="single-cylinder-blank-panel-caption">
                                <div className="single-cylinder-table-data-normal"> {headerData.value3} </div>
                            </td>
                        </tr>
                        <tr>
                            <td className="single-cylinder-blank-panel-caption">
                                <div className="single-cylinder-table-data-normal"> {headerData.value4} </div>
                            </td>
                        </tr>
                        {this.blankRow({trStyle: {height: '25px'}, tdStyle: {}})}
                        <tr>
                            <td className="single-cylinder-blank-panel-caption">
                                <div className="single-cylinder-table-data-normal"> {headerData.value5} </div>
                            </td>
                        </tr>
                        <tr>
                            <td className="single-cylinder-blank-panel-caption">
                                <div className="single-cylinder-table-data-normal"> {headerData.value6} </div>
                            </td>
                        </tr>
                        <tr>
                            <td className="single-cylinder-blank-panel-caption">
                                <div className="single-cylinder-table-data-normal"> {headerData.value7} </div>
                            </td>
                        </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    getCylinderRenderer = (i, tableData) => {
        const isFirstCylinder = i === 0;
        const defaultValue = "0";

        // random red dighlighting temporary logic
        let firstRow = "";
        let secondRow = "";
        let thirdRow = "";
        let fourthRow = "";
        let fifthRow = "";
        let sixthRow = "";
        let seventhRow = "";

        if (i === 0) {
            firstRow = "single-cylinder-table-data-normal";
            secondRow = "single-cylinder-table-data-normal";
            thirdRow = "single-cylinder-table-data-danger";
            fourthRow = "single-cylinder-table-data-normal";
            fifthRow = "single-cylinder-table-data-normal";
            sixthRow = "single-cylinder-table-data-danger";
            seventhRow = "single-cylinder-table-data-normal";
        } else if (i === 1) {
            firstRow = "single-cylinder-table-data-danger";
            secondRow = "single-cylinder-table-data-normal";
            thirdRow = "single-cylinder-table-data-normal";
            fourthRow = "single-cylinder-table-data-danger";
            fifthRow = "single-cylinder-table-data-normal";
            sixthRow = "single-cylinder-table-data-normal";
            seventhRow = "single-cylinder-table-data-danger";
        } else if (i === 2) {
            firstRow = "single-cylinder-table-data-normal";
            secondRow = "single-cylinder-table-data-normal";
            thirdRow = "single-cylinder-table-data-normal";
            fourthRow = "single-cylinder-table-data-normal";
            fifthRow = "single-cylinder-table-data-normal";
            sixthRow = "single-cylinder-table-data-normal";
            seventhRow = "single-cylinder-table-data-normal";
        } else if (i === 3) {
            firstRow = "single-cylinder-table-data-normal";
            secondRow = "single-cylinder-table-data-danger";
            thirdRow = "single-cylinder-table-data-normal";
            fourthRow = "single-cylinder-table-data-normal";
            fifthRow = "single-cylinder-table-data-danger";
            sixthRow = "single-cylinder-table-data-normal";
            seventhRow = "single-cylinder-table-data-normal";
        } else if (i === 4) {
            firstRow = "single-cylinder-table-data-normal";
            secondRow = "single-cylinder-table-data-normal";
            thirdRow = "single-cylinder-table-data-normal";
            fourthRow = "single-cylinder-table-data-danger";
            fifthRow = "single-cylinder-table-data-normal";
            sixthRow = "single-cylinder-table-data-normal";
            seventhRow = "single-cylinder-table-data-normal";
        } else if (i === 5) {
            firstRow = "single-cylinder-table-data-normal";
            secondRow = "single-cylinder-table-data-danger";
            thirdRow = "single-cylinder-table-data-normal";
            fourthRow = "single-cylinder-table-data-normal";
            fifthRow = "single-cylinder-table-data-normal";
            sixthRow = "single-cylinder-table-data-normal";
            seventhRow = "single-cylinder-table-data-danger";
        } else if (i === 6) {
            firstRow = "single-cylinder-table-data-normal";
            secondRow = "single-cylinder-table-data-normal";
            thirdRow = "single-cylinder-table-data-normal";
            fourthRow = "single-cylinder-table-data-normal";
            fifthRow = "single-cylinder-table-data-normal";
            sixthRow = "single-cylinder-table-data-normal";
            seventhRow = "single-cylinder-table-data-normal";
        } else if (i === 7) {
            firstRow = "single-cylinder-table-data-normal";
            secondRow = "single-cylinder-table-data-normal";
            thirdRow = "single-cylinder-table-data-normal";
            fourthRow = "single-cylinder-table-data-normal";
            fifthRow = "single-cylinder-table-data-normal";
            sixthRow = "single-cylinder-table-data-normal";
            seventhRow = "single-cylinder-table-data-normal";
        }

        return (
            <div style={{display: "flex", marginLeft: isFirstCylinder ? 0 : '0px', paddingTop: '15px'}} key={i}>
                <Image src={SingleGaugePanelSrc} style={{height: '400px'}}/>
                <div style={{position: "absolute"}}>
                    <table id="singleCylinderWidgetId" className="single-cylinder-table" style={{marginLeft: 0}}>
                        <tbody>
                        <tr>
                            <td className="single-cylinder-caption"> <div style={{marginTop: '-13px', color: "#33b5e5"}}> No {i + 1} </div> </td>
                        </tr>
                        {this.blankRow({trStyle: {}, tdStyle: {lineHeight: '10px'}})}
                        <tr>
                            <td className="single-cylinder-table-data"> <div className={firstRow}> <span className="exh_gas_out_temp1"> {tableData ? tableData.value1 : defaultValue} </span> °C </div> </td>
                        </tr>
                        <tr>
                            <td className="single-cylinder-table-data"> <div className={secondRow}> <span className="exh_gas_out_dev1"> {tableData ? tableData.value2 : defaultValue} </span> °C </div> </td>
                        </tr>
                        {this.blankRow({trStyle: {height: '25px'}, tdStyle: {}})}
                        <tr>
                            <td className="single-cylinder-table-data"> <div className={thirdRow}> <span className="cw_outlet_temp_1"> {tableData ? tableData.value3 : defaultValue} </span> °C </div> </td>
                        </tr>
                        <tr>
                            <td className="single-cylinder-table-data"> <div className={fourthRow}> <span className="linear_wall_exh_temp1"> {tableData ? tableData.value4 : defaultValue} </span> °C </div> </td>
                        </tr>
                        {this.blankRow({trStyle: {height: '25px'}, tdStyle: {}})}
                        <tr>
                            <td className="single-cylinder-table-data"> <div className={fifthRow}> <span className="cyl_linear_wall1"> {tableData ? tableData.value5 : defaultValue} </span> °C </div> </td>
                        </tr>
                        <tr>
                            <td className="single-cylinder-table-data"> <div className={sixthRow}> <span className="cw_outlet_temp1"> {tableData ? tableData.value6 : defaultValue} </span> °C </div> </td>
                        </tr>
                        <tr>
                            <td className="single-cylinder-table-data"> <div className={seventhRow}> <span className="scav_air_temp1"> {tableData ? tableData.value7 : defaultValue} </span> °C </div> </td>
                        </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    getGaugesCylinderHeaderData = () => {
        const element = this.state.element;
        const data = element.configuration.body.data;

        if (data) {
            return data.captions;
        }
    };

    getGaugesCylinderData = () => {
        const element = this.state.element;
        const data = _.clone(element.configuration.body.data);

        if (data) {
            delete data["captions"];
            return data;
        } else {
            let gaugesCylinderData = {};
            const noOfCylinders = element.configuration.body.configuration.noOfCylinders;
            for (let i = 0; i < noOfCylinders; i++) {
                gaugesCylinderData["cyl" + (i + 1)] = null;
            }
            return gaugesCylinderData;
        }
    };

    render() {
        const gaugesCylinderHeaderData = this.getGaugesCylinderHeaderData();
        const gaugesCylinderData = this.getGaugesCylinderData();
        if (!gaugesCylinderData) {
            return null;
        }

        return (
            <CustomScrollBar height={"100%"} width={"100%"}>
            <div style={{display: "flex", backgroundColor: 'black'}}>

                {/* BLANK PANEL RENDERING */}
                {this.getGaugesCylinderHeaderRenderer(gaugesCylinderHeaderData)}

                {/* LEFT PANEL RENDERING */}
                <div style={{display: "flex", marginRight: '-2px', paddingTop: '15px'}}>
                    <Image src={SingleGaugeLeftPanelSrc} style={{height: '400px'}}/>
                    <div style={{position: "absolute"}}>

                    </div>
                </div>

                {/* CYLINDER RENDERING */}
                {
                    Object.keys(gaugesCylinderData).map((obj, i) => {
                        return (
                            this.getCylinderRenderer(i, gaugesCylinderData[obj])
                        );
                    })
                }

                {/* RIGHT PANEL RENDERING */}
                <div style={{display: "flex", paddingTop: '15px'}}>
                    <Image src={SingleGaugeRightPanelSrc} style={{height: '398px'}}/>
                    <div style={{position: "absolute"}}>

                    </div>
                </div>

            </div>
            </CustomScrollBar>
        );
    }
}

export default SingleGaugeCylinderWidget;
