import React, {useState} from 'react'
import { Table, Button, Col, Form, Row, Tab, Tabs } from 'react-bootstrap';
import Select from "react-select";



export const Filter = (props) => {

    const theme = theme => ({
        ...theme,
        colors: {
            ...theme.colors,

        },

        borderRadius: 2,
        baseUnit: 1,
        controlHeight: 35,
        fontSize: 14

    });

    let vList = props.repoVesselShipList;
    

   const [value, onChange] = useState(new Date());
   
    const vesselnameList = props.repoVesselShipList
    //     { value: "CHINA EXPRESS ", label: "CHINA EXPRESS" },
    //     { value: "NANJING EXPRESS", label: "NANJING EXPRESS" },
    //     { value: "XPRESS KANGCHENJUNGA", label: "XPRESS KANGCHENJUNGA" },
    //     { value: "CANADA EXPRESS", label: "CANADA EXPRESS" },
    //     { value: "INDONESIA EXPRESS", label: "INDONESIA EXPRESS" },
    //     { value: "TARAKAN EXPRESS", label: "TARAKAN EXPRESS" },
    //     { value: "MEDAN EXPRESS", label: "MEDAN EXPRESS" },
    //     { value: "ASIA LIBERTY", label: "ASIA LIBERTY" },
    // ];

    const monthList = [
        { value: "2 ", label: "January" },
        { value: "3", label: "February" },
        { value: "4", label: "March" },
        { value: "5", label: "April" },
        { value: "6", label: "May" },
        { value: "7", label: "June" }, 
        { value: "8", label: "July" },
        { value: "9", label: "August" },
        { value: "10Y", label: "September" },
        { value: "11", label: "October" },
        { value: "12", label: "November" },
        { value: "13", label: "December" },
    ];
    const reportTypeList = [
        { value: "monthly", label: "monthly" },
        { value: "weekly", label: "weekly" }
    ]

    // const yearList = [
    //     { value: "1", label: "2022" },
    //     { value: "2 ", label: "2021" },
    //     { value: "3", label: "2020" },
    //     { value: "4", label: "2019" },
    //     { value: "5", label: "2018" },
    //     { value: "6", label: "2017" },
    //     { value: "7", label: "2016" },
    //     { value: "8", label: "2015" },
    //     { value: "9", label: "2014" },
    //     { value: "10Y", label: "2013" },
    //     { value: "11", label: "2012" },
    // ];
    
    // filter  years   set ==>
    const yearList = [];
    let minOffset = 0, maxOffset = 10;
    let thisYear = (new Date()).getFullYear();
    let allYears = [];
    for (let x = 0; x <= maxOffset; x++) {
        allYears.push(thisYear - x)
        yearList.push({ value: x, label: thisYear-x })
    }
   //const yearList = allYears.map((x) => { return <option value={x}>{x}</option> });
   // yearList = allYears.map((x) => { return value={x} });


    return (


        <div>
            <div className="flex-1  d-flex justify-content-center">
                <div style={{ width: "95%", height: "11rem" }}>
                    {/* className="config-form-block alarm-form"  */}
                    <Tabs className="MyTabs" defaultActiveKey="Report"
                    >
                        <Tab eventKey="Report" >
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
                                            placeholder="All"
                                            theme={theme}
                                            options={vesselnameList}
                                            name="shipName"
                                            onChange={props.handleShipNameChange}
                                            isMulti={false}
                                            value={props.filterValues.shipName.label ? props.filterValues.shipName : null}

                                        />


                                    </Form.Group>
                                    <Form.Group size="sm" as={Col} className="pr-0">
                                        <Form.Label> Select Year</Form.Label>
                                        <Select
                                        placeholder="All"
                                            options={yearList}
                                            name="year-list"
                                            id="year-list"
                                            value={props.filterValues.year.label ? props.filterValues.year : null}
                                            onChange={props.handleYearChange}
                                        ></Select>
                                                {/* <YearMonthPicker
                                                    //closeOnSelect
                                                    //   onChange={this.handleChange.bind(this)}
                                                /> */}

                                                    {/* <CustomDatePicker
                                                        onDateChange={this.setFromDate}
                                                        onDateInputChange={this.onDateInputChange}
                                                        value={getDisplayFromDate(fromDate)}
                                                        dateName={"fromDate"}
                                                    /> */}

                                                {/* <Calendar  onChange={onChange} value={value} /> */}

                                    </Form.Group>

                                    <Form.Group size="sm" as={Col} className="pr-0">
                                        <Form.Label> Select Month</Form.Label>
                                        <Select
                                        placeholder="All"
                                            theme={theme}
                                            options={monthList}
                                            data-key="status"
                                            onChange={props.handleMonthChange}
                                            isMulti={false}
                                            value={props.filterValues.month.label ? props.filterValues.month : null}

                                        ></Select>
                                    </Form.Group>
                                    <Form.Group size="sm" as={Col}>
                                    <Form.Label> Select Report Type</Form.Label>
                            <Select
                            placeholder="All"
                                theme={theme}
                                            options={reportTypeList}
                                            name=""
                                            onChange={props.onReportChangehandle}
                                            isMulti={false}
                                            // closeMenuOnSelect={true}
                                            value={props.filterValues.reportType.label ? props.filterValues.reportType : null}
                                        />
                        </Form.Group>

                                    <Button
                                        size="sm"
                                        className="parameter-add-button "
                                        onClick={() => props.handleClearFilters()}
                                        variant="outline-secondary"
                                        disabled={false}
                                        style={{ marginTop: "28px", padding: "8px" }}
                                    >
                                        Clear
                                    </Button>
                                </Row>
                            </div>
                            <div>
                                <Table bordered hover responsive="sm" size="sm" className="sm-alarm-table">


                                </Table>
                            </div>
                            <div className="w-100 d-flex justify-content-flex-end">

                            </div>
                        </Tab>

                    </Tabs>
                </div>
            </div>





        </div>
    )
}