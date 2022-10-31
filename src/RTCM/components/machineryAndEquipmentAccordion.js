import React, {Component,Fragment} from "react";
import {Accordion, Card, Col, Row, Table} from "react-bootstrap";
import CustomScrollBar from "./CustomScrollBar";
import CustomSparkLineChart from "../common/CustomSparkLineChart";
import {
    checkValueStatus,
    DetailViewRendererIcon,
    getItemFromLocalStorage, getSelectedGaugeData,
    setItemInLocalStorage
} from "../common/helper";
import CustomGaugeWithSparkBarAndLabel from "./customGaugeWithSparkBarAndLabel";
import _ from "lodash";
import '../common/css/App.css';
import CustomRecharts from "../common/CustomRecharts";

const tableFirstColumnDivStyle = {
    "textOverflow": "ellipsis",
    "overflow": "hidden",
    "whiteSpace": "nowrap",
    // "max-width": "50px"
};

function AccordionHeaderRenderer({children, accordionData, data}) {
    const accordionName = accordionData.accordionName;
    const iconClass = accordionData.iconClass;
    const summarizedData = accordionData.summarizedData;
    const value1 = summarizedData.value1 ? summarizedData.value1 : "";
    const value2 = summarizedData.value2 ? summarizedData.value2 : "";
    const value3 = summarizedData.value3 ? summarizedData.value3 : "";

    return (
        <div className="panel-header">
            <div className="custom-accordion-vessel-header-information">
                <Row  style={{width: "100%"}}>
                    <Col style={{width: '50px'}} lg="0.5"
                         className="custom-accordion-vessel-content justify-content-center custom-accordion-vessel-start-icon">
                        <div className={iconClass}/>
                    </Col>
                    <Col style={{width: '150px'}} lg="0.5" className="custom-accordion-vessel-content">
                        <span>{accordionName}</span>
                    </Col>
                    <Col lg="2" className="custom-accordion-vessel-content">
                        <div className="custom-accordion-vessel-content__header">
                            <p className="custom-accordion-vessel-content__name">
                                <span> {value1.value} </span>
                                <span className="custom-accordion-vessel-content__secondary-text">{value1.unit}</span>
                            </p>
                            <div className="custom-accordion-vessel-content__text1">
                                <span className="custom-accordion-vessel-content__secondary-text"> {value1.desc} </span>
                            </div>
                        </div>
                    </Col>
                    <Col lg="2" className="custom-accordion-vessel-content">
                        <div className="custom-accordion-vessel-content__header">
                            <p className="custom-accordion-vessel-content__name">
                                <span> {value2.value} </span>
                                <span className="custom-accordion-vessel-content__secondary-text">{value2.unit}</span>
                            </p>
                            <div className="custom-accordion-vessel-content__text1">
                                <span className="custom-accordion-vessel-content__secondary-text"> {value2.unit} </span>
                            </div>
                        </div>
                    </Col>
                    <Col lg="2" className="custom-accordion-vessel-content">
                        <div className="custom-accordion-vessel-content__header">
                            <p className="custom-accordion-vessel-content__name">
                                <span> {value3.value} </span>
                                <span className="custom-accordion-vessel-content__secondary-text">{value3.unit}</span>
                            </p>
                            <div className="custom-accordion-vessel-content__text1">
                                <span className="custom-accordion-vessel-content__secondary-text"> {value3.unit} </span>
                            </div>
                        </div>
                    </Col>
                    <Col className="custom-accordion-vessel-content">
                        <CustomSparkLineChart/>
                    </Col>
                    <Col lg="1" className="custom-accordion-vessel-content justify-content-flex-end">
                        {DetailViewRendererIcon(children, accordionName, data)}
                    </Col>
                </Row>
            </div>
        </div>
    );

}

function AccordionBodyRenderer(accordionData) {
    if (accordionData.type === 1) {
        return AccordionBodyRendererType1(accordionData);
    } else if (accordionData.type === 2) {
        return AccordionBodyRendererType2(accordionData);
    } else if (accordionData.type === 3) {
        return AccordionBodyRendererType3(accordionData);
    } else if (accordionData.type === 4) {
        return AccordionBodyRendererType4(accordionData);
    }
}

