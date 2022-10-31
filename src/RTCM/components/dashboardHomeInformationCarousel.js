import React, { Component } from "react";
import { Carousel, Col, Row } from "react-bootstrap";
import _ from "lodash";
import CustomScrollBar from "./CustomScrollBar";
import { checkValueStatus } from "../../RTCM/common/helper";
import CompassD from "../../RTCM/components/CompassD";
import EEOIAsPerDateGraph from "../../RTCM/components/EEOIAsPerDateGraph";
import EEOILadenCondition from "../../RTCM/components/EEOILadenCondition";
import EEOILadenInCondition from "../../RTCM/components/EEOILadenInCondition";
import CIIGraphByVoyage from "../../RTCM/components/CIIGraphByVoyage";
import CIIGraphByDate from "../../RTCM/components/CIIGraphByDate";

function getCustomElement(col) {
  const isColCustom = !!col.isCustom;

  if (isColCustom) {
    if (col.type === "date") {
      return (
        <span style={{ marginLeft: "2px" }}>
          <i className="fa fa-calendar-plus-o" aria-hidden="true" />
        </span>
      );
    }
  }
  return null;
}

function demoPurposeValueRendering(colData) {
  let widgetData = colData.widgetData;
  let additionalData = colData.additionalValue;

  if (
    widgetData.widgetId === "WID-1.1.3.5" &&
    widgetData.value &&
    additionalData.widgetData.value &&
    widgetData.value !== " " &&
    additionalData.widgetData.value !== " "
  ) {
    widgetData.value = (
      (parseFloat(widgetData.value) +
        parseFloat(additionalData.widgetData.value)) /
      2
    ).toFixed(2);
    additionalData.widgetData.value = " ";
  } else if (
    widgetData.widgetId === "WID-1.1.3.6" &&
    widgetData.value &&
    additionalData.widgetData.value &&
    widgetData.value !== " " &&
    additionalData.widgetData.value !== " "
  ) {
    widgetData.value = (
      parseFloat(widgetData.value) - parseFloat(additionalData.widgetData.value)
    ).toFixed(2);
    additionalData.widgetData.value = " ";
  }

  return {
    caption: widgetData.caption,
    value: widgetData.value ? widgetData.value : "\u00a0\u00a0",
    unit: widgetData.unit,
    additionalValue: additionalData ? additionalData.widgetData.value : "",
  };
}

