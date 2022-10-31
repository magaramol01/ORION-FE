import React, {Component} from "react";
import {Button, Col, Form, Row, Tab, Table, Tabs} from 'react-bootstrap';
import SMSidebar from "../../../SMSidebar";
import SmartShipLoader from "../common/SmartShipLoader";
import NavigationBar from "../common/NavigationBar";
import CustomAknowledgeModal from "../custom/CustomAknowledgeModal";
import Select from "react-select";
import CustomAlarmDatePicker from '../Ship/CustomDatePicker';
import { getAllTodayHistoryData,updateTodayHistoryData ,getAllFilterAlarmTodayHistoryData,getAllFilterAlertTodayHistoryData,getAllShips} from "../../../api";
import {getAlarmVesselName,setItemInLocalStorage,getItemFromLocalStorage} from '../../../RTCM/common/helper';
import Pagination from "react-js-pagination";
import {defaultPagination} from "../Constants";

const theme = theme => ({
    ...theme,
    colors: {
        ...theme.colors,
        // primary25: "unset",
        // primary: "unset"

        // All possible overrides
        // primary: '#2684FF',
        // primary75: '#4C9AFF',
        // primary50: '#B2D4FF',
        // primary25: '#DEEBFF',

        // danger: '#DE350B',
        // dangerLight: '#FFBDAD',

        // neutral0: 'hsl(0, 0%, 100%)',
        // neutral5: 'hsl(0, 0%, 95%)',
        // neutral10: 'hsl(0, 0%, 90%)',
        // neutral20: 'hsl(0, 0%, 80%)',
        // neutral30: 'hsl(0, 0%, 70%)',
        // neutral40: 'hsl(0, 0%, 60%)',
        // neutral50: 'hsl(0, 0%, 50%)',
        // neutral60: 'hsl(0, 0%, 40%)',
        // neutral70: 'hsl(0, 0%, 30%)',
        // neutral80: 'hsl(0, 0%, 20%)',
        // neutral90: 'hsl(0, 0%, 10%)',
    },
    // Other options you can use
    borderRadius: 2,
    baseUnit: 1,
    controlHeight: 35,
    fontSize: 14
    // menuGutter: baseUnit * 2
});

let machineArr = [];
const statusArr = [
    {
        value: "Addressed",
        label: "Addressed",
    },
    {
        value: "Acknowledge",
        label: "Acknowledge",
    },
    {
        value: "null",
        label: "Both",
    }];

const getFormatedFromDate = (date) => {
    const fDate = date.getDate();
    const fMonth = Number(date.getMonth()) + 1;
    const fYear = date.getFullYear();
    return `${fYear}-${fMonth}-${fDate} 00:00:00`;
};

const getFormatedToDate = (date) => {
    const fDate = date.getDate();
    const fMonth = Number(date.getMonth()) + 1;
    const fYear = date.getFullYear();
    return `${fYear}-${fMonth}-${fDate} 23:59:59`;
};

const getDisplayFromDate = (date) => {
    date = date.replace(' 00:00:00','');
    let dataArr = date.split('-');
    const fDate = dataArr[0];
    const fMonth = dataArr[1];
    const fYear = dataArr[2];
    return `${fYear}-${fMonth}-${fDate}`;
};

const getDisplayToDate = (date) => {
    date = date.replace(' 23:59:59','');
    let dataArr = date.split('-');
    const fDate = dataArr[0];
    const fMonth = dataArr[1];
    const fYear = dataArr[2];
    return `${fYear}-${fMonth}-${fDate}`;
};

