import React, {Component} from "react";
import {Col, Row} from "react-bootstrap";
import _ from "lodash";

function getCustomElement(col) {
    const isColCustom = !!col.isCustom;

    if (isColCustom) {
        if (col.type === "date") {
            return <span style={{marginLeft: "2px"}}><i className="fa fa-calendar-plus-o" aria-hidden="true"/></span>;
        }
    }
    return null;
}

function demoPurposeValueRendering(colData) {
    let widgetData = colData.widgetData;

    return {
        caption: widgetData.caption,
        value: widgetData.value ? widgetData.value : "\u00a0\u00a0",
        unit: widgetData.unit,
        additionalValue : widgetData.additionalValue ? widgetData.additionalValue : "",
    }
}

function TableRowRenderer({children, tableData, data}) {
    const tableRows = _.map(tableData, rowData => {
        const colData = rowData.colData;

        const col1 = colData.col1;
        const isCol1Exists = !!col1;
        let col1CustomElement;
        let modifiedDemoPurposeCol1Value;
        if (isCol1Exists) {
            col1CustomElement = getCustomElement(col1);
            modifiedDemoPurposeCol1Value = demoPurposeValueRendering(col1);
        }

        const col2 = colData.col2;
        const isCol2Exists = !!col2;
        let col2CustomElement;
        let modifiedDemoPurposeCol2Value;

        if (isCol2Exists) {
            col2CustomElement = getCustomElement(col2);
            modifiedDemoPurposeCol2Value = demoPurposeValueRendering(col2);
        }


        const col3 = colData.col3;
        const isCol3Exists = !!col3;
        let col3CustomElement;
        let modifiedDemoPurposeCol3Value;

        if (isCol3Exists) {
            col2CustomElement = getCustomElement(col3);
            modifiedDemoPurposeCol3Value = demoPurposeValueRendering(col3);
        }


        const colSize = () => {
            if(isCol1Exists && isCol2Exists && isCol3Exists){
                return "4"
            }else if(isCol1Exists && isCol2Exists && !isCol3Exists){
                return "6"
            }
            else if(isCol1Exists && !isCol2Exists && !isCol3Exists){
                return "12"
            }
        }

        return (
            <div className="panel-header" key={"dhic" + rowData.level}>
                <div className="custom1-accordion-vessel-header-information">
                    <Row className="flex-nowrap" style={{width: "100%"}}>
                        {isCol1Exists ?
                            <Col lg={colSize()} className="custom-accordion-vessel-content-1">
                                <div className="custom-accordion-vessel-content__header-1">
                                    <p className="custom-accordion-vessel-content__name">
                                        <span> {modifiedDemoPurposeCol1Value.value} </span>
                                        <span className="custom-accordion-vessel-content__secondary-text">{modifiedDemoPurposeCol1Value.unit} {modifiedDemoPurposeCol1Value.additionalValue}</span>
                                    </p>
                                    <div className="custom-accordion-vessel-content__text1-1">
                                        <span className="custom-accordion-vessel-content__secondary-text"> {modifiedDemoPurposeCol1Value.caption} </span>
                                        {col1CustomElement}
                                    </div>
                                </div>
                            </Col> : null
                        }
                        {isCol2Exists ?
                            <Col lg={colSize()} className="custom-accordion-vessel-content-1">
                                <div className="custom-accordion-vessel-content__header-1">
                                    <p className="custom-accordion-vessel-content__name">
                                        <span> {modifiedDemoPurposeCol2Value.value} </span>
                                        <span className="custom-accordion-vessel-content__secondary-text">{modifiedDemoPurposeCol2Value.unit} {modifiedDemoPurposeCol2Value.additionalValue}</span>
                                    </p>
                                    <div className="custom-accordion-vessel-content__text1-1">
                                        <span className="custom-accordion-vessel-content__secondary-text"> {modifiedDemoPurposeCol2Value.caption} </span>
                                        {col2CustomElement}
                                    </div>
                                </div>
                            </Col> : null
                        }
                        {isCol3Exists ?
                            <Col lg={colSize()} className="custom-accordion-vessel-content-1">
                                <div className="custom-accordion-vessel-content__header-1">
                                    <p className="custom-accordion-vessel-content__name">
                                        <span> {modifiedDemoPurposeCol3Value.value} </span>
                                        <span className="custom-accordion-vessel-content__secondary-text">{modifiedDemoPurposeCol3Value.unit} {modifiedDemoPurposeCol3Value.additionalValue}</span>
                                    </p>
                                    <div className="custom-accordion-vessel-content__text1-1">
                                        <span className="custom-accordion-vessel-content__secondary-text"> {modifiedDemoPurposeCol3Value.caption} </span>
                                        {col3CustomElement}
                                    </div>
                                </div>
                            </Col> : null
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

class MRVInformationPanel1 extends Component {

    constructor(props) {
        super(props);

        this.state = {
            element: props.element,
            carouselIndex: 0
        };

        this.handleSelect = this.handleSelect.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!_.isEqual(nextProps.element, prevState.element)) {
            return {element: nextProps.element};
        } else return null;
    }

    handleSelect = (selectedIndex, e) => {
        this.setState({
            carouselIndex: selectedIndex
        });
    };

    render() {
        const element = this.state.element;
        const data = element.configuration.body.data;
        let i = 0;

        const dataGroups = _.map(data, groupData => {
            const sortedTableData = _.sortBy(groupData.data, 'level');

            return (
                // <div key={groupData.caption + groupData.level}>
                //     <div className="panel-group-header">
                //         {groupData.caption}
                //     </div>
                //     <TableRowRenderer tableData={sortedTableData} data={this} />
                // </div>
                <div style={{border: groupData.caption==="CO2" ? '2px solid #fff': ''}}
                key={groupData.caption + groupData.level}>
                   <div className="panel-group-header" style={{visibility:groupData.caption==="_"?'hidden':''}}>
                       {groupData.caption}
                   </div>
                   <TableRowRenderer tableData={sortedTableData} data={this} />
               </div>
            );
        });

        return (
            <div>
                {dataGroups}
            </div>
        );
    }
}

export default MRVInformationPanel1;
