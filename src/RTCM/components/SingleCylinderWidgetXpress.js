import React, {Fragment} from "react";
import {Card, Col, Image, Row} from "react-bootstrap";
import SingleCylinderSrc from "../common/images/SignleCroppedCylinder.png";
import SingleCylinderBlankPanelSrc from "../common/images/BlankPanel.png";
import SingleCylinderLeftPanelSrc from "../common/images/LeftPanel.png";
import SingleCylinderRightPanelSrc from "../common/images/RightPanel.png";
import cropped from '../common/images/croped.png';
import CustomScrollBar from "./CustomScrollBar";
import _ from "lodash";

class SingleCylinderWidget extends React.Component {

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

    getCylinderHeaderRenderer = (headerData) => {
        return (
            <div style={{display: "flex", marginLeft: 0, marginRight: '160px'}}>
                <Image src={SingleCylinderBlankPanelSrc} style={{height: '440px'}}/>
                <div style={{position: "absolute"}}>
                    <table id="singleCylinderWidgetId" className="single-cylinder-table" style={{width:"260px"}}>
                        <tbody>
                        {this.blankRow({trStyle: {}, tdStyle: {height: '20px'}})}
                        {/*<tr>*/}
                        {/*    <td className="single-cylinder-blank-panel-caption">*/}
                        {/*        <div*/}
                        {/*            className="single-cylinder-table-data-normal"> {headerData.value1.widgetData.caption} </div>*/}
                        {/*    </td>*/}
                        {/*</tr>*/}
                        {this.blankRow({trStyle: {}, tdStyle: {height: '20px'}})}
                        {/*<tr>*/}
                        {/*    <td className="single-cylinder-blank-panel-caption">*/}
                        {/*        <div*/}
                        {/*            className="single-cylinder-table-data-normal"> {headerData.value2.widgetData.caption} </div>*/}
                        {/*    </td>*/}
                        {/*</tr>*/}
                        {this.blankRow({trStyle: {}, tdStyle: {height: '20px'}})}
                        {this.blankRow({trStyle: {height: '63px'}, tdStyle: {}})}
                        <tr>
                            <td className="single-cylinder-caption">
                                <div className="single-cylinder-caption-text"></div>
                            </td>
                        </tr>
                        {this.blankRow({trStyle: {}, tdStyle: {lineHeight: '6px'}})}
                        <tr>
                            <td className="single-cylinder-blank-panel-caption">
                                <div
                                    className="single-cylinder-table-data-normal"> {headerData.value1.widgetData.caption} </div>
                            </td>
                        </tr>
                        {/*<tr>*/}
                        {/*    <td className="single-cylinder-blank-panel-caption">*/}
                        {/*        <div*/}
                        {/*            className="single-cylinder-table-data-normal"> {headerData.value4.widgetData.caption} </div>*/}
                        {/*    </td>*/}
                        {/*</tr>*/}
                        {this.blankRow({trStyle: {height: '15px'}, tdStyle: {}})}
                        <tr>
                            <td className="single-cylinder-blank-panel-caption">
                                <div
                                    className="single-cylinder-table-data-normal"> {headerData.value2.widgetData.caption} </div>
                            </td>
                        </tr>
                        {/*<tr>*/}
                        {/*    <td className="single-cylinder-blank-panel-caption">*/}
                        {/*        <div*/}
                        {/*            className="single-cylinder-table-data-normal"> {headerData.value6.widgetData.caption} </div>*/}
                        {/*    </td>*/}
                        {/*</tr>*/}
                        {this.blankRow({trStyle: {height: '15px'}, tdStyle: {}})}
                        <tr>
                            <td className="single-cylinder-blank-panel-caption">
                                <div
                                    className="single-cylinder-table-data-normal"> {headerData.value3.widgetData.caption} </div>
                            </td>
                        </tr>
                        {/*<tr>*/}
                        {/*    <td className="single-cylinder-blank-panel-caption">*/}
                        {/*        <div*/}
                        {/*            className="single-cylinder-table-data-normal"> {headerData.value8.widgetData.caption} </div>*/}
                        {/*    </td>*/}
                        {/*</tr>*/}
                        {this.blankRow({trStyle: {height: '15px'}, tdStyle: {}})}
                        <tr>
                            <td className="single-cylinder-blank-panel-caption">
                                <div
                                    className="single-cylinder-table-data-normal"> {headerData.value4.widgetData.caption} </div>
                            </td>
                        </tr>
                        {this.blankRow({trStyle: {height: '22px'}, tdStyle: {}})}
                        {/*<tr>*/}
                        {/*    <td className="single-cylinder-blank-panel-caption">*/}
                        {/*        <div*/}
                        {/*            className="single-cylinder-table-data-normal"> {headerData.value10.widgetData.caption} </div>*/}
                        {/*    </td>*/}
                        {/*</tr>*/}
                        {this.blankRow({trStyle: {height: '22px'}, tdStyle: {}})}
                        {this.blankRow({trStyle: {}, tdStyle: {}})}
                        {/*<tr>*/}
                        {/*    <td className="single-cylinder-blank-panel-caption">*/}
                        {/*        <div*/}
                        {/*            className="single-cylinder-table-data-normal"> {headerData.value11.widgetData.caption} </div>*/}
                        {/*    </td>*/}
                        {/*</tr>*/}
                        {this.blankRow({trStyle: {}, tdStyle: {}})}
                        {this.blankRow({trStyle: {height: '17px'}, tdStyle: {}})}
                        {/*<tr>*/}
                        {/*    <td className="single-cylinder-blank-panel-caption">*/}
                        {/*        <div*/}
                        {/*            className="single-cylinder-table-data-normal"> {headerData.value12.widgetData.caption} </div>*/}
                        {/*    </td>*/}
                        {/*</tr>*/}
                        {this.blankRow({trStyle: {height: '17px'}, tdStyle: {}})}
                        {/*<tr>*/}
                        {/*    <td className="single-cylinder-blank-panel-caption">*/}
                        {/*        <div*/}
                        {/*            className="single-cylinder-table-data-normal"> {headerData.value13.widgetData.caption} </div>*/}
                        {/*    </td>*/}
                        {/*</tr>*/}
                        {this.blankRow({trStyle: {}, tdStyle: {}})}
                        {this.blankRow({trStyle: {}, tdStyle: {}})}
                        {/*<tr>*/}
                        {/*    <td className="single-cylinder-blank-panel-caption">*/}
                        {/*        <div*/}
                        {/*            className="single-cylinder-table-data-normal"> {headerData.value14.widgetData.caption} </div>*/}
                        {/*    </td>*/}
                        {/*</tr>*/}
                        {this.blankRow({trStyle: {}, tdStyle: {}})}
                        {this.blankRow({trStyle: {}, tdStyle: {}})}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    getCylinderPropellerRenderer = (propellerData, tableData) => {
        const tableOneTwo = {...tableData};
        const value1WidgetData = propellerData.value1.widgetData;
        const value2WidgetData = propellerData.value2.widgetData;
        const value3WidgetData = propellerData.value3.widgetData;
        const value4WidgetData = propellerData.value4.widgetData;
        const value5WidgetData = propellerData.value5.widgetData;
        const value6WidgetData = propellerData.value6.widgetData;

        let value1Caption = value1WidgetData.caption;
        value1Caption = value1Caption ? value1Caption : "";
        let value1Unit = value1WidgetData.unit;
        value1Unit = value1WidgetData.unit ? value1WidgetData.unit : "";
        let value1Value = value1WidgetData.value;
        value1Value = value1WidgetData.value ? value1WidgetData.value : "";

        let value2Caption = value2WidgetData.caption;
        value2Caption = value2Caption ? value2Caption : "";
        let value2Unit = value2WidgetData.unit;
        value2Unit = value2WidgetData.unit ? value2WidgetData.unit : "";
        let value2Value = value2WidgetData.value;
        value2Value = value2WidgetData.value ? value2WidgetData.value : "";

        let value3Caption = value3WidgetData.caption;
        value3Caption = value3Caption ? value3Caption : "";
        let value3Unit = value3WidgetData.unit;
        value3Unit = value3WidgetData.unit ? value3WidgetData.unit : "";
        let value3Value = value3WidgetData.value;
        value3Value = value3WidgetData.value ? value3WidgetData.value : "";

        let value4Caption = value4WidgetData.caption;
        value4Caption = value4Caption ? value4Caption : "";
        let value4Unit = value4WidgetData.unit;
        value4Unit = value4WidgetData.unit ? value4WidgetData.unit : "";
        let value4Value = value4WidgetData.value;
        value4Value = value4WidgetData.value ? value4WidgetData.value : "";

        let value5Caption = value5WidgetData.caption;
        value5Caption = value5Caption ? value5Caption : "";
        let value5Unit = value5WidgetData.unit;
        value5Unit = value5WidgetData.unit ? value5WidgetData.unit : "";
        let value5Value = value5WidgetData.value;
        value5Value = value5WidgetData.value ? value5WidgetData.value : "";

        let value6Caption = value6WidgetData.caption;
        value6Caption = value6Caption ? value6Caption : "";
        let value6Unit = value6WidgetData.unit;
        value6Unit = value6WidgetData.unit ? value6WidgetData.unit : "";
        let value6Value = value6WidgetData.value;
        value6Value = value6WidgetData.value ? value6WidgetData.value : "";

        return (
            <div style={{display: "flex", marginLeft: '-14px'}}>
                <Image src={SingleCylinderRightPanelSrc} style={{height: '440px'}}/>

                <div style={{position: 'absolute', marginTop: '330px', marginLeft: '310px'}}>
                    <Image src={cropped} style={{height: '60px', width: '60px'}}/>
                </div>

                <div style={{width: '200px', marginLeft: '-200px', marginTop: '320px', textAlign: "center"}}>
                    <div style={{fontSize: '11px', marginLeft: '-60px'}}>{value1Caption}</div>
                    <div style={{fontSize: '11px', marginLeft: '-60px'}}>{value1Value} {value1Unit}</div>
                </div>

                <div style={{width: '200px', marginLeft: '-260px', marginTop: '390px', textAlign: "center"}}>
                    <div style={{fontSize: '11px', marginLeft: '-90px'}}>{value2Value} {value2Unit}</div>
                    <div style={{fontSize: '11px', marginLeft: '-90px'}}>{value2Caption}</div>
                </div>

                <div style={{width: '200px', marginLeft: '-60px', marginTop: '390px', textAlign: "center"}}>
                    <div style={{fontSize: '11px', marginLeft: '-90px'}}>{value3Value} {value3Unit}</div>
                    <div style={{fontSize: '11px', marginLeft: '-90px'}}>{value3Caption}</div>
                </div>

                <div style={{width: '105px', marginLeft: '-35px', marginTop: '300px'}}>
                    <p style={{textAlign: "center"}}>
                        <div style={{fontSize: '11px'}}>{value4Caption}</div>
                        <div style={{fontSize: '11px'}}>{value4Value} {value4Unit}</div>
                    </p>
                    <p style={{textAlign: "center"}}>
                        <div style={{fontSize: '11px'}}>{value5Caption}</div>
                        <div style={{fontSize: '11px'}}>{value5Value} {value5Unit}</div>
                    </p>
                    <p style={{textAlign: "center"}}>
                        <div style={{fontSize: '11px'}}>{value6Caption}</div>
                        <div style={{fontSize: '11px'}}>{value6Value} {value6Unit}</div>
                    </p>
                </div>

                <div style={{position: 'absolute', marginLeft: '135px', width: '27%'}}>
                    <Card className="custom-accordion-vessel" style={{background: "black"}}>
                        <Card.Body>
                            {AccordionBodyRenderer(tableOneTwo)}
                        </Card.Body>
                    </Card>
                </div>
            </div>
        );
    };

    getCylinderRenderer = (i, tableData) => {
        const isFirstCylinder = i === 0;
        const defaultValue = "0";

        const firstRow = "single-cylinder-table-data-normal";
        const secondRow = "single-cylinder-table-data-normal";
        const thirdRow = "single-cylinder-table-data-normal";
        const fourthRow = "single-cylinder-table-data-normal";
        const fifthRow = "single-cylinder-table-data-normal";
        const sixthRow = "single-cylinder-table-data-normal";
        const seventhRow = "single-cylinder-table-data-normal";
        const eigthRow = "single-cylinder-table-data-normal";
        const ninthRow = "single-cylinder-table-data-normal";
        const tenthRow = "single-cylinder-table-data-normal";

        return (
            <div style={{display: "flex", marginLeft: isFirstCylinder ? 0 : '-4px'}} key={i}>
                <Image src={SingleCylinderSrc} style={{height: '440px'}}/>
                <div style={{position: "absolute"}}>
                    <table id="singleCylinderWidgetId" className="single-cylinder-table" style={{marginLeft: "8px"}}>
                        <tbody>
                        {this.blankRow({trStyle: {}, tdStyle: {height: '20px'}})}
                        {/*<tr>*/}
                        {/*    <td className="single-cylinder-table-data">*/}
                        {/*        <div className={firstRow}><span*/}
                        {/*            className="exh_gas_out_temp1"> {tableData ? tableData.value1.widgetData.value : defaultValue} </span> {tableData.value1.widgetData.unit}*/}
                        {/*        </div>*/}
                        {/*    </td>*/}
                        {/*</tr>*/}
                        {this.blankRow({trStyle: {}, tdStyle: {height: '20px'}})}
                        {/*<tr>*/}
                        {/*    <td className="single-cylinder-table-data">*/}
                        {/*        <div className={secondRow}><span*/}
                        {/*            className="exh_gas_out_dev1"> {tableData ? tableData.value2.widgetData.value : defaultValue} </span> {tableData.value1.widgetData.unit}*/}
                        {/*        </div>*/}
                        {/*    </td>*/}
                        {/*</tr>*/}
                        {this.blankRow({trStyle: {}, tdStyle: {height: '20px'}})}
                        {this.blankRow({trStyle: {height: '50px'}, tdStyle: {}})}
                        <tr>
                            <td className="single-cylinder-caption">
                                <div className="single-cylinder-caption-text"> No {i + 1} </div>
                            </td>
                        </tr>
                        {this.blankRow({trStyle: {}, tdStyle: {lineHeight: '5px'}})}
                        <tr>
                            <td className="single-cylinder-table-data">
                                <div className={thirdRow}><span
                                    className="cw_outlet_temp_1"> {tableData ? tableData.value1.widgetData.value : defaultValue} </span> {tableData.value1.widgetData.unit}
                                </div>
                            </td>
                        </tr>
                        {/*<tr>*/}
                        {/*    <td className="single-cylinder-table-data">*/}
                        {/*        <div className={fourthRow}><span*/}
                        {/*            className="linear_wall_exh_temp1"> {tableData ? tableData.value4.widgetData.value : defaultValue} </span> {tableData.value1.widgetData.unit}*/}
                        {/*        </div>*/}
                        {/*    </td>*/}
                        {/*</tr>*/}
                        {this.blankRow({trStyle: {}, tdStyle: {lineHeight: '15px'}})}
                        <tr>
                            <td className="single-cylinder-table-data">
                                <div className={fifthRow}><span
                                    className="cyl_linear_wall1"> {tableData ? tableData.value2.widgetData.value : defaultValue} </span> {tableData.value1.widgetData.unit}
                                </div>
                            </td>
                        </tr>
                        {/*<tr>*/}
                        {/*    <td className="single-cylinder-table-data">*/}
                        {/*        <div className={sixthRow}><span*/}
                        {/*            className="cw_outlet_temp1"> {tableData ? tableData.value6.widgetData.value : defaultValue} </span> {tableData.value1.widgetData.unit}*/}
                        {/*        </div>*/}
                        {/*    </td>*/}
                        {/*</tr>*/}
                        {this.blankRow({trStyle: {}, tdStyle: {lineHeight: '15px'}})}
                        <tr>
                            <td className="single-cylinder-table-data">
                                <div className={seventhRow}><span
                                    className="scav_air_temp1"> {tableData ? tableData.value3.widgetData.value : defaultValue} </span> {tableData.value1.widgetData.unit}
                                </div>
                            </td>
                        </tr>
                        {/*<tr>*/}
                        {/*    <td className="single-cylinder-table-data">*/}
                        {/*        <div className={eigthRow}><span*/}
                        {/*            className="pco_outlet_temp1"> {tableData ? tableData.value8.widgetData.value : defaultValue} </span> {tableData.value1.widgetData.unit}*/}
                        {/*        </div>*/}
                        {/*    </td>*/}
                        {/*</tr>*/}
                        {this.blankRow({trStyle: {}, tdStyle: {lineHeight: '15px'}})}
                        <tr>
                            <td className="single-cylinder-table-data">
                                <div className={ninthRow}><span
                                    className="pco_outlet_flow1"> {tableData ? tableData.value4.widgetData.value : defaultValue} </span> {tableData.value1.widgetData.unit}
                                </div>
                            </td>
                        </tr>
                        {this.blankRow({trStyle: {height: '22px'}, tdStyle: {}})}
                        {/*<tr>*/}
                        {/*    <td className="single-cylinder-table-data">*/}
                        {/*        <div className={tenthRow}><span*/}
                        {/*            className="crosshead_bear_temp_force1"> {tableData ? tableData.value10.widgetData.value : defaultValue} </span> {tableData.value1.widgetData.unit}*/}
                        {/*        </div>*/}
                        {/*    </td>*/}
                        {/*</tr>*/}
                        {this.blankRow({trStyle: {height: '22px'}, tdStyle: {}})}
                        {this.blankRow({trStyle: {}, tdStyle: {}})}
                        {/*<tr>*/}
                        {/*    <td className="single-cylinder-table-data">*/}
                        {/*        <div className="single-cylinder-table-data-normal"><span*/}
                        {/*            className="crosshead_bear_temp_aft1"> {tableData ? tableData.value11.widgetData.value : defaultValue} </span> {tableData.value1.widgetData.unit}*/}
                        {/*        </div>*/}
                        {/*    </td>*/}
                        {/*</tr>*/}
                        {this.blankRow({trStyle: {}, tdStyle: {}})}
                        {this.blankRow({trStyle: {height: '17px'}, tdStyle: {}})}
                        {/*<tr>*/}
                        {/*    <td className="single-cylinder-table-data">*/}
                        {/*        <div className="single-cylinder-table-data-normal"><span*/}
                        {/*            className="crankpin_bear_temp1"> {tableData ? tableData.value12.widgetData.value : defaultValue} </span> {tableData.value1.widgetData.unit}*/}
                        {/*        </div>*/}
                        {/*    </td>*/}
                        {/*</tr>*/}
                        {this.blankRow({trStyle: {height: '17px'}, tdStyle: {}})}
                        {/*<tr>*/}
                        {/*    <td className="single-cylinder-table-data">*/}
                        {/*        <div className="single-cylinder-table-data-normal"><span*/}
                        {/*            className="main_bear_temp_force1"> {tableData ? tableData.value13.widgetData.value : defaultValue} </span> {tableData.value1.widgetData.unit}*/}
                        {/*        </div>*/}
                        {/*    </td>*/}
                        {/*</tr>*/}
                        {this.blankRow({trStyle: {}, tdStyle: {}})}
                        {this.blankRow({trStyle: {}, tdStyle: {}})}
                        {/*<tr>*/}
                        {/*    <td className="single-cylinder-table-data">*/}
                        {/*        <div className="single-cylinder-table-data-normal"><span*/}
                        {/*            className="main_bear_temp_aft1"> {tableData ? tableData.value14.widgetData.value : defaultValue} </span> {tableData.value1.widgetData.unit}*/}
                        {/*        </div>*/}
                        {/*    </td>*/}
                        {/*</tr>*/}
                        {this.blankRow({trStyle: {}, tdStyle: {}})}
                        {this.blankRow({trStyle: {}, tdStyle: {}})}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    getCylinderHeaderData = () => {
        const element = this.state.element;
        const data = element.configuration.body.data;

        if (data) {
            return data.captions;
        }
    };

    getCylinderPropellerData = () => {
        const element = this.state.element;
        const data = element.configuration.body.data;

        if (data) {
            return data.propeller;
        }
    };

    getTableData = () => {
        const element = this.state.element;
        const data = element.configuration.body.data;
        if (data) {
            return data.captions.tableData;
        }
    };

    getCylinderData = () => {
        const element = this.state.element;
        const data = _.clone(element.configuration.body.data);

        if (data) {
            delete data["captions"];
            delete data["propeller"];
            return data;
        } else {
            let mainEngineCylinderData = {};
            const noOfCylinders = element.configuration.body.configuration.noOfCylinders;
            for (let i = 0; i < noOfCylinders; i++) {
                mainEngineCylinderData["cyl" + (i + 1)] = null;
            }
            return mainEngineCylinderData;
        }

    };

    render() {
        const cylinderHeaderData = this.getCylinderHeaderData();
        const cylinderData = this.getCylinderData();
        const getRightSideData = this.getCylinderPropellerData();
        const tableData = this.getTableData();

        if (!cylinderData) {
            return null;
        }

        const panelId = this.state.element.type + "@" + this.state.element.layout.i;

        return (

            <div id={panelId}
                 style={{height: "100%", width: "fitContent", background: "black"}}
            >
                <CustomScrollBar autoHeight={true} autoHeightMin={"25%"} autoHeightMax={"100%"} width={"100%"}>

                    <div style={{display: "flex"}}>

                        {/* BLANK PANEL RENDERING */}
                        {this.getCylinderHeaderRenderer(cylinderHeaderData)}

                        {/* LEFT PANEL RENDERING */}
                        <div style={{display: "flex", marginLeft: 0, marginRight: '-2px'}}>
                            <Image src={SingleCylinderLeftPanelSrc} style={{height: '440px'}}/>
                            <div style={{position: "absolute"}}>

                            </div>
                        </div>

                        {/* CYLINDER RENDERING */}
                        {
                            Object.keys(cylinderData).map((obj, i) => {
                                return (
                                    this.getCylinderRenderer(i, cylinderData[obj])
                                );
                            })
                        }

                        {/* RIGHT PANEL RENDERING */}
                        {this.getCylinderPropellerRenderer(getRightSideData, tableData)}

                    </div>

                </CustomScrollBar>
            </div>
        );
    }
}

function TableRenderer({children, tableData, data}) {
    const tableRows = _.map(tableData, rowData => {
        const colData = rowData.colData;
        const col1 = colData.col1;
        const col2 = colData.col2;

        let col1value = col1.widgetData.value ? col1.widgetData.value : "";
        let col2value;

        let col1CustomElement = getCustomElement(col1);
        let col2CustomElement = getCustomElement(col2);

        const isCol2Exists = col2 && (col2.widgetData.caption || col2.widgetData.value);
        let bootstrapColLength = 12;
        if (isCol2Exists) {
            bootstrapColLength = 6;
            col2value = col2.widgetData.value ? col2.widgetData.value : "";
        }

        return (
            <div className="panel-header" key={col1.widgetData.widgetId}>
                <div className="custom1-accordion-vessel-header-information">
                    <Row style={{width: "100%"}}>
                        <Col lg={bootstrapColLength} className="custom-accordion-vessel-content-1">
                            <div className="custom-accordion-vessel-content__header-1">
                                <p className="custom-accordion-vessel-content__name">
                                    <span> {col1value !== " " ? col1value : 0} </span>
                                    <span
                                        className="custom-accordion-vessel-content__secondary-text">{col1.widgetData.unit}</span>
                                </p>
                                <div className="custom-accordion-vessel-content__text1-1">
                                    <span
                                        className="custom-accordion-vessel-content__secondary-text"> {col1.widgetData.caption} </span>
                                    {col1CustomElement}
                                </div>
                            </div>
                        </Col>
                        {isCol2Exists ?
                            <Col lg={bootstrapColLength} className="custom-accordion-vessel-content-1">
                                <div className="custom-accordion-vessel-content__header-1">
                                    <p className="custom-accordion-vessel-content__name">
                                        <span> {col2value !== " " ? col2value : 0} </span>
                                        <span
                                            className="custom-accordion-vessel-content__secondary-text">{col2.widgetData.unit}</span>
                                    </p>
                                    <div className="custom-accordion-vessel-content__text1-1">
                                        <span
                                            className="custom-accordion-vessel-content__secondary-text"> {col2.widgetData.caption} </span>
                                        {col2CustomElement}
                                    </div>
                                </div>
                            </Col> :
                            null
                        }
                    </Row>
                </div>
            </div>
        );
    });

    return (
        <span>
            {tableRows}
        </span>
    );

}

function AccordionBodyRendererType1(tableData) {
    const tables = _.map(tableData, singleTableData => {
        const sortedData = _.sortBy(singleTableData, 'level');

        const dataGroups = _.map(sortedData, groupData => {
            const sortedTableData = _.sortBy(groupData.data, 'level');

            return (
                <div key={groupData.level}>
                    {groupData.caption ?
                        <div className="panel-group-header">
                            {groupData.caption}
                        </div> :
                        null
                    }
                    <TableRenderer tableData={sortedTableData} data={this}/>
                </div>
            );
        });

        return (
            <div style={{width: "100%", border: "1px solid #7eb26d", margin: "2px"}}>
                {dataGroups}
            </div>
        );

    });

    return (
        <Fragment>
            <div style={{justifyContent: "space-around"}}>
                {tables}
            </div>
        </Fragment>
    );
}

function AccordionBodyRenderer(accordionData) {
    return AccordionBodyRendererType1(accordionData);
}

function getCustomElement(col) {
    const isColCustom = col ? !!col.isCustom : false;

    if (isColCustom) {
        if (col.type === "date") {
            return <span style={{marginLeft: "2px"}}><i className="fa fa-calendar-plus-o" aria-hidden="true"/></span>;
        }
    }
    return null;
}


export default SingleCylinderWidget;
