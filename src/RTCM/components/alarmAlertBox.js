import React, {Component} from "react";
import {Accordion, Card, Col, Dropdown, Form, Row} from "react-bootstrap";
import CustomScrollBar from "./CustomScrollBar";
import {getTodayAlertData} from "../../api";
import {withRouter} from "react-router-dom";
import {getShipName, getVesselId} from "../common/helper";

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <span ref={ref} className="fa fa-caret-down panel-menu-toggle"
          onClick={(e) => {
              e.preventDefault();
              onClick(e);
          }}
    >
    </span>
));

class AlarmAlertBox extends Component {

    constructor(props) {
        super(props);

        const body = this.props.element.configuration.body;
        const observantType = body.observantType;
        let iconType, observantClass, headerText;

        if (observantType === "alarm") {
            headerText = "Alarm";
            observantClass = "alert-rule-item__text1 alert-state-critical";
            iconType = "fa fa-bell-o";
        } else if (observantType === "alert") {
            headerText = "Alert";
            // TODO : optimize below line logic
            observantClass = body.observantColor === "red" ? "alert-rule-item__text1 alert-state-critical" : "alert-rule-item__text1 alert-state-warning";
            iconType = "fa fa-exclamation-triangle";
        } else {
            headerText = "Advisories";
            observantClass = "alert-rule-item__text1 alert-state-ok";
            iconType = "fa fa-globe";
        }

        this.state = {
            element: this.props.element,
            searchText: "",
            observantInitialState: [],
            observantType: observantType,
            observantClass: observantClass,
            iconType: iconType,
            headerText: headerText,
            observantMessages: [],
            isShowSearch: true,
            machineArray:[],
            machineType:""
        };

        this.fetchDataFromServer = this.fetchDataFromServer.bind(this);
        this.filterList = this.filterList.bind(this);
        this.expandSearchViewClick = this.expandSearchViewClick.bind(this);
        this.onToggleDropDown = this.onToggleDropDown.bind(this);
    }

    componentDidMount() {
        this.fetchDataFromServer();
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const socketData = nextProps.socketData;
        if (socketData && socketData.observantType === this.state.observantType) {
            let observantMessagesArr = this.state.observantMessages;
            let isSameEntryExists = observantMessagesArr.some(ele => ele.observantMessage === socketData.observantMessage && ele.timestamp === socketData.timestamp);

            if (!isSameEntryExists) {
                observantMessagesArr.unshift(socketData);
                observantMessagesArr = observantMessagesArr.slice(0, 14);
                this.setState({
                    observantMessages: observantMessagesArr
                });
            }
        }
    }

    fetchDataFromServer = () => {
        getTodayAlertData(this.state.observantType, getVesselId(), this.onSuccessFetchAlertData, this.onFailureFetchAlertData);
    };

    onSuccessFetchAlertData = (response) => {
        this.setState({
            observantMessages: response.data.alertHistory,
            machineArray:response.data.machineArray
        });
    };

    onFailureFetchAlertData = () => {
        //console.log("Failed to fetch alerts data!!!");
    };

    filterList = (event) => {
        this.setState({searchText: event.target.value});

        let updatedList = this.state.observantInitialState;
        updatedList = updatedList.filter(function(item) {
            const searchValue = event.target.value.toLowerCase();

            return (
                item.observantMessage.toLowerCase().search(searchValue) !== -1 ||
                item.machineType.toLowerCase().search(searchValue) !== -1 ||
                item.timestamp.toLowerCase().search(searchValue) !== -1
            );
        });
        this.setState({observantMessages: updatedList});
    };

    expandSearchViewClick = (event) => {
        this.setState({isShowSearch: !this.state.isShowSearch})
    };

    onToggleDropDown = (element, isOpen, event, metadata) => {
        /*
        * This is hack for drop-down menu as it gets disappear behind react grid panes and hence applied this logic
        * */
        // workaround 1 start
        if (isOpen) {
            document.getElementById(element.layout.i).style.zIndex = 1;
        } else {
            document.getElementById(element.layout.i).style.zIndex = "unset";
        }
        // workaround 1 end

        // workaround 2 start
        /*
        * revert above changes and set following
        * useCSSTransforms={false}
        * measureBeforeMount={true}
        * */
        // workaround 2 end
    };

    handleClick = () => {
        this.props.history.push("/Alarm");
    };

    getCorrectFormattedDate=(dateString)=>{
        if(dateString) {
            let dateTime = dateString.split(" ");
            let datePart = dateTime[0].split("-");
            return datePart[2] + "-" + datePart[1] + "-" + datePart[0] + " " + dateTime[1];
        }
    };