function TableRowRenderer({ children, tableData, data }) {
  const tableRows = _.map(tableData, (rowData) => {
    const colData = rowData.colData;
    const col1 = colData.col1;
    const col2 = colData.col2;
    const col1startvalue = col1.widgetData.startValue;
    const col1endvalue = col1.widgetData.endValue;
    const col1minValue = col1.widgetData.hideMinValue;
    const col1maxValue = col1.widgetData.hideMaxValue;

    const col2startvalue = col2.widgetData.startValue;
    const col2endvalue = col2.widgetData.endValue;
    const col2minValue = col2.widgetData.hideMinValue;
    const col2maxValue = col2.widgetData.hideMaxValue;

    let col1CustomElement = getCustomElement(col1);
    let col2CustomElement = getCustomElement(col2);

    const modifiedDemoPurposeCol1Value = demoPurposeValueRendering(col1);
    const modifiedDemoPurposeCol2Value = demoPurposeValueRendering(col2);

    const col1status = checkValueStatus(
      col1startvalue,
      col1endvalue,
      modifiedDemoPurposeCol1Value.value
    );
    const col2status = checkValueStatus(
      col2startvalue,
      col2endvalue,
      modifiedDemoPurposeCol2Value.value
    );

    const col1minMaxStatus = checkValueStatus(
      col1minValue,
      col1maxValue,
      modifiedDemoPurposeCol1Value.value
    );
    const col2minMaxStatus = checkValueStatus(
      col2minValue,
      col2maxValue,
      modifiedDemoPurposeCol2Value.value
    );

    return (
      <div className="panel-header" key={"dhic" + rowData.level}>
        <div className="custom1-accordion-vessel-header-information">
          <Row className="flex-nowrap" style={{ width: "100%" }}>
            <Col lg="6" className="custom-accordion-vessel-content-1">
              <div className="custom-accordion-vessel-content__header-1">
                <p className="custom-accordion-vessel-content__name">
                  {col1minMaxStatus &&
                    (col1status ? (
                      <span> {modifiedDemoPurposeCol1Value.value} </span>
                    ) : (
                      <span style={{ color: "red" }}>
                        {" "}
                        {modifiedDemoPurposeCol1Value.value}{" "}
                      </span>
                    ))}
                  <span className="custom-accordion-vessel-content__secondary-text">
                    {modifiedDemoPurposeCol1Value.unit}{" "}
                    {modifiedDemoPurposeCol1Value.additionalValue}
                  </span>
                </p>
                <div className="custom-accordion-vessel-content__text1-1">
                  <span className="custom-accordion-vessel-content__secondary-text">
                    {" "}
                    {modifiedDemoPurposeCol1Value.caption}{" "}
                  </span>
                  {col1CustomElement}
                </div>
              </div>
            </Col>
            <Col lg="6" className="custom-accordion-vessel-content-1">
              <div className="custom-accordion-vessel-content__header-1">
                <p className="custom-accordion-vessel-content__name">
                  {col2minMaxStatus &&
                    (col2status ? (
                      <span> {modifiedDemoPurposeCol2Value.value} </span>
                    ) : (
                      <span style={{ color: "red" }}>
                        {" "}
                        {modifiedDemoPurposeCol2Value.value}{" "}
                      </span>
                    ))}
                  <span className="custom-accordion-vessel-content__secondary-text">
                    {modifiedDemoPurposeCol2Value.unit}{" "}
                    {modifiedDemoPurposeCol2Value.additionalValue}
                  </span>
                </p>
                <div className="custom-accordion-vessel-content__text1-1">
                  <span className="custom-accordion-vessel-content__secondary-text">
                    {" "}
                    {modifiedDemoPurposeCol2Value.caption}{" "}
                  </span>
                  {col2CustomElement}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  });

  return <span>{tableRows}</span>;
}
function TableRowRendererOfEEOI({ children, tableData, data }) {
  const tableRows = _.map(tableData, (rowData) => {
    const colData = rowData.colData;
    const col1 = colData.col1;
    const col2 = colData.col2;
    const col3 = colData.col3;
    const col4 = colData.col4;
    const col5 = colData.col5;
    const col6 = colData.col6;

    let col1CustomElement = getCustomElement(col1);
    let col2CustomElement = getCustomElement(col2);
    let col3CustomElement = getCustomElement(col3);
    let col4CustomElement = getCustomElement(col4);
    let col5CustomElement = getCustomElement(col5);
    let col6CustomElement = getCustomElement(col6);

    const modifiedDemoPurposeCol1Value = demoPurposeValueRendering(col1);
    const modifiedDemoPurposeCol2Value = demoPurposeValueRendering(col2);
    const modifiedDemoPurposeCol3Value = demoPurposeValueRendering(col3);
    const modifiedDemoPurposeCol4Value = demoPurposeValueRendering(col4);
    const modifiedDemoPurposeCol5Value = demoPurposeValueRendering(col5);
    const modifiedDemoPurposeCol6Value = demoPurposeValueRendering(col6);

    return (
      <div className="panel-header" key={"dhic" + rowData.level}>
        <div className="custom1-accordion-vessel-header-information">
          <Row className="flex-nowrap" style={{ width: "100%" }}>
            <Col lg="2" className="custom-accordion-vessel-content-1">
              <div className="custom-accordion-vessel-content__header-1">
                <p className="custom-accordion-vessel-content__name">
                  {<span> {modifiedDemoPurposeCol1Value.value} </span>}
                  <span className="custom-accordion-vessel-content__secondary-text">
                    {modifiedDemoPurposeCol1Value.unit}{" "}
                    {modifiedDemoPurposeCol1Value.additionalValue}
                  </span>
                </p>
                <div className="custom-accordion-vessel-content__text1-1">
                  <span className="custom-accordion-vessel-content__secondary-text">
                    {" "}
                    {modifiedDemoPurposeCol1Value.caption}{" "}
                  </span>
                  {col1CustomElement}
                </div>
              </div>
            </Col>
            <Col lg="2" className="custom-accordion-vessel-content-1">
              <div className="custom-accordion-vessel-content__header-1">
                <p className="custom-accordion-vessel-content__name">
                  {<span> {modifiedDemoPurposeCol2Value.value} </span>}
                  <span className="custom-accordion-vessel-content__secondary-text">
                    {modifiedDemoPurposeCol2Value.unit}{" "}
                    {modifiedDemoPurposeCol2Value.additionalValue}
                  </span>
                </p>
                <div className="custom-accordion-vessel-content__text1-1">
                  <span className="custom-accordion-vessel-content__secondary-text">
                    {" "}
                    {modifiedDemoPurposeCol2Value.caption}{" "}
                  </span>
                  {col2CustomElement}
                </div>
              </div>
            </Col>
            <Col lg="2" className="custom-accordion-vessel-content-1">
              <div className="custom-accordion-vessel-content__header-1">
                <p className="custom-accordion-vessel-content__name">
                  {<span> {modifiedDemoPurposeCol3Value.value} </span>}
                  <span className="custom-accordion-vessel-content__secondary-text">
                    {modifiedDemoPurposeCol3Value.unit}{" "}
                    {modifiedDemoPurposeCol3Value.additionalValue}
                  </span>
                </p>
                <div className="custom-accordion-vessel-content__text1-1">
                  <span className="custom-accordion-vessel-content__secondary-text">
                    {" "}
                    {modifiedDemoPurposeCol3Value.caption}{" "}
                  </span>
                  {col3CustomElement}
                </div>
              </div>
            </Col>
            <Col lg="2" className="custom-accordion-vessel-content-1">
              <div className="custom-accordion-vessel-content__header-1">
                <p className="custom-accordion-vessel-content__name">
                  {<span> {modifiedDemoPurposeCol4Value.value} </span>}
                  <span className="custom-accordion-vessel-content__secondary-text">
                    {modifiedDemoPurposeCol4Value.unit}{" "}
                    {modifiedDemoPurposeCol4Value.additionalValue}
                  </span>
                </p>
                <div className="custom-accordion-vessel-content__text1-1">
                  <span className="custom-accordion-vessel-content__secondary-text">
                    {" "}
                    {modifiedDemoPurposeCol4Value.caption}{" "}
                  </span>
                  {col4CustomElement}
                </div>
              </div>
            </Col>
            <Col lg="2" className="custom-accordion-vessel-content-1">
              <div className="custom-accordion-vessel-content__header-1">
                <p className="custom-accordion-vessel-content__name">
                  {<span> {modifiedDemoPurposeCol5Value.value} </span>}
                  <span className="custom-accordion-vessel-content__secondary-text">
                    {modifiedDemoPurposeCol5Value.unit}{" "}
                    {modifiedDemoPurposeCol5Value.additionalValue}
                  </span>
                </p>
                <div className="custom-accordion-vessel-content__text1-1">
                  <span className="custom-accordion-vessel-content__secondary-text">
                    {" "}
                    {modifiedDemoPurposeCol5Value.caption}{" "}
                  </span>
                  {col5CustomElement}
                </div>
              </div>
            </Col>
            <Col lg="2" className="custom-accordion-vessel-content-1">
              <div className="custom-accordion-vessel-content__header-1">
                <p className="custom-accordion-vessel-content__name">
                  {<span> {modifiedDemoPurposeCol6Value.value} </span>}
                  <span className="custom-accordion-vessel-content__secondary-text">
                    {modifiedDemoPurposeCol6Value.unit}{" "}
                    {modifiedDemoPurposeCol6Value.additionalValue}
                  </span>
                </p>
                <div className="custom-accordion-vessel-content__text1-1">
                  <span className="custom-accordion-vessel-content__secondary-text">
                    {" "}
                    {modifiedDemoPurposeCol6Value.caption}{" "}
                  </span>
                  {col6CustomElement}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  });

  return <span>{tableRows}</span>;
}

class DashboardHomeInformationCarousel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      element: props.element,
      carouselIndex: 0,
    };

    this.handleSelect = this.handleSelect.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!_.isEqual(nextProps.element, prevState.element)) {
      return { element: nextProps.element };
    } else return null;
  }

  handleSelect = (selectedIndex, e) => {
    this.setState({
      carouselIndex: selectedIndex,
    });
  };

  render() {
    const element = this.state.element;
    const data = element.configuration.body.data;
    let i = 0;

    const carousels = _.map(data, (carouselData) => {
      i++;
      const sortedData = _.sortBy(carouselData, "level");

      // const dataGroups = _.map(sortedData, groupData => {
      //     const sortedTableData = _.sortBy(groupData.data, 'level');

      //     return (
      //         <div style={{borderBottom: "1px solid #161719"}} key={groupData.caption + groupData.level}>
      //             <div className="panel-group-header">
      //                 {groupData.caption}
      //             </div>
      //             <TableRowRenderer tableData={sortedTableData} data={this} />
      //         </div>
      //     );
      // });

      const dataGroups = _.map(sortedData, (groupData) => {
        if (groupData.data != undefined) {
          const sortedTableData = _.sortBy(groupData.data, "level");

          if (carouselData.group1.caption == "compass") {
            return (
              <CompassD
                height={"318px"}
                windData={this.props.windData}
                element={data}
                socketData={this.props.socketData}
              />
            );
          } else if (carouselData.group1.caption === "Graph 1") {
            return (
              <EEOIAsPerDateGraph element={groupData.data}></EEOIAsPerDateGraph>
            );
          } else if (carouselData.group1.caption === "Graph 2") {
            return (
              <EEOILadenCondition element={groupData.data}></EEOILadenCondition>
            );
          } else if (carouselData.group1.caption === "Graph 3") {
            return (
              <EEOILadenInCondition
                element={groupData.data}
              ></EEOILadenInCondition>
            );
          } else if (carouselData.group1.caption === "CII Graph 1") {
            return (
              <CIIGraphByVoyage
                element={groupData.data}
                ciiLast90DaysData={this.props.CIIData}
              ></CIIGraphByVoyage>
            );
          } else if (carouselData.group1.caption === "CII Graph 2") {
            return (
              <CIIGraphByDate
                element={groupData.data}
                ciiLast90DaysData={this.props.CIIData}
              ></CIIGraphByDate>
            );
          } else {
            return (
              <>
                {groupData.caption == " " ? (
                  <div
                    style={{
                      borderBottom: "1px solid #161719",
                      height: "65px",
                    }}
                    key={groupData.caption + groupData.level}
                  ></div>
                ) : (
                  <div
                    style={{ borderBottom: "1px solid #161719" }}
                    key={groupData.caption + groupData.level}
                  >
                    <div className="panel-group-header">
                      {groupData.caption}
                    </div>
                    {groupData.caption != "MRV Fuel Data" &&
                    groupData.caption != "ROB Values" &&
                    groupData.caption != "Voyage Details" &&
                    groupData.caption != "Additional Information" ? (
                      <TableRowRenderer
                        tableData={sortedTableData}
                        data={this}
                      />
                    ) : (
                      <TableRowRendererOfEEOI
                        tableData={sortedTableData}
                        data={this}
                      />
                    )}
                  </div>
                )}
              </>
            );
          }
        }
      });
      return (
        <Carousel.Item
          style={{ height: "inherit", width: "inherit" }}
          key={"dhic" + i}
        >
          <CustomScrollBar height={"320px"} width={"auto"}>
            {dataGroups}
          </CustomScrollBar>
        </Carousel.Item>
      );
    });

    return (
      <div>
        <Carousel
          activeIndex={this.state.carouselIndex}
          onSelect={this.handleSelect}
          controls={false}
          indicators={carousels.length > 1 ? true : false}
          interval={1000000}
          style={{ height: "inherit", width: "inherit", background: "#212124" }}
        >
          {carousels}
        </Carousel>
      </div>
    );
  }
}

export default DashboardHomeInformationCarousel;