class Alarm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            key: "Alarm",
            alertTableData : [],
            alarmTableData : [],
            fromDate: getFormatedFromDate(new Date()),
            toDate: getFormatedToDate(new Date()),
            machineName: null,
            status: null,
            alarmVesselShipList: [],
            alarmVesselValue: null,
            alarmVesselLabel: null,
            alarmPagination: {...defaultPagination},
            alertPagination: {...defaultPagination},
        }
    }

    setKey = (key) => {
        this.setState({key});
    };

    setFromDate = (date) => {
        this.setState({
            fromDate: getFormatedFromDate(date)
        })
    };

    setToDate = (date) => {
        this.setState({
            toDate: getFormatedToDate(date)
        })
    };

    onDateInputChange = (event) => {
        const {value, name} = event.target;
        this.setState({
            [name]: value
        })
    };
    componentDidMount() {
        // eslint-disable-next-line no-undef
        getAllShips(this.getAllShipsSuccess,this.getAllShipsFail);
    }
    onGetAllElementsSuccess = (response) => {
        let {alarmPagination, alertPagination} = this.state
        const {
            activePage: alertActivePage,
            itemsCountPerPage: alertItemsCountPerPage,
            totalItemsCount: alertTotalItemsCount,
            pageRangeDisplayed: alertPageRangeDisplayed,
            tableData: alertTableData
        } = response.data.alertAllData;
        alertPagination = {
            activePage: alertActivePage,
            itemsCountPerPage: alertItemsCountPerPage,
            totalItemsCount: alertTotalItemsCount,
            pageRangeDisplayed: alertPageRangeDisplayed,
        }
        const {
            activePage: alarmActivePage,
            itemsCountPerPage: alarmItemsCountPerPage,
            totalItemsCount: alarmTotalItemsCount,
            pageRangeDisplayed: alarmPageRangeDisplayed,
            tableData: alarmTableData
        } = response.data.alarmAllData;
        alarmPagination = {
            activePage: alarmActivePage,
            itemsCountPerPage: alarmItemsCountPerPage,
            totalItemsCount: alarmTotalItemsCount,
            pageRangeDisplayed: alarmPageRangeDisplayed,
        }
        machineArr = response.data.machineArray;
        this.setState({
            alarmPagination,
            alertPagination,
            alertTableData : alertTableData,
            alarmTableData : alarmTableData,
            loading: false
        })
    };
    onGetAllElementsFailure = (error) => {
        this.setState({
            loading: true
        })
    };

    getAllShipsSuccess = (response) => {

        const shipNameData = response.data;
        const shipNameDataLabel = shipNameData[0].label;
        const shipNameDataValue = shipNameData[0].value;

        if (shipNameData && shipNameData.length > 0) {
            if (!getAlarmVesselName()) {
                setItemInLocalStorage("ssAppAlarmVesselLabel", shipNameDataLabel);
                setItemInLocalStorage("ssAppAlarmVesselValue", shipNameDataValue);

                this.setState({
                    alarmVesselShipList: response.data,
                    alarmVesselLabel: shipNameDataLabel,
                    alarmVesselValue: shipNameDataValue
                });

            } else {

                this.setState({
                    alarmVesselShipList: response.data,
                    alarmVesselLabel: getItemFromLocalStorage("ssAppAlarmVesselLabel"),
                    alarmVesselValue: getItemFromLocalStorage("ssAppAlarmVesselValue")
                });

            }
            const vesselName = getItemFromLocalStorage("ssAppAlarmVesselValue");
            let startDate = this.state.fromDate;
            let endDate = this.state.toDate
            getAllTodayHistoryData(this.onGetAllElementsSuccess,this.onGetAllElementsFailure,vesselName,startDate,endDate);
        }
    };

    getAllShipsFail = (error) => {
        this.setState({
            loading: false
        })
    };

    onAlarmVesselChange = (e) => {

        const vesselValue = e.value;
        const vesselLabel = e.label;

        this.setState({
            loading: true,
            alarmVesselLabel: vesselLabel,
            alarmVesselValue: vesselValue,
            fromDate: getFormatedFromDate(new Date()),
            toDate: getFormatedToDate(new Date())
        });

        setItemInLocalStorage("ssAppAlarmVesselLabel", vesselLabel);
        setItemInLocalStorage("ssAppAlarmVesselValue", vesselValue);

        const vesselName = getItemFromLocalStorage("ssAppAlarmVesselValue");
        let startDate = this.state.fromDate;
        let endDate = this.state.toDate
        getAllTodayHistoryData(this.onGetAllElementsSuccess,this.onGetAllElementsFailure,vesselName,startDate,endDate);
    }

    filterAlermData = (data)=>{

        this.setState({
            loading: true
        })
        getAllFilterAlarmTodayHistoryData(this.onGetAllFilterAlarmElementsSuccess,this.onGetAllFilterAlarmElementsFailure,data);
        //console.log("Data check here");
    }
    filterAlertData = (data)=>{
        this.setState({
            loading: true
        })
        getAllFilterAlertTodayHistoryData(this.onGetAllFilterAlertElementsSuccess,this.onGetAllFilterAlertElementsFailure,data);
        //console.log("Data check here");
    }
    onGetAllFilterAlarmElementsSuccess = (response) => {
        let {alarmPagination} = this.state
        const {
            activePage: alarmActivePage,
            itemsCountPerPage: alarmItemsCountPerPage,
            totalItemsCount: alarmTotalItemsCount,
            pageRangeDisplayed: alarmPageRangeDisplayed,
            responseForAlertAlarmScreen: alarmTableData
        } = response.data;
        alarmPagination = {
            activePage: alarmActivePage,
            itemsCountPerPage: alarmItemsCountPerPage,
            totalItemsCount: alarmTotalItemsCount,
            pageRangeDisplayed: alarmPageRangeDisplayed,
        }
        machineArr = response.data.machineArray;
        this.setState({
            alarmPagination,
            alarmTableData : alarmTableData,
            loading: false
        })
    };
    onGetAllFilterAlarmElementsFailure = (error) => {
        this.setState({
            loading: false
        })
    };
    onGetAllFilterAlertElementsSuccess = (response) => {
        let {alertPagination} = this.state
        const {
            activePage: alertActivePage,
            itemsCountPerPage: alertItemsCountPerPage,
            totalItemsCount: alertTotalItemsCount,
            pageRangeDisplayed: alertPageRangeDisplayed,
            responseForAlertAlarmScreen: alertTableData
        } = response.data;
        alertPagination = {
            activePage: alertActivePage,
            itemsCountPerPage: alertItemsCountPerPage,
            totalItemsCount: alertTotalItemsCount,
            pageRangeDisplayed: alertPageRangeDisplayed,
        }
        machineArr = response.data.machineArray;
        this.setState({
            alertPagination,
            alertTableData : alertTableData,
            loading: false
        })
    };
    onGetAllFilterAlertElementsFailure = (error) => {
        this.setState({
            loading: false
        })
    };
    onDropdownStatusValueChange = (selectedValue) => {
        this.setState({
            status:selectedValue.value
        })
    };
    onDropdownmachineValueChange = (selectedValue) => {
        let selectedValueArr = [];
        {
            if(!(selectedValue==null)){
                for(let i=0;i<selectedValue.length;i++){
                    selectedValueArr.push(selectedValue[i].label);
                }
            }
        }
        this.setState({
            machineName:selectedValueArr
        })
    };
    handleAcknowledgeApply =(value, object) =>{
        this.setState({
            loading : true
        });
        object.Comment = value;
        object.acknowledgeStatus = true;
        updateTodayHistoryData(this.onHandleAcknowledgeSuccess,this.onHandleAcknowledgeFailure,object);
    }

    onHandleAcknowledgeSuccess = (response) => {
        const vesselName = getItemFromLocalStorage("ssAppAlarmVesselValue");
        let startDate = this.state.fromDate;
        let endDate = this.state.toDate
        getAllTodayHistoryData(this.onGetAllElementsSuccess,this.onGetAllElementsFailure,vesselName,startDate,endDate);
    };
    onHandleAcknowledgeFailure = (error) => {
        this.setState({
            errorMessageForAcknowledgement: error,
            loading: true
        })
    };
    redirectMethod = ()=> {
        this.props.history.push({
            pathname: '/MonitorPolicies',
            data: {
            }
        });
    }

    getCorrectFormattedDate=(dateString)=>{
        if(dateString) {
            let dateTime = dateString.split(" ");
            let datePart = dateTime[0].split("-");
            return datePart[2] + "-" + datePart[1] + "-" + datePart[0] + " " + dateTime[1];
        }
    }

    onAlarmPageChange = (activePage) => {
        const alarmPagination = {...this.state.alarmPagination};
        alarmPagination.activePage = activePage;
        this.setState({alarmPagination},
            () => {
                this.setState({
                    loading: true,
                });
                const vesselName = getItemFromLocalStorage("ssAppAlarmVesselValue");
                let startDate = this.state.fromDate;
                let endDate = this.state.toDate
                getAllTodayHistoryData(this.onGetAllElementsSuccess,this.onGetAllElementsFailure,vesselName,startDate,endDate,activePage);
            }
        );
    }

    onAlertPageChange = (activePage) => {
        const alertPagination = {...this.state.alertPagination};
        alertPagination.activePage = activePage;
        this.setState({alertPagination},
            () => {
                this.setState({
                    loading: true,
                });
                const vesselName = getItemFromLocalStorage("ssAppAlarmVesselValue");
                let startDate = this.state.fromDate;
                let endDate = this.state.toDate
                getAllTodayHistoryData(this.onGetAllElementsSuccess,this.onGetAllElementsFailure,vesselName,startDate,endDate,activePage);
            }
        );
    }

    render() {
        const {
            loading,
            fromDate,
            toDate,
            alertTableData,
            alarmTableData,
            alarmVesselShipList,
            alarmVesselLabel,
            alarmVesselValue,
            alarmPagination,
            alertPagination,
        } = this.state;


        return (
            <SMSidebar history={this.props.history} screenPath={"/Alarm"}>
                <div className="smartShipBody d-flex flex-column vh-100">
                    <SmartShipLoader isVisible={loading}/>
                    <NavigationBar
                        title={"Alarm"}
                     redirectMethod={this.redirectMethod}
                    />
                    {
                        <div className="flex-1 overflow-auto cbm-wrapper d-flex justify-content-center">
                            <div className="config-form-block alarm-form" style={{width: "98%"}}>
                                <Tabs className="MyTabs" defaultActiveKey="Alarm"
                                      onSelect={key => this.setKey(key)} activeKey={this.state.key}>
                                    <Tab eventKey="Alarm" title="Alarm">
                                        <div className="p-1 pt-2 mb-3">
                                            <Row>
                                                <Col className="config-form-block-header">
                                                    Filter Options
                                                </Col>
                                            </Row>
                                            <Row className="justify-content-end pr-2">
                                                <Form.Group size="sm" as={Col} className="pr-0">
                                                    <Form.Label>Select Ship</Form.Label>
                                                    <Select
                                                        theme={theme}
                                                        options={alarmVesselShipList}
                                                        name="shipName"
                                                        onChange={this.onAlarmVesselChange}
                                                        isMulti={false}
                                                        closeMenuOnSelect={true}
                                                        value={
                                                            [
                                                                {
                                                                    label: alarmVesselLabel,
                                                                    value: alarmVesselValue
                                                                }
                                                            ]
                                                        }
                                                    />
                                                </Form.Group>
                                                <Form.Group size="sm" as={Col} className="pr-0">
                                                    <Form.Label>Machine Name</Form.Label>
                                                    <Select
                                                        theme={theme}
                                                        options={machineArr}
                                                        data-key="machineName"
                                                        onChange={(selectedOption) => this.onDropdownmachineValueChange(selectedOption)}
                                                        isMulti={true}
                                                        closeMenuOnSelect={false}
                                                        // defaultValue={}
                                                    />
                                                </Form.Group>
                                                <Form.Group size="sm" as={Col} className="pr-0">
                                                    <Form.Label>From</Form.Label>
                                                    <CustomAlarmDatePicker
                                                        onDateChange={this.setFromDate}
                                                        onDateInputChange={this.onDateInputChange}
                                                        value={getDisplayFromDate(fromDate)}
                                                        dateName={"fromDate"}
                                                    />
                                                </Form.Group>
                                                <Form.Group size="sm" as={Col} className="pr-0">
                                                    <Form.Label>To</Form.Label>
                                                    <CustomAlarmDatePicker
                                                        onDateChange={this.setToDate}
                                                        onDateInputChange={this.onDateInputChange}
                                                        value={getDisplayToDate(toDate)}
                                                        dateName={"toDate"}
                                                    />
                                                </Form.Group>
                                                <Form.Group size="sm" as={Col} className="pr-0">
                                                    <Form.Label>Status</Form.Label>
                                                    <Select
                                                        theme={theme}
                                                        options={statusArr}
                                                        data-key="status"
                                                        onChange={(selectedOption) => this.onDropdownStatusValueChange(selectedOption)}
                                                        isMulti={false}
                                                        closeMenuOnSelect={false}
                                                        // defaultValue={}
                                                    />
                                                </Form.Group>
                                                {/*<Col>
                                                    <Form.Label>Remarks</Form.Label>
                                                    <Form.Control
                                                        as="select"
                                                        value=""
                                                        // data-key={`${rangeKey}-dropdown`}
                                                        data-key="conditionDropdown"
                                                        data-dropdownname="singleValueCondition"
                                                        // onChange={onRuleConfigFormItemValueChange}
                                                        style={{
                                                            marginRight: 20,
                                                            // width: 65
                                                        }}
                                                    >

                                                        {
                                                            ["a", "b", "c", "d"].map((opt, cpoIndex) => {
                                                                return (
                                                                    <option
                                                                        key={`cpoIndex-${cpoIndex}`}>{opt}</option>
                                                                )
                                                            })
                                                        }
                                                    </Form.Control>
                                                </Col>*/}
                                                <Button
                                                    size="sm"
                                                    className="parameter-add-button mt-3"
                                                    onClick={() => {
                                                        this.filterAlermData(this.state)
                                                    }}
                                                    variant="outline-secondary"
                                                    disabled={false}
                                                >
                                                    Apply
                                                </Button>
                                            </Row>
                                        </div>
                                        <div>
                                            <Table bordered hover responsive="sm" size="sm" className="sm-alarm-table">
                                                <thead>
                                                <tr className="tableHeader">
                                                    <th>Sr.No</th>
                                                    <th>Date Time</th>
                                                    <th>Alarm Message</th>
                                                    <th>Acknowledge</th>
                                                    <th>Machine Name</th>
                                                    <th>Comment</th>
                                                    {/*<th>Remarks</th>*/}
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {
                                                    alarmTableData.map((item, index) => {
                                                        return (
                                                            <tr key={item.id}>
                                                                <td>{index + 1}</td>
                                                                <td>
                                                                    <div className="d-flex flex-row">
                                                                        <div
                                                                            style={{
                                                                                borderRight: "1px solid #e2e2e2"
                                                                            }}
                                                                            className="pr-1 pl-1"
                                                                        >{`From - ${this.getCorrectFormattedDate(item.startDate)}`}</div>
                                                                        <div
                                                                            className="pr-1 pl-1"
                                                                        >{`To - ${this.getCorrectFormattedDate(item.endDate)}`}</div>
                                                                    </div>
                                                                </td>
                                                                <td>{item.Message}</td>
                                                                {<td className="aknowledge-button-wrapper">
                                                                    {!item.acknowledgeStatus && <CustomAknowledgeModal
                                                                        handleAcknowledge={(value) => this.handleAcknowledgeApply(value, item)}
                                                                    />
                                                                    }
                                                                </td>}
                                                                <td>{item.MachineName}</td>
                                                                <td>{item.Comment}</td>
                                                                {/*<td>{item.remarks}</td>*/}
                                                            </tr>
                                                        )
                                                    })
                                                }
                                                </tbody>
                                            </Table>
                                        </div>
                                        <div className="w-100 d-flex justify-content-flex-end">
                                            {alarmPagination.totalItemsCount > 0 && <Pagination
                                                itemClass="page-item"
                                                linkClass="page-link"
                                                activePage={alarmPagination.activePage}
                                                itemsCountPerPage={alarmPagination.itemsCountPerPage}
                                                totalItemsCount={alarmPagination.totalItemsCount}
                                                pageRangeDisplayed={alarmPagination.pageRangeDisplayed}
                                                onChange={(activePage) => this.onAlarmPageChange(activePage)}
                                            />}
                                        </div>
                                    </Tab>
                                    <Tab eventKey="Alert" title="Alert">
                                            <div className="p-1 pt-2 mb-3">
                                                <Row>
                                                    <Col className="config-form-block-header">
                                                        Filter Options
                                                    </Col>
                                                </Row>
                                                <Row className="justify-content-end pr-2">
                                                    <Form.Group size="sm" as={Col} className="pr-0">
                                                        <Form.Label>Select Ship</Form.Label>
                                                        <Select
                                                        theme={theme}
                                                        options={alarmVesselShipList}
                                                        name="shipName"
                                                        onChange={this.onAlarmVesselChange}
                                                        isMulti={false}
                                                        closeMenuOnSelect={true}
                                                        value={
                                                            [
                                                                {
                                                                    label: alarmVesselLabel,
                                                                    value: alarmVesselValue
                                                                }
                                                            ]
                                                        }
                                                    />
                                                    </Form.Group>
                                                    <Form.Group size="sm" as={Col} className="pr-0">
                                                        <Form.Label>Machine Name</Form.Label>
                                                        <Select
                                                            theme={theme}
                                                            options={machineArr}
                                                            data-key="machineName"
                                                            onChange={(selectedOption) => this.onDropdownmachineValueChange(selectedOption)}
                                                            isMulti={true}
                                                            closeMenuOnSelect={false}
                                                            // defaultValue={}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group size="sm" as={Col} className="pr-0">
                                                        <Form.Label>From</Form.Label>
                                                        <CustomAlarmDatePicker
                                                            onDateChange={this.setFromDate}
                                                            onDateInputChange={this.onDateInputChange}
                                                            value={getDisplayFromDate(fromDate)}
                                                            dateName={"fromDate"}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group size="sm" as={Col} className="pr-0">
                                                        <Form.Label>To</Form.Label>
                                                        <CustomAlarmDatePicker
                                                            onDateChange={this.setToDate}
                                                            onDateInputChange={this.onDateInputChange}
                                                            value={getDisplayToDate(toDate)}
                                                            dateName={"toDate"}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group size="sm" as={Col} className="pr-0">
                                                        <Form.Label>Status</Form.Label>
                                                        <Select
                                                            theme={theme}
                                                            options={statusArr}
                                                            data-key="status"
                                                            onChange={(selectedOption) => this.onDropdownStatusValueChange(selectedOption)}
                                                            isMulti={false}
                                                            closeMenuOnSelect={false}
                                                            // defaultValue={}
                                                        />
                                                    </Form.Group>
                                                    <Button
                                                        size="sm"
                                                        className="parameter-add-button mt-3"
                                                        onClick={() => {
                                                            this.filterAlertData(this.state)
                                                        }}
                                                        variant="outline-secondary"
                                                        disabled={false}
                                                    >
                                                        Apply
                                                    </Button>
                                                </Row>
                                            </div>
                                            <div>
                                                <Table bordered hover responsive="sm" size="sm" className="sm-alarm-table">
                                                    <thead>
                                                    <tr className="tableHeader">
                                                        <th>Sr.No</th>
                                                        <th>Date Time</th>
                                                        <th>Alarm Message</th>
                                                        <th>Acknowledge</th>
                                                        <th>Machine Name</th>
                                                        <th>Comment</th>
                                                        {/*<th>Remarks</th>*/}
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        alertTableData.map((item, index) => {
                                                            return (
                                                                <tr key={item.id}>
                                                                    <td>{index + 1}</td>
                                                                    <td>
                                                                        <div className="d-flex flex-row">
                                                                            <div
                                                                                style={{
                                                                                    borderRight: "1px solid #e2e2e2"
                                                                                }}
                                                                                className="pr-1 pl-1"
                                                                            >{`From - ${this.getCorrectFormattedDate(item.startDate)}`}</div>
                                                                            <div
                                                                                className="pr-1 pl-1"
                                                                            >{`To - ${this.getCorrectFormattedDate(item.endDate)}`}</div>
                                                                        </div>
                                                                    </td>
                                                                    <td>{item.Message}</td>
                                                                    {<td className="aknowledge-button-wrapper">
                                                                        {!item.acknowledgeStatus && <CustomAknowledgeModal
                                                                            handleAcknowledge={(value) => this.handleAcknowledgeApply(value, item)}
                                                                        />
                                                                        }
                                                                    </td>}
                                                                    <td>{item.MachineName}</td>
                                                                    <td>{item.Comment}</td>
                                                                    {/*<td>{item.remarks}</td>*/}
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                    </tbody>
                                                </Table>
                                                <div className="w-100 d-flex justify-content-flex-end">
                                                    {alertPagination.totalItemsCount > 0 && <Pagination
                                                        itemClass="page-item"
                                                        linkClass="page-link"
                                                        activePage={alertPagination.activePage}
                                                        itemsCountPerPage={alertPagination.itemsCountPerPage}
                                                        totalItemsCount={alertPagination.totalItemsCount}
                                                        pageRangeDisplayed={alertPagination.pageRangeDisplayed}
                                                        onChange={(activePage) => this.onAlertPageChange(activePage)}
                                                    />}
                                                </div>
                                            </div>
                                    </Tab>
                                </Tabs>
                            </div>
                        </div>
                    }
                </div>
            </SMSidebar>
        )
    }
}

export default Alarm;