    getAccordionBody() {
        const {iconType, observantClass} = this.state;
        return(
            <div>
                {
                    this.state.observantMessages.map((observantData, i) => {

                            return (
                                <div className="acc-list-item" key={i}>
                                    <div className="acc-list-link alert-rule-item__body" onClick={this.handleClick}>
                                        <div className="alert-rule-item__header">
                                            <p className="alert-rule-item__name">
                                                <span>{observantData.observantMessage}</span>
                                            </p>
                                            <div className={observantClass}>
                                                <i className={iconType}/>
                                                <span className="alert-state-text">{observantData.machineType} </span>
                                                <span className="alert-rule-item__time">
                                                    {this.getCorrectFormattedDate(observantData.timestamp)}
                                                </span>
                                                {
                                                    observantData.liveValue ?
                                                        <span className="alert-rule-current-value">
                                                            {parseFloat(observantData.liveValue).toFixed(2)}
                                                            {" "}
                                                            {/*{observantData.liveValueUnit ? observantData.liveValueUnit : ""}*/}
                                                        </span> : null
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                    })
                }
            </div>
        );
    }

    onDropDownItemClick=(machineType)=>{
        this.setState({machineType: machineType});
    };

    render() {
        const {machineArray} = this.state;
        const accordionBody = this.getAccordionBody();
        const element = this.state.element;
        const isShowSearch = this.state.isShowSearch;
        let panelBodyHeight = parseInt(this.state.element.configuration.body.configuration.height);
        let bodyMargin = 0;

        if (this.state.isShowSearch) {
            bodyMargin = 3;
        } else {
            panelBodyHeight = panelBodyHeight + 41
        }

        return (
            <div>
                <div onClick={this.expandSearchViewClick} className="box-rubber">
                    <i className="fa fa-ellipsis-h"/>
                </div>
                <Accordion defaultActiveKey="0">
                    <Card className="custom-accordion">
                        <Card.Header className="custom-accordion-header">
                            <div style={{paddingLeft: "6px", paddingRight: "4px", paddingTop: "2px", display: isShowSearch ? "block" : "none"}}>
                                <Row style={{margin: "2px"}}>
                                    <Col lg="5" style={{display: "flex", alignItems: "center"}}>
                                        <span style={{fontSize: "20px", marginRight: "5px"}}>
                                            <i className={this.state.iconType}/>
                                        </span>
                                        <span className="panel-title-text">
                                            {this.state.headerText}
                                        </span>
                                    </Col>
                                    <Col lg="7" style={{display: "flex", alignItems: "center"}}>
                                        <Form.Control
                                            className="gf-form-input"
                                            type="text"
                                            placeholder="Search"
                                            value={this.state.searchText}
                                            onChange={this.filterList}
                                            autoComplete="off"
                                        />
                                        <div style={{marginLeft: "-25px"}}>
                                            <Dropdown id={"dropdown-toggle" + element.layout.i} onToggle={this.onToggleDropDown.bind(this, element)}>
                                                <Dropdown.Toggle as={CustomToggle} id="dropdown-toggle"/>
                                                <Dropdown.Menu className="dropdown-menu--menu search-dropdown-menu">
                                                    {machineArray.map((item)=>{
                                                        return(
                                                        <Dropdown.Item eventKey={item.value} data={element.layout.i} onSelect={this.onDropDownItemClick} key={item.value}>
                                                            <span> {item.value} </span>
                                                        </Dropdown.Item>
                                                        )

                                                    })}
                                                    <Dropdown.Divider style={{borderColor: "#2c3235"}} />
                                                    <Dropdown.Item eventKey="date" data={element.layout.i} onSelect={this.onDropDownItemClick}>
                                                        <span> Date </span>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item eventKey="priority" data={element.layout.i} onSelect={this.onDropDownItemClick}>
                                                        <span> Priority </span>
                                                    </Dropdown.Item>

                                                </Dropdown.Menu>
                                            </Dropdown>{' '}
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Card.Header>
                        {/*<Accordion.Collapse eventKey="0">*/}
                        {/*    */}
                        {/*</Accordion.Collapse>*/}
                        <div>
                            <Card.Body style={{paddingBottom: "8px", marginTop: bodyMargin + "px"}}>
                                <CustomScrollBar height={panelBodyHeight + "px"} width={'100%'}>
                                    {accordionBody}
                                </CustomScrollBar>
                            </Card.Body>
                        </div>

                    </Card>
                </Accordion>
            </div>
        );
    }
}

export default withRouter(AlarmAlertBox);
