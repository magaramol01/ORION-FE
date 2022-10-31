import React, { Component } from "react";
import CustomAlert from "../../CBM/componant/custom/CustomAlert"
import { Filter } from './Filter';
import { BsFillTrashFill, BsPencilFill, BsDownload, BsEye } from "react-icons/bs";
import { Button, Table, Modal, Form, Row, Col, FormControl } from "react-bootstrap";
import Select from "react-select";
import ReactPaginate from 'react-paginate';
import { UploadReportionformation, getAllReport, downloadpdf, deleteReportionformation, getAllShips } from '../../api';
//import { YearPicker, MonthPicker } from 'react-dropdown-date';
import "../../CBM/css/customSwitch.css"
import CustomDatePicker from "../../CBM/componant/Ship/CustomDatePicker";
import { getAlarmVesselName, setItemInLocalStorage, getItemFromLocalStorage } from './helper';
// import PDFViewer from 'pdf-viewer-reactjs';
import { dateFormatter } from "../../RTCM/common/helper";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import Moment from "react-moment";
// import { Document, Page } from 'react-pdf';



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
const getDisplayFromDate = (date) => {
    return `${date}`;
  };



export class ReportTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: {
                label: "",
                value: ""
            },
            month: {
                label: "",
                value: ""
            },
            shipName: {
                label: "",
                value: ""
            },
            reportType: {
                label: "",
                value: ""
            },
            loading: false,
            popup: false,
            select: "Month",
            checked: true,
            ReportData: {
                month: "",
                year: "",
                vesselname: "",
                filename: "",
            },
            key: "Monthly",
            startDate: "",
            endDate: "",
            PdfData: [],
            Pdf: {
                month: null,
                year: null,
                vesselname: null,
                filename: null,
            },
            repoVesselShipList: [],
            pdfURL: '',
            numPages: null,
            setNumPages: 1,
            pageNumber: 1,
            prevPageNumber: 1,
            popupPDF: false,
            perPage: 5,
            page: 0,
            pages: 0,
            downloadFileName:"",
            disabled:true

        };
        this.customAlertRef = React.createRef();
        this.showPopup = this.showPopup.bind(this);
        this.showPDFPopup = this.showPDFPopup.bind(this);
    }



    showAlert = (message) => {
        this.customAlertRef.current.showAlert(message)
    };

    componentDidMount() {
        //    // this.Reportloder(); 
        getAllShips(this.getAllShipsSuccess, this.getAllShipsFail);
        getAllReport(this.ongetReportDataSuccess, this.onGetReportDataFailure);
    

    }

    getFormattedDate = (date) => {
        return dateFormatter(date, "dd-MM-yyyy");
    };
    //  Reportloder = () => {
    //   this.setState({ loading: true });

    //  }
    setStartDate = (date) => {
        let sdate = this.getFormattedDate(date);
        this.setState({ startDate: date })
    }
    setEndDate = (date) => {
        let edate = this.getFormattedDate(date);
        this.setState({ endDate: date })
    }
    onDateInputChange = (event) => {
        const { value, name } = event.target;
        this.setState({
            [name]: value,
        });
    };

    ongetReportDataSuccess = (response) => {
        const result = response.data;
        this.setState({ PdfData: result,
            pages: Math.ceil(result.length / this.state.perPage) });
    };

    onGetReportDataFailure = (err) => {
        console.error(err, "Failed to fetch Report  data!!!");
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
                    repoVesselShipList: response.data,
                    alarmVesselLabel: shipNameDataLabel,
                    alarmVesselValue: shipNameDataValue
                });

            } else {

                this.setState({
                    repoVesselShipList: response.data,
                    alarmVesselLabel: getItemFromLocalStorage("ssAppAlarmVesselLabel"),
                    alarmVesselValue: getItemFromLocalStorage("ssAppAlarmVesselValue")
                });

            }


        }

    }
    // upload pdf Report ===>

    UploadReportData = () => {
        const { ReportData: ReportData } = this.state;
        const user = getItemFromLocalStorage("email");
        let date1 = new Date(this.state.startDate);
        let date2 = new Date(this.state.endDate);
        let Difference_In_Time = date2.getTime() - date1.getTime();
        let diffDays =  Math.ceil(Difference_In_Time / (1000 * 60 * 60 * 24)); 
        let monthly;
        {this.state.checked ? monthly="Monthly":monthly="Weekly"}
    
        // const formData = new FormData();
        // formData.append("vesselname", ReportData.vesselname);
        // formData.append("month", ReportData.month);
        // formData.append("year", ReportData.year);
        // formData.append("file", this.state.filename);
        // formData.append("startdate", this.state.startDate)
        // formData.append("endDate", this.state.endDate)
        // formData.append("uploadedBy", user);
        // formData.append("monthly", monthly)
        //formData.append("fileName", this.state.filename.data.name);
        this.setState({ loading: true });
        if (this.state.filename &&ReportData.year && ReportData.month && ReportData.vesselname ) {
          if(this.state.checked && diffDays<=7){
                let saveFileByWeekly=window.confirm("Diffrence between start date and end date is less than 7 days ,Do you want to continue with Monthly ?");
                console.log(saveFileByWeekly,"truekfakls")
                if(saveFileByWeekly){
                // monthly="weekly"
                const formData = new FormData();
                formData.append("vesselname", ReportData.vesselname);
                formData.append("month", ReportData.month);
                formData.append("year", ReportData.year);
                formData.append("file", this.state.filename);
                formData.append("startdate", this.state.startDate)
                formData.append("endDate", this.state.endDate)
                formData.append("uploadedBy", user);
                formData.append("monthly", monthly)
                UploadReportionformation(this.onUploadReportDataSuccess, this.onUploadReportDataFailure, formData);
                this.setState({ disabled: true }) 
            }
         }else if(!this.state.checked && diffDays>=8){
            let saveFileByMonthly=window.confirm("Diffrence between start date and end date is greter than 7 days ,Do you want to upload file by Weekly?");
            console.log(saveFileByMonthly,"truekfakls")
            if(saveFileByMonthly){
            // monthly="monthly"
            const formData = new FormData();
            formData.append("vesselname", ReportData.vesselname);
            formData.append("month", ReportData.month);
            formData.append("year", ReportData.year);
            formData.append("file", this.state.filename);
            formData.append("startdate", this.state.startDate)
            formData.append("endDate", this.state.endDate)
            formData.append("uploadedBy", user);
            formData.append("monthly", monthly)
            UploadReportionformation(this.onUploadReportDataSuccess, this.onUploadReportDataFailure, formData);
            this.setState({ disabled: true }) 
        }else{

         }
        } else{
            const formData = new FormData();
            formData.append("vesselname", ReportData.vesselname);
            formData.append("month", ReportData.month);
            formData.append("year", ReportData.year);
            formData.append("file", this.state.filename);
            formData.append("startdate", this.state.startDate)
            formData.append("endDate", this.state.endDate)
            formData.append("uploadedBy", user);
            formData.append("monthly", monthly)
            UploadReportionformation(this.onUploadReportDataSuccess, this.onUploadReportDataFailure, formData);
            // this.setState({ disabled: true })
        } } else {

            // toast.error("all fields are madatory !");
            this.showAlert({
                type: "warning",
                message: "All fields are madatory",
            });
        }
    };
    onUploadReportDataSuccess = (response) => {
        const result = JSON.stringify(response.data);
        // console.log("result", result)
        // console.data("response", response.data)
        this.state.filename = "";
        this.setState({ popup: false ,disabled:true});
        // toast.success("File uploaded succesfully !");
        this.showAlert({
            type: "success",
            message: "File uploaded succesfully ! !",
        });
        getAllReport(this.ongetReportDataSuccess, this.onGetReportDataFailure);

    };

    onUploadReportDataFailure = (err) => {
        console.error(err, "error123");
        // toast.error("Invalid file details !");
        this.showAlert({
            type: "warning",
            message: "Invalid file details !",
        });
    };


    selectPdfFile = (e) => {
        this.setState({ filename: e.target.files[0] });
    };

    ReportDataReset = () => {
        const { ReportData: ReportData, Pdf: Pdf } = this.state;
        ReportData.month = "";
        ReportData.year = "";
        ReportData.vesselname = "";
        ReportData.filename = "";

        this.setState({ ReportData: ReportData });
    }



    pdfReset = () => {
        const { Pdf } = this.state;
        Pdf.month = null;
        Pdf.year = null;
        Pdf.vesselname = null;
        Pdf.filename = null;

        this.setState({ Pdf });
    }


    vesselnameSelector = (e) => {
        const ReportData = this.state.ReportData;
        ReportData.vesselname = e.label;
        this.setState({ ReportData: ReportData });
    };

    monthSelector = (e) => {
        const ReportData = this.state.ReportData;
        ReportData.month = e.label;
        this.setState({ ReportData: ReportData });
    };
    yearSelector = (e) => {
        const ReportData = this.state.ReportData;
        ReportData.year = e.label;
        this.setState({ ReportData: ReportData });
    };

    //  delete pdf records
    onPdfDeleteClick = (id, filepath) => {
        this.setState({ loading: false });
        deleteReportionformation(this.ondeleteReportDataSuccess, this.ondeleteReportDataFailure, id, filepath);
    }

    ondeleteReportDataSuccess = (response) => {
        getAllReport(this.ongetReportDataSuccess, this.onGetReportDataFailure);
        const result = response.data;
        this.showAlert({
            type: "success",
            message: "Record deleted successfully"
        });
        // toast.success("Record deleted successfully")
    };

    ondeleteReportDataFailure = (err) => {
        console.error(err, "Failed to fetch Report  data!!!");
    };

    onPopupFailure = (err) => {
        this.showAlert({
            type: "warning",
            message: "Something Went Wrong! Please try again later..."
        });
        this.setState({ loading: false });
    };

    popupClose = () => {
        document.getElementById("PdfReg").reset();
        this.setState({ popup: false });
    }

    showPopup = () => {
        this.setState({ popup: true, startDate: "", endDate: "" ,disabled:false});
        this.pdfReset();
        this.ReportDataReset();

    }

    popupPDFClose = () => {
        // document.getElementById("PdfReg").reset();
        this.setState({ popupPDF: false });
    }
    showPDFPopup = (filepath) => {
        downloadpdf(this.viewPDFSuccess, this.downloadcsvFail, filepath)
        this.setState({ popupPDF: true });
        // this.pdfReset();
        // this.ReportDataReset();

    }
    // download pdf fileReport ===>



    onPdfDownloadClick = (filepath,fileName) => {
        
        this.state.downloadFileName=fileName;
        console.log("pdfname",this.state.downloadFileName)
        this.setState({ loading: true });
        downloadpdf(this.downloadcsvSuccess, this.downloadcsvFail, filepath)
    };

    downloadcsvSuccess = (response) => {
        const result = response.data;
        console.log("filepath",response)
        const blob = new Blob([result], { type: 'application/pdf' })
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.setAttribute(
            'download',
            `${this.state.downloadFileName}`,
        );

        const fileURL = URL.createObjectURL(blob);
        this.setState({ pdfURL: fileURL })
        document.body.appendChild(link);

        // Start download
        link.click();

        // Clean up and remove the link
        link.parentNode.removeChild(link);

        // link.click();
        //     this.setState({ popup: false });
    };

    viewPDFSuccess = (response) => {
        const result = response.data;

        const blob = new Blob([result], { type: 'application/pdf' })
        const fileURL = URL.createObjectURL(blob);
        this.setState({ pdfURL: fileURL })
    };

    downloadcsvFail = (err) => {
        console.error(err, "Failed to fetch Report  PDF !!!");
    };


    handleShipNameChange = (shipName) => {
        // console.log("shipName", shipName)
        // let shipNameArray = []
        // let temp = "";
        // if (!(shipName == null)) {
        //     for (let i = 0; i < shipName.length; i++) {
        //         shipNameArray.push(shipName[i].label);
        //         temp += shipName[i].label + ",";
        //     }
        // }
        this.setState({ shipName: shipName })
    }

    handleYearChange = (year) => {
        // console.log("year", year)
        // let yearNames = [];
        // let temp = "";
        // if (!(year == null)) {
        //     for (let i = 0; i < year.length; i++) {
        //         yearNames.push(year[i].value);
        //         temp += year[i].value + ",";
        //     }
        // }
        this.setState({
            year:year
        })

    }

    handleMonthChange = (month) => {
        // let monthNames = []
        // let temp = ""
        // if (!(month == null)) {
        //     for (let i = 0; i < month.length; i++) {
        //         monthNames.push(month[i].value);
        //         temp += month[i].value + ",";
        //     }
        // }

        this.setState({ month: month })
    }
    onReportChangehandle=(reportType)=>{
        this.setState({ reportType: reportType })
    }
    

    handleClearFilters = () => this.setState({
        month: {
            label: "",
            value: ""
        },
        year: {
            label: "",
            value: ""
        },
        shipName: {
            label: "",
            value: ""
        },
        reportType:{
            label: "",
            value: ""  
        }
    })

    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ setNumPages: numPages });
    }

    // onDocumentLoadSuccess = ( numPages ) => {
    //     this.setState({ numPages });    
    //   }

    changePage = (offset) => {
        const pgNo = this.state.pageNumber + offset
        this.setState({ pageNumber: pgNo });
    }

    resetPageNumber = () => {
        this.setState({ pageNumber: 1 });
    }

    previousPage = () => {
        this.changePage(-1);
    }

    nextPage = () => {
        this.changePage(1);
    }

    handlePageClick = (event) => {
        let page = event.selected;
        this.setState({ page })
    }
    setKey = (key) => {
        this.setState({ key });
    };

    reportTypeValueChange = (e) => {

        let dataset = e.target.dataset
        if (dataset.key) {
            this.setState({
                checked: !this.state.checked
            })
        }

    }




    render() {
        const {
            PdfData,
            ReportData,
            Pdf,
            loading,
            popup,
            popupPDF,
            repoVesselShipList,
            page,
            perPage,
            pages,
            startDate,
            endDate,
            disabled
        } = this.state;

        const role = localStorage.getItem("role")


        const monthList = [
            { value: "January ", label: "January" },
            { value: "February", label: "February" },
            { value: "March", label: "March" },
            { value: "April", label: "April" },
            { value: "May", label: "May" },
            { value: "June", label: "June" },
            { value: "July", label: "July" },
            { value: "August", label: "August" },
            { value: "September", label: "September" },
            { value: "October", label: "October" },
            { value: "November", label: "November" },
            { value: "December", label: "December" },
        ];
        // const yearList = [
        //     { value: "2022", label: "2022" },
        //     { value: "2021 ", label: "2021" },
        //     { value: "2020", label: "2020" },
        //     { value: "2019", label: "2019" },
        //     { value: "2018", label: "2018" },
        //     { value: "2017", label: "2017" },
        //     { value: "2016", label: "2016" },
        //     { value: "2015", label: "2015" },
        //     { value: "2014", label: "2014" },
        //     { value: "2013", label: "2013" },
        //     { value: "2012", label: "2012" },
        // ];
        const yearList = [];
        let minOffset = 0, maxOffset = 10;
        let thisYear = (new Date()).getFullYear();
        let allYears = [];
        for (let x = 0; x <= maxOffset; x++) {
        allYears.push(thisYear - x)
        yearList.push({ value: x, label: thisYear-x })
        }

        const { year, month, shipName ,reportType} = this.state;
        const pageNumber = this.state.pageNumber
        const numPages = this.state.setNumPages
        return (
            <div>
               
                {/* <Filter FilterData={(Name) => {this.setState({Name: Name})}} repoVesselShipList={repoVesselShipList} /> */}
                <Filter
                    filterValues={{
                        year: this.state.year,
                        month: this.state.month,
                        shipName: this.state.shipName,
                        reportType:this.state.reportType
                    }}
                    handleShipNameChange={this.handleShipNameChange}
                    handleYearChange={this.handleYearChange}
                    handleMonthChange={this.handleMonthChange}
                    handleClearFilters={this.handleClearFilters}
                    repoVesselShipList={repoVesselShipList}
                    onReportChangehandle={this.onReportChangehandle}
                />
                <CustomAlert ref={this.customAlertRef} />


                {/* <!-- Modal --> */}

                <div className="flex-1 overflow-auto cbm-wrapper d-flex justify-content-center">

                    <div className="config-form-block alarm-form mb-3" style={{ width: "98%" }}>
                        <nav
                            className="MyTabs nav nav-tabs "
                            style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}
                        >
                            <a
                                className="nav-item nav-link active"
                            > Ship Advisory Report
                            </a>
                            {/*  Set month and Year */}
                            <div>


                            </div>
                            <div className="modal fade  mb-5 " id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered " role="document">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title text-center" id="exampleModalLongTitle"> </h5>
                                            <div className="filter-container ">
                                                <h4 className='font-weight-bold  text-center'> Add Ship Report</h4>
                                            </div>
                                            <button type="button" className="close " data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: "flex" }}>
                                <button
                                    size="sm"
                                    className=" btn btn-success parameter-add-button rounded font-weight-bold mb-3"
                                    variant="outline-secondary"
                                    onClick={this.showPopup}

                                >
                                    Upload New Report
                                </button>


                            </div>
                        </nav>

                        <Table bordered hover responsive="sm" size="sm" className="sm-alarm-table" style={{ textAlign: "center" }}>
                            <thead className='thead-warning bg- ml-3 mr-2'>
                                <tr className="tableHeader">
                                    <th className="align-middle font-weight-bold">Sr.No.</th>
                                    <th className="align-middle font-weight-bold"> Year</th>
                                    <th className="align-middle font-weight-bold"> Month</th>
                                    <th className="align-middle font-weight-bold">Vessel Name</th>

                                    <th className="align-middle font-weight-bold">Start Date</th>
                                    <th className="align-middle font-weight-bold">End Date</th>
                                    <th className="align-middle font-weight-bold"> Report Type</th>
                                    <th className="align-middle font-weight-bold">Report</th>
                                    <th className="align-middle font-weight-bold"> Uploaded Date</th>
                                    <th className='align-middle font-weight-bold'> Actions</th>
                                </tr>
                            </thead>
                            <tbody width="100%">
                                
                                {
                                    PdfData && PdfData
                                    .filter(item => item.vesselname.includes(shipName.label) && item.year.toString().includes(year.label) && item.month.includes(month.label)
                                    && item.monthly_weekly.includes(reportType.label)
                                    )
                                    .slice(page * perPage, (page + 1) * perPage)    
                                    .map((item, index) => {
                                        return (
                                            <tr>
                                                <td className="align-middle">{(page * perPage) + (index + 1)}</td>
                                                <td className="align-middle">{item.year}</td>
                                                <td className="align-middle">{item.month}</td>
                                                <td className="align-middle">{item.vesselname}</td>
                                                <td className="align-middle">{item.startdate}</td>
                                                <td className="align-middle">{item.enddate}</td>
                                                <td className="align-middle">{item.monthly_weekly}</td>

                                                <td className="align-middle">{item.filename}</td>
                                                <td className="align-middle">
                                                        <Moment format="DD MMMM yyyy HH:mm ">
                                                            {item.timestamp}
                                                        </Moment>
                                                    </td>

                                                <td className="align-middle">
                                                    <div style={{ display: "flex", justifyContent: "space-evenly" }} >
                                                        {/* <div
                                                                alt="Edit Record"

                                                                
                                                                // onClick={this.onPdfEditClick}
                                                                title={"Edit Record"}>
                                                                <BsPencilFill size={18} />
                                                            </div> */}
                                                            <div style={{ cursor: "pointer" }}
                                                                alt="View Record"
                                                                // data-toggle="modal"
                                                                // data-target="#pdfViwerModalCenter"

                                                                onClick={() => {
                                                                    this.showPDFPopup(item.filepath);
                                                                }}


                                                                title="View Record"
                                                            > <BsEye size={20} />
                                                            </div>
                                                            {role === "Smart Ship Super User" ?
                                                                <>
                                                                    <div
                                                                    style={{ cursor: "pointer" }} 
                                                                        alt="Download Record"
                                                                        onClick={() => {
                                                                            this.onPdfDownloadClick(item.filepath,item.filename);
                                                                        }}
                                                                        title="Download Record">
                                                                        <BsDownload size={18} />
                                                                    </div>

                                                                    <div
                                                                     style={{ cursor: "pointer" }} 
                                                                        data-fid={item.id}
                                                                        alt="Delete Record"
                                                                        onClick={() => {
                                                                            this.onPdfDeleteClick(item.id, item.filepath);
                                                                        }}

                                                                        title="Delete Record"
                                                                    > <BsFillTrashFill size={18} />
                                                                    </div>
                                                                </>
                                                                : null
                                                            }
                                                        </div>
                                                    </td>


                                                </tr>
                                            )
                                        })
                                }

                            </tbody>
                        </Table>
                        <div className="float-end">
                      <ReactPaginate
                          previousLabel={'Previous'}
                          nextLabel={' Next'}
                          pageCount={pages}
                          onPageChange={this.handlePageClick}
                          cbreakClassName={'page-item'}
                          breakLinkClassName={'page-link'}
                          containerClassName={'pagination'}
                          pageClassName={'page-item'}
                          pageLinkClassName={'page-link'}
                          previousClassName={'page-item'}
                          previousLinkClassName={'page-link'}
                          nextClassName={'page-item'}
                          nextLinkClassName={'page-link'}
                          activeClassName={'active'}
                      />
                  </div>
                    </div>
                </div>



                <div>
                    {this.state.popup == true ?
                        <Modal

                            size="lg"
                            show={popup}
                            onHide={this.popupClose}

                            centered

                        >
                            <Modal.Header closeButton>
                                <Modal.Title style={{ color: "#6d6d6c" }}> Add Advisory Report</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                
                                <div className="config-form-block sm-w-800">
                                    <div>
                                        <Form id="PdfReg">

                                            <Row>

                                                <Form.Group size="sm" as={Col}>
                                                    <Form.Label>VesselName</Form.Label>
                                                    <Select
                                                        theme={theme}
                                                        defaultValue={
                                                            ReportData.vesselname === '' ? [] :
                                                                [
                                                                    {
                                                                        value: ReportData.vesselname,
                                                                        label: ReportData.vesselname
                                                                    }
                                                                ]
                                                        }

                                                        options={repoVesselShipList}

                                                        onChange={this.vesselnameSelector}

                                                    />
                                                </Form.Group>
                                            </Row>
                                            <Row>
                                                {/* <div className=" mt-1 ml-3 customSwitch" >
                                           <input 
                                               type="checkbox" 
                                               checked={this.state.checked} 
                                               data-key="isActivated"
                                               className={"customSwitch customSwitchInput"} 
                                               id="flexSwitchCheckChecked" 
                                            //    data-key=""
                                               
                                                // onClick={this.reportTypeValueChange}
                                                onClick={(e)=>this.setState({checked:!this.state.checked})}
                                               >

                                               </input>
                                          <label className="customSwitchLabel customSwitchToggle" htmlFor="createShips" ></label>
                                                    </div> */}
                                                <b className="mt1 ml-2">{this.state.checked ? "Monthly" : "Weekly"}</b>
                                                <div className="customSwitch mt-1 ml-3" style={{ display: 'inline' }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={this.state.checked}
                                                        data-key={this.state.checked}
                                                        className={"customSwitch customSwitchInput"}
                                                        id="customSwitch"
                                                        onClick={this.reportTypeValueChange}

                                                    />
                                                    <label className="customSwitchLabel customSwitchToggle" htmlFor="customSwitch" ></label>

                                                </div>
                                            </Row>

                                            <Row className="mt-3">
                                                <Form.Group size="sm" as={Col} >
                                                    <Form.Label>Month</Form.Label>
                                                    <Select
                                                        theme={theme}
                                                        defaultValue={
                                                            ReportData.month === '' ? [] :
                                                                [
                                                                    {
                                                                        value: ReportData.month,
                                                                        label: ReportData.month
                                                                    }
                                                                ]
                                                        }

                                                        options={monthList}

                                                        onChange={this.monthSelector}

                                                    />
                                                </Form.Group>
                                                <Form.Group size="sm" as={Col} >
                                                    <Form.Label className="">Year</Form.Label>
                                                    <Select
                                                        style={ReportData.year.length > 0 ? { borderColor: "red" } : null}

                                                        theme={theme}
                                                        name="year"
                                                        defaultValue={
                                                            ReportData.year === '' ? [] :
                                                                [
                                                                    {
                                                                        value: ReportData.year,
                                                                        label: ReportData.year
                                                                    }
                                                                ]
                                                        }
                                                        options={yearList}
                                                        onChange={this.yearSelector}


                                                    />

                                                </Form.Group>




                                                <Form.Group size="sm" as={Col}>
                                                    <Form.Label className="">start Date</Form.Label>
                                                    <DatePicker
                                                        placeholderText="DD-MM-YYYY"
                                                        className="form-control"
                                                        onChange={this.setStartDate}
                                                        onDateInputChange={this.onDateInputChange}
                                                        value={getDisplayFromDate(startDate)}
                                                        dateName={"fromDate"}
                                                    />
                                                </Form.Group>
                                                <Form.Group size="sm" as={Col}>
                                                    <Form.Label className="">End Date</Form.Label>
                                                    <DatePicker
                                                        placeholderText="DD-MM-YYYY"
                                                        className="form-control"
                                                        onChange={this.setEndDate}
                                                        onDateInputChange={this.onDateInputChange}
                                                        value={getDisplayFromDate(endDate)}
                                                        dateName={"fromDate"}
                                                    />
                                                </Form.Group>
                                            </Row>
                                            <Row>
                                                {/* 
                                          <input type="file" accept='.pdf' method="post"
                                           className=" ml-3 mt-3  "
                                                title="UploadPDF"
                                                id="uploadPDF"
                                                required
                                                //   onChange={handlePdfFileChange}
                                               
                                            /> */}
                                                <FormControl className='ml-3 p-3'
                                                    type="file"
                                                    data-key="uploadpdfFile"
                                                    onChange={this.selectPdfFile}
                                                    multiple={false}
                                                    accept=".pdf"
                                                />

                                            </Row>

                                        </Form>
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button
                                    size="sm"
                                    className="parameter-add-button ml-0"
                                    variant="outline-secondary"
                                    onClick={this.popupClose}
                                >
                                    Cancel
                                </Button>
                                {
                                    (
                                        // ReportData.id === "" &&
                                        (
                                            <Button
                                                size="sm"
                                                className="parameter-add-button ml-0"
                                                variant="outline-secondary"
                                                disabled={disabled}
                                                onClick={this.UploadReportData}
                                            >
                                                Upload
                                            </Button>
                                        )
                                    )
                                    || (
                                        <Button
                                            size="sm"
                                            className="parameter-add-button ml-0"
                                            variant="outline-secondary"
                                        // data-fid={ReportData.id}
                                        //  onClick={this.onSubmitUpdatePdf}
                                        >
                                            Update
                                        </Button>
                                    )
                                }
                            </Modal.Footer>
                        </Modal>
                        : null
                    }
                </div>


                <div>
                    {popupPDF == true ?
                        <Modal

                            size="lg"
                            show={popupPDF}
                            onHide={this.popupPDFClose}

                            centered

                        >
                            <Modal.Header closeButton>
                                <Modal.Title style={{ color: "#6d6d6c" }}> View Advisory Report</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div  >
                                    <div>
                                        <p>Page {this.state.pageNumber || (this.state.setNumPages ? 1 : "--")} of {this.state.setNumPages || "--"}</p>
                                        <button type="button" disabled={pageNumber <= 1} onClick={this.previousPage}>
                                            Previous
                                        </button>
                                        <button type="button" disabled={pageNumber >= numPages} onClick={this.nextPage} >
                                            Next
                                        </button>
                                    </div>
                                    <div>
                                        <Document
                                            // file={{
                                            //     url:'https://arxiv.org/pdf/quant-ph/0410100.pdf'
                                            // }}
                                            // file="document.pdf"
                                            // file='https://arxiv.org/pdf/quant-ph/0410100.pdf'
                                            file={this.state.pdfURL}
                                            onLoadSuccess={this.onDocumentLoadSuccess}

                                        >
                                            <Page pageNumber={this.state.pageNumber} />
                                        </Document>
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button
                                    size="sm"
                                    className="parameter-add-button ml-0"
                                    variant="outline-secondary"
                                    onClick={() => { this.popupPDFClose(); this.resetPageNumber() }}
                                >
                                    Close
                                </Button>

                            </Modal.Footer>
                        </Modal>
                        : null
                    }
                </div>
            </div>
        )
    }
}



export default ReportTable;
