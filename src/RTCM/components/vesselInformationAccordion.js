import React, {Component} from "react";
import {Accordion, Card, Col, Row, Table} from "react-bootstrap";
import CustomScrollBar from "./CustomScrollBar";
import CustomSparkLineChart from "../common/CustomSparkLineChart";
import {DetailViewRendererIcon} from "../common/helper";
import _ from "lodash";

const tableFirstColumnDivStyle = {
    "textOverflow": "ellipsis",
    "overflow": "hidden",
    "whiteSpace": "nowrap",
    "maxWidth": "150px"
};

const firstColumnStickyCss = {
    "background": "#212124",
    "position": "sticky",
    "left": "0",
    "zIndex": "1"
};

const firstRowStickyCss = {
    "background": "#212124",
    "position": "sticky",
    "top": "0"
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
    const tableData = accordionData.tableData;

    let tableRows = _.map(tableData, row => {

        return (
            <tr>
                {
                    Object.keys(row).map(col => {
                        let colData = row[col];
                        const isHeaderColumn = !!colData.caption;
                        const colHeader = colData.caption;
                        const colValue = colData.value + colData.unit;

                        if (isHeaderColumn) {
                            return(
                                <td>
                                    <div style={tableFirstColumnDivStyle}>{colHeader}</div>
                                </td>
                            );
                        } else {
                            return(
                                <td>{colValue}</td>
                            );
                        }
                    })
                }
            </tr>
        );
    });

    return (
        <div>
            <Table
                variant="dark"
                size="sm"
                className="table-dark-first-column-as-header"
                style={{marginBottom : 0}}
            >
                <tbody>
                {tableRows}
                </tbody>
            </Table>
        </div>
    );
}

class VesselInformationAccordion extends Component {

    constructor(props) {
        super(props);

        this.state = {
            element: this.props.element,
            openAccordionKey: null
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!_.isEqual(nextProps.element, prevState.element)) {
            return {element: nextProps.element};
        } else return null;
    }

    onAccordionToggle = (eventKey) => {

        switch (eventKey) {
            case "navigation":
                break;
        }

        this.setState({openAccordionKey: eventKey});
    };

    render() {
        const element = this.state.element;
        const data = element.configuration.body.data.carousel1;
        const sortedData = _.sortBy(data, 'level');

        const accordions = _.map(sortedData, accordionData => {
            return (
                <Card className="custom-accordion-vessel">
                    <Card.Header className="custom-accordion-vessel-header">
                        <AccordionHeaderRenderer accordionData={accordionData} data={this} />
                    </Card.Header>
                    <Accordion.Collapse eventKey={accordionData.accordionName}>
                        <Card.Body>
                            {AccordionBodyRenderer(accordionData)}
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            );
        });

        return (
            <CustomScrollBar height={"100%"} width={"auto"}>
                <Accordion>
                    {accordions}
                </Accordion>
            </CustomScrollBar>
        );
    }
}

export default VesselInformationAccordion;