function getTableRenderer(tableData) {
    let tableRows = _.map(tableData, row => {

        return (
            <tr style={{display: "flex"}}>
                {
                    Object.keys(row).map(col => {
                        let colData = row[col].widgetData;
                        const isHeaderColumn = !!colData.caption;
                        const colHeader = colData.caption;
                        const colValue = colData.value + colData.unit;

                        return(
                            <div style={{display: "flex", width: "50%"}}>
                                <td style={{width: "100%", border: "1px solid #161719"}}><div style={tableFirstColumnDivStyle}>{colHeader}</div></td>
                                <td style={{width: "100%", border: "1px solid #161719", color: "#d8d9da"}}>{colValue}</td>
                            </div>
                        );
                    })
                }
            </tr>
        );
    });

    return (
        <CustomScrollBar height={"345px"} width={"auto"}>
            <Table
                variant="dark"
                size="sm"
                className="table-dark-first-column-as-header"
            >
                <tbody>
                    {tableRows}
                </tbody>
            </Table>
        </CustomScrollBar>
    );
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

function AccordionBodyRendererType1(accordionData) {
    const gaugesData = accordionData.gaugesData;
    const tableData = accordionData.tableData;
    const noOfGaugesInRow = accordionData.noOfGaugesInRow;

    let rechartModbusParameterIdentifier = "";
    let rechartGaugeData = {};
    const customRechartsRef = React.createRef();

    function onGaugePanelSelection(modbusParameterId) {
        let selectedGauge = getSelectedGaugeData(modbusParameterId,gaugesData,rechartGaugeData)
        customRechartsRef.current.onGaugeSelectionChange(modbusParameterId,selectedGauge);

        let element = document.getElementById(modbusParameterId);

        for (let i = 0; i < element.parentElement.childElementCount; i++) {
            let tempElement = element.parentElement.children[i];
            tempElement.style.border = '0px solid #d8d9da';
            tempElement.children[0].style.color = '#d8d9da';
        }

        element.style.border = '1px solid #7eb26d';
        element.children[0].style.color = "#33b5e5";

    }

    const allGauges = _.map(gaugesData, gaugeData => {
        const modbusParameterIdentifier = gaugeData.widgetData.modbusParameterIdentifier;
        let isGaugeSelected = false;

        if (!rechartModbusParameterIdentifier) { // scenario : default no selected
            rechartModbusParameterIdentifier = modbusParameterIdentifier;
            rechartGaugeData = gaugeData;
            isGaugeSelected = true;
        }

        return (
            <div id={modbusParameterIdentifier} onClick={()=> onGaugePanelSelection(modbusParameterIdentifier)} key={modbusParameterIdentifier}
                 style={{height: "auto", width: "212px", margin: "1px", border: isGaugeSelected ? "1px solid #7eb26d" : "0px solid #d8d9da", cursor:"pointer"}}
            >
                <div className="custom-gauge-header"
                     style={{color: isGaugeSelected ? "#33b5e5" : "#d8d9da"}}>
                    {gaugeData.widgetData.caption}
                </div>
                <CustomGaugeWithSparkBarAndLabel gaugeData={gaugeData}/>
            </div>
        );
    });

    let rowWiseGauges = {};
    let rowNo = 1;
    let counter = 1;
    _.map(allGauges, gaugeData => {
        if (counter > noOfGaugesInRow) {
            rowNo++;
            counter = 1;
        }
        if (!rowWiseGauges[rowNo]) {
            rowWiseGauges[rowNo] = [];
        }
        rowWiseGauges[rowNo].push(gaugeData);
        counter++;

    });

    const configuredGaugesInRow = _.map(rowWiseGauges, gaugeData => {
        return (
            <div style={{display: "flex", justifyContent: "space-around"}}>
                {gaugeData}
            </div>
        );
    });

    const tables = _.map(tableData, singleTableData => {
        const sortedData = _.sortBy(singleTableData, 'level');

        const dataGroups = _.map(sortedData, groupData => {
            const sortedTableData = _.sortBy(groupData.data, 'level');

            return (
                <div key={groupData.level}>
                    { groupData.caption ?
                        <div className="panel-group-header">
                            {groupData.caption}
                        </div> :
                        null
                    }
                    <TableRenderer tableData={sortedTableData} data={this} />
                </div>
            );
        });

        return (
            <div style={{width: "100%", border: "1px solid #7eb26d", margin: "2px"}}>
                {dataGroups}
            </div>
        );

    });

    const carouselCaption = accordionData.widgetData? accordionData.widgetData.caption : "";

    return (
        <Fragment>
            <div className="carousel-header">{carouselCaption}</div>
            {configuredGaugesInRow}
            <div className="rechart-container">
                <CustomRecharts
                    ref={customRechartsRef}
                    rechartModbusParameterIdentifier={rechartModbusParameterIdentifier}
                    rechartGaugeData={rechartGaugeData}
                />
            </div>
            <div style={{display: "flex", justifyContent: "space-around"}}>
                {tables}
            </div>
        </Fragment>
    );
}

function AccordionBodyRendererType2(accordionData) {
    const gaugesData = accordionData.gaugesData;
    const tableData = accordionData.tableData;
    const noOfGaugesInRow = accordionData.noOfGaugesInRow;

    let rechartModbusParameterIdentifier = "";
    let rechartGaugeData = {};
    const customRechartsRef = React.createRef();

    function onGaugePanelSelection(modbusParameterId) {
        let selectedGauge = getSelectedGaugeData(modbusParameterId,gaugesData,rechartGaugeData)
        customRechartsRef.current.onGaugeSelectionChange(modbusParameterId,selectedGauge);

        let element = document.getElementById(modbusParameterId);

        for (let i = 0; i < element.parentElement.childElementCount; i++) {
            let tempElement = element.parentElement.children[i];
            tempElement.style.border = '1px solid #161719';
            tempElement.children[0].children[0].style.color = '#d8d9da';
        }

        (element).style.border = '1px solid #7eb26d';
        element.children[0].children[0].style.color = "#33b5e5";
    }

    const allGauges = _.map(gaugesData, gaugeData => {
        const modbusParameterIdentifier = gaugeData.widgetData.modbusParameterIdentifier;
        let isGaugeSelected = false;

        if (!rechartModbusParameterIdentifier) { // scenario : default no selected
            rechartModbusParameterIdentifier = modbusParameterIdentifier;
            rechartGaugeData = gaugeData;
            isGaugeSelected = true;
        }

        return (
            <div id={modbusParameterIdentifier} onClick={()=> onGaugePanelSelection(modbusParameterIdentifier)}
                 style={{display: "flex", width: "100%", border: isGaugeSelected ? "1px solid #7eb26d" : "1px solid #161719", marginRight: "2px"}}
            >
                <div style={{height: "auto", width: "152px", margin: "1px", border: "0px solid rgb(22, 23, 25)"}}>
                    <div className="custom-gauge-header"
                         style={{color: isGaugeSelected ? "#33b5e5" : "#d8d9da"}}>
                        {gaugeData.widgetData.caption}
                    </div>
                    <CustomGaugeWithSparkBarAndLabel gaugeData={gaugeData}/>
                </div>
                <div style={{width: "152px"}}>
                    {gaugeData.tableData ? <TableRenderer tableData={gaugeData.tableData.group1.data} data={this} /> : null}
                </div>
            </div>
        );
    });

    let rowWiseGauges = {};
    let rowNo = 1;
    let counter = 1;
    _.map(allGauges, gaugeData => {
        if (counter > noOfGaugesInRow) {
            rowNo++;
            counter = 1;
        }
        if (!rowWiseGauges[rowNo]) {
            rowWiseGauges[rowNo] = [];
        }
        rowWiseGauges[rowNo].push(gaugeData);
        counter++;

    });

    const configuredGaugesInRow = _.map(rowWiseGauges, gaugeData => {
        return (
            <div style={{display: "flex", justifyContent: "space-around"}}>
                {gaugeData}
            </div>
        );
    });

    const tables = _.map(tableData, singleTableData => {
        const sortedData = _.sortBy(singleTableData, 'level');

        const dataGroups = _.map(sortedData, groupData => {
            const sortedTableData = _.sortBy(groupData.data, 'level');

            return (
                <div>
                    { groupData.caption ?
                        <div className="panel-group-header">
                            {groupData.caption}
                        </div> :
                        null
                    }
                    <TableRenderer tableData={sortedTableData} data={this} />
                </div>
            );
        });

        return (
            <div style={{width: "100%", border: "1px solid #7eb26d", margin: "2px"}}>
                {dataGroups}
            </div>
        );

    });

    const carouselCaption = accordionData.widgetData? accordionData.widgetData.caption : "";

    return (
        <Fragment>
            <div className="carousel-header">{carouselCaption}</div>
            {configuredGaugesInRow}
            <div className="rechart-container">
                <CustomRecharts
                    ref={customRechartsRef}
                    rechartModbusParameterIdentifier={rechartModbusParameterIdentifier}
                    rechartGaugeData={rechartGaugeData}
                />
            </div>
            <div style={{display: "flex", justifyContent: "space-around"}}>
                {tables}
            </div>
        </Fragment>
    );
}

function AccordionBodyRendererType3(accordionData) {
    const tableData = accordionData.tableData;

    const tables = _.map(tableData, singleTableData => {
        const sortedData = _.sortBy(singleTableData, 'level');

        const dataGroups = _.map(sortedData, groupData => {
            const sortedTableData = _.sortBy(groupData.data, 'level');

            return (
                <div>
                    { groupData.caption ?
                        <div className="panel-group-header">
                            {groupData.caption}
                        </div> :
                        null
                    }
                    <TableRenderer tableData={sortedTableData} data={this} />
                </div>
            );
        });

        return (
            <div style={{width: "100%", border: "1px solid #7eb26d", margin: "2px"}}>
                {dataGroups}
            </div>
        );

    });

    const carouselCaption = accordionData.widgetData? accordionData.widgetData.caption : "";

    return (
        <Fragment>
            <div className="carousel-header">{carouselCaption}</div>
            <div style={{display: "flex", justifyContent: "space-around"}}>
                {tables}
            </div>
        </Fragment>
    );
}

function AccordionBodyRendererType4(accordionData) {
    const tableData = accordionData.tableData;

    const tables = _.map(tableData, singleTableData => {
        const sortedData = _.sortBy(singleTableData, 'level');

        const dataGroups = _.map(sortedData, groupData => {
            const sortedTableData = _.sortBy(groupData.data, 'level');

            return (
                <div>
                    { groupData.caption ?
                        <div className="panel-group-header">
                            {groupData.caption}
                        </div> :
                        null
                    }
                    <TableRenderer tableData={sortedTableData} data={this} />
                </div>
            );
        });

        return (
            <div style={{width: "100%", border: "1px solid #7eb26d", margin: "2px", minWidth: "25%"}}>
                {dataGroups}
            </div>
        );

    });

    const carouselCaption = accordionData.widgetData? accordionData.widgetData.caption : "";

    return (
        <Fragment>
            <div className="carousel-header">{carouselCaption}</div>
            <div style={{display: "flex", justifyContent: "space-around"}}>
                {tables}
            </div>
        </Fragment>
    );
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
                    <Row className="flex-nowrap" style={{width: "100%"}}>
                        <Col lg={bootstrapColLength} className="custom-accordion-vessel-content-1">
                            <div className="custom-accordion-vessel-content__header-1">
                                <p className="custom-accordion-vessel-content__name">
                                    <span> {col1value} </span>
                                    <span className="custom-accordion-vessel-content__secondary-text">{col1.widgetData.unit}</span>
                                </p>
                                <div className="custom-accordion-vessel-content__text1-1">
                                    <span className="custom-accordion-vessel-content__secondary-text" title={col1.widgetData.caption}> {col1.widgetData.caption} </span>
                                    {col1CustomElement}
                                </div>
                            </div>
                        </Col>
                        { isCol2Exists ?
                            <Col lg={bootstrapColLength} className="custom-accordion-vessel-content-1">
                                <div className="custom-accordion-vessel-content__header-1">
                                    <p className="custom-accordion-vessel-content__name">
                                        <span> {col2value} </span>
                                        <span className="custom-accordion-vessel-content__secondary-text">{col2.widgetData.unit}</span>
                                    </p>
                                    <div className="custom-accordion-vessel-content__text1-1">
                                        <span className="custom-accordion-vessel-content__secondary-text" title={col2.widgetData.caption}> {col2.widgetData.caption} </span>
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

class MachineryAndEquipmentAccordion extends Component {

    constructor(props) {
        super(props);

        const sortedCarouselData = _.sortBy(this.props.carouselData, 'level');
        let firstAccordionKey = null; // this variable filling logic will always keep first accordion open
        _.map(sortedCarouselData, accordionData => {
            if (!firstAccordionKey) {
                firstAccordionKey = accordionData.accordionName;
            }
        });

        this.state = {
            carouselData: sortedCarouselData,
            openAccordionKey: firstAccordionKey
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!_.isEqual(nextProps.carouselData, prevState.carouselData)) {
            return {carouselData: nextProps.carouselData};
        } else return null;
    }

    onAccordionToggle = (eventKey) => {
        this.setState({openAccordionKey: eventKey});
    };

    render() {
        const {carouselData, openAccordionKey} = this.state;
        const sortedData = _.sortBy(carouselData, 'level');

        const accordions = _.map(sortedData, accordionData => {
            return (
                <Card className="custom-accordion-vessel">
                    <Accordion.Collapse eventKey={accordionData.accordionName}>
                        <Card.Body>
                            {AccordionBodyRenderer(accordionData)}
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            );
        });

        {/*<CustomScrollBar height="380px" width={"auto"}>*/}
        return (
            <CustomScrollBar height={"100%"} width={"auto"}>
                <Accordion defaultActiveKey={openAccordionKey}>
                    {accordions}
                </Accordion>
            </CustomScrollBar>
        );
    }
}

export default MachineryAndEquipmentAccordion;
