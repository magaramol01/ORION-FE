import React, {Component} from "react";
import SMSidebar from "../../../../SMSidebar";
import SmartShipLoader from "../../common/SmartShipLoader";
import NavigationBar from "../../common/NavigationBar";
import {Button, Table, Modal, Form, Row, Col} from "react-bootstrap";

import CustomAlert from "../../custom/CustomAlert";
import {
    deleteCompanyEntry,
    getAllCompanyEntry,
    getCompanyEntryByID,
    createCompanyEntry,
    updateCompanyDataById,
    uploadFile,
    logo_url
} from "../../../../api";
import {ErrorMessage, ErrorMessageCss} from "../validationHelper";

const defaultCompanyErrorObject = {
    companyRegisteredName: "",
    companyOfficialAbbreviation: "",
    companyHQCountry: "",
    companyWebsite: "",
    companyType: "",
    companyAddress: "",
    companyTelephone: "",
    companyEmail: "",
    companyLogo: "",
    id: ""
};


class CompanyEntryTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            popup: false,
            isCompanyEntryFormValid: false,
            Company: {
                companyRegisteredName: null,
                companyOfficialAbbreviation: null,
                companyHQCountry: null,
                companyWebsite: null,
                companyType: null,
                companyAddress: null,
                companyTelephone: null,
                companyEmail: null,
                companyLogo: null,
                files: null,
            },
            CompanyUpdate: {
                companyRegisteredName: "",
                companyOfficialAbbreviation: "",
                companyHQCountry: "",
                companyWebsite: "",
                companyType: "",
                companyAddress: "",
                companyTelephone: "",
                companyEmail: "",
                companyLogo: "",
                id: ""
            },
            CompanyData: [],
            companyErrorObject: {...defaultCompanyErrorObject}

        };
        this.customAlertRef = React.createRef();
    }

    componentDidMount() {
        this.companyLoader();
    }

    showAlert = (message) => {
        this.customAlertRef.current.showAlert(message)
    };

    companyLoader = () => {
        this.setState({loading: true});
        getAllCompanyEntry(this.onGetAllCompanyEntrySuccess, this.onGetAllCompanyEntryFailure);

    };

    onGetAllCompanyEntrySuccess = (response) => {
        if (response.data[0]) {
            this.setState({CompanyData: response.data});
        } else {
            this.showAlert({
                type: "warning",
                message: "No Records Found"
            });
        }

        this.setState({loading: false});
    }


    onGetAllCompanyEntryFailure = (err) => {
        console.log(err);

    }

    onCompanyEditClick = (companyID) => {
        this.companyUpdateReset();
        this.companyReset();
        this.companyErrorObjectReset();

        const payload = {
            id: companyID
        };
        getCompanyEntryByID(this.onGetCompanyEntrySuccess, this.onGetCompanyEntryFailure, payload);


    };

    onGetCompanyEntrySuccess = (response) => {
        if(response.data[0]) {
            this.setState({CompanyUpdate: response.data[0]});
            this.setState({popup: true});
        }
        else{
            this.showAlert({
                type: "warning",
                message: "No Records Found"
            });

        }
    }

    onGetCompanyEntryFailure = (err) => {
        console.log(err);
    }

    getIsCompanyEntryFormValid = () => {
        const {
            Company,
            CompanyUpdate,
            companyErrorObject
        } = {...this.state};
        let isCompanyEntryFormValid = true;

        for(let key in Company) {
            if("files" !== key) {
                if(Company[key] === null) {
                    if(CompanyUpdate.id === "") {
                        isCompanyEntryFormValid = false;
                    }
                } else if("companyLogo" === key) {
                    if(!Company.companyLogo.match(/\.(jpg|jpeg|png)$/)) {
                        isCompanyEntryFormValid = false;
                        companyErrorObject[key] = "Logo must be in jpg or jpeg or png format.";
                    } else {
                        companyErrorObject[key] = "";
                    }
                } else if("companyWebsite" === key) {
                    const urlRegex = RegExp(/(([\w]+:)?\/\/)?(([\d\w]|%[a-fA-f\d]{2,2})+(:([\d\w]|%[a-fA-f\d]{2,2})+)?@)?([\d\w][-\d\w]{0,253}[\d\w]\.)+[\w]{2,63}(:[\d]+)?(\/([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)*(\?(&?([-+_~.\d\w]|%[a-fA-f\d]{2,2})=?)*)?(#([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)?/);
                    if(urlRegex.test(Company[key])) {
                        companyErrorObject[key] = "";
                    } else {
                        isCompanyEntryFormValid = false;
                        companyErrorObject[key] = "Please Enter Valid Website.";
                    }
                } else if("companyEmail" === key) {
                    const emailRegex = RegExp(/^[\w-.]+@([\w-]+\.)+[\w-]+$/);
                    if(emailRegex.test(Company[key])) {
                        companyErrorObject[key] = "";
                    } else {
                        isCompanyEntryFormValid = false;
                        companyErrorObject[key] = "Please Enter Valid E-mail.";
                    }
                } else if("companyTelephone" === key) {
                    const telephoneRegex = RegExp(/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/);
                    if(telephoneRegex.test(Company[key])) {
                        companyErrorObject[key] = "";
                    } else {
                        isCompanyEntryFormValid = false;
                        companyErrorObject[key] = "Please Enter Valid Telephone.";
                    }
                }
            }
        }

        return {
            isCompanyEntryFormValid,
            companyErrorObject
        }
    }


    onFieldChange = (e) => {
        const {value, name} = e.target;
        const {Company} = {...this.state};
        const currentState = Company;
        currentState[name] = value;
        const {isCompanyEntryFormValid, companyErrorObject} = this.getIsCompanyEntryFormValid();

        this.setState({
            Company: currentState,
            files: e.target.files,
            isCompanyEntryFormValid,
            companyErrorObject
        });

    }

    popupClose = () => {
        document.getElementById("CompanyReg").reset();
        this.companyLoader();
        this.setState({popup: false});
    }

    popupShow = () => {
        this.companyReset();
        this.companyUpdateReset();
        this.companyErrorObjectReset();
        this.setState({popup: true});
    }

    companyReset = () => {
        const {Company} = this.state;
        Company.companyRegisteredName = null;
        Company.companyOfficialAbbreviation = null;
        Company.companyAddress = null;
        Company.companyType = null;
        Company.companyWebsite = null;
        Company.companyEmail = null;
        Company.companyTelephone = null;
        Company.companyHQCountry = null;
        Company.companyLogo = null;
        this.setState({Company});
    }

    companyErrorObjectReset = () => {
        this.setState({
            companyErrorObject: {...defaultCompanyErrorObject},
            isCompanyEntryFormValid: false,
        });
    }

    companyUpdateReset = () => {
        const {CompanyUpdate} ={...this.state};
        CompanyUpdate.companyRegisteredName = "";
        CompanyUpdate.companyOfficialAbbreviation = "";
        CompanyUpdate.companyAddress = "";
        CompanyUpdate.companyType = "";
        CompanyUpdate.companyWebsite = "";
        CompanyUpdate.companyEmail = "";
        CompanyUpdate.companyTelephone = "";
        CompanyUpdate.companyHQCountry = "";
        CompanyUpdate.id = "";
        CompanyUpdate.isSuccess = "";
        CompanyUpdate.companyLogo = "";
        this.setState({CompanyUpdate: CompanyUpdate});
    }


    onCompanyDeleteClick = (companyEmail) => {
        const payload = {
            companyEmail: companyEmail
        };
        deleteCompanyEntry(this.onDeleteCompanyEntrySuccess, this.onDeleteCompanyEntryFailure, payload);

    }

    onDeleteCompanyEntrySuccess = (res) => {
        if(res.data) {
            this.setState({CompanyData:res.data},()=>{
                this.showAlert({
                    type: "success",
                    message: "Record Deleted Successfully!!!"
                });
            })

        }
        else{
            this.showAlert({
                type: "error",
                message: "No Records Found!!!"
            });
        }
        this.companyLoader();

    }

    onDeleteCompanyEntryFailure = (err) => {
        this.setState({
            loading: false
        })
        console.log(err);
    }


    onSubmitRegisterCompany = (e) => {
        e.preventDefault();
        if (this.valid()) {
            const {Company} = {...this.state};
            let fileName = this.state.Company.companyLogo.split("\\");
            this.setState({companyLogo: fileName[2]});
            let payload = {
                companyRegisteredName: Company.companyRegisteredName,
                companyOfficialAbbreviation: Company.companyOfficialAbbreviation,
                companyAddress: Company.companyAddress,
                companyTelephone: Company.companyTelephone,
                companyHQCountry: Company.companyHQCountry,
                companyWebsite: Company.companyWebsite,
                companyEmail: Company.companyEmail,
                companyType: Company.companyType,
                companyLogo: fileName[2]

            };
            this.setState({loading: true});
            createCompanyEntry(this.onCreateCompanyEntrySuccess, this.onCreateCompanyEntryFailure, payload);
        }


    };


    onSubmitUpdateCompany = (e) => {
        const CompanyID = e.target.dataset.fid;
        const {Company} = {...this.state};
        const {CompanyUpdate} = this.state;

        let payload = {};
        if (Company.companyRegisteredName){
            payload.companyRegisteredName = Company.companyRegisteredName;
            payload.oldCompanyRegisteredName = CompanyUpdate.companyRegisteredName;
        }
        if (Company.companyOfficialAbbreviation) payload.companyOfficialAbbreviation = Company.companyOfficialAbbreviation;
        if (Company.companyHQCountry) payload.companyHQCountry = Company.companyHQCountry;
        if (Company.companyWebsite) payload.companyWebsite = Company.companyWebsite;
        if (Company.companyType) payload.companyType = Company.companyType;
        if (Company.companyAddress) payload.companyAddress = Company.companyAddress;
        if (Company.companyTelephone) payload.companyTelephone = Company.companyTelephone;
        if (Company.companyEmail) payload.companyEmail = Company.companyEmail;
        if (Company.companyLogo) {
            let fileName = this.state.Company.companyLogo.split("\\");
            this.setState({companyLogo: fileName[2]});
            payload.companyLogo = fileName[2];
        }

        payload.id = CompanyUpdate.id;
        this.setState({loading: true});
        updateCompanyDataById(this.onUpdateSuccess, this.onUpdateFailure, payload);


    }

    onUpdateSuccess = (res) => {
        if (res.status === 200 ) {
            this.showAlert({
                type: "success",
                message: "COMPANY UPDATED SUCCESSFULLY!!!"
            });
            let reader = new FileReader();
            reader.readAsDataURL(this.state.files[0]);
            reader.onload = (e) => {
                const formData = {
                    file: e.target.result,
                    fileName: this.state.companyLogo
                }
                uploadFile(this.onUploadSuccess, this.onUploadFailure, formData).then(r => console.warn("result", r))

            }
        } else {
            this.showAlert({
                type: "error",
                message: "COMPANY UPDATION FAILED!!!"
            });

        }
        this.popupClose();
    }

    onUpdateFailure = (err) =>{
        this.popupClose();
    }

    onCreateCompanyEntrySuccess = (res) => {
        if (res.status === 200 ) {
            let reader = new FileReader();
            reader.readAsDataURL(this.state.files[0]);
            reader.onload = (e) => {
                const formData = {
                    file: e.target.result,
                    fileName: this.state.companyLogo
                }
                uploadFile(this.onUploadSuccess, this.onUploadFailure, formData).then(r => console.warn("result", r))

            }
            this.showAlert({
                type: "success",
                message: "COMPANY REGISTERED SUCCESSFULLY!!!"
            });
            this.popupClose();
        }

    }


    onUploadSuccess = (res) => {
        console.log(res);
    };

    onUploadFailure = (err) => {
        console.log(err);

    }

    onCreateCompanyEntryFailure = (err) => {
        this.showAlert({
            type: "error",
            message: "COMPANY REGISTRATION FAILED!!!"
        });
        this.popupClose();
    }

    valid = () => {
        const {
            Company
        } = {...this.state};

        if (Company.companyWebsite === null || Company.companyHQCountry === null || Company.companyLogo === null ||
            Company.companyTelephone === null || Company.companyAddress === null || Company.companyOfficialAbbreviation === null
            || Company.companyRegisteredName === null || Company.companyEmail === null) {

            this.showAlert({
                type: "error",
                message: "COMPANY REGISTRATION FAILED!!!"
            });


            return false;
        } else if (!Company.companyLogo.match(/\.(jpg|jpeg|png)$/)) {
            this.showAlert({
                type: "error",
                message: "Logo Must be in (jpg or jpeg or png format"
            });

            return false;
        } else
            return true;
    }


    render() {
        const {
            popup,
            CompanyUpdate,
            CompanyData,
            companyErrorObject,
            isCompanyEntryFormValid
        } = this.state;


        return (
            <SMSidebar history={this.props.history} screenPath={"/settings"}>
                <div className="smartShipBody d-flex flex-column vh-100">
                    <SmartShipLoader isVisible={false}/>
                    <CustomAlert ref={this.customAlertRef}/>
                    <NavigationBar
                        title={"Company Registration"}/>
                    {
                        <div className="flex-1 overflow-auto cbm-wrapper d-flex justify-content-center">
                            <div className="config-form-block alarm-form" style={{width: "98%"}}>
                                <nav
                                    className="MyTabs nav nav-tabs"
                                    style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}
                                >
                                    <a
                                        className="nav-item nav-link active"
                                        onClick={this.companyLoader}
                                    >Company Registration
                                    </a>
                                    <div style={{display: "flex"}}>
                                        <Button
                                            size="sm"
                                            className="float-right parameter-add-button"
                                            variant="outline-secondary"
                                            onClick={this.popupShow}
                                        >
                                            <img
                                                alt=""
                                                width={16}
                                                src={require('../../../Images/plus.png')}
                                                style={{marginRight: 6}}
                                            /> Add Company
                                        </Button>
                                    </div>
                                </nav>
                                <div>
                                    <Table bordered hover responsive="sm" size="sm" className="sm-alarm-table"
                                           style={{textAlign: "center"}}>
                                        <thead>
                                        <tr className="tableHeader">
                                            <th className="align-middle">Sr.No.</th>
                                            <th className="align-middle">Name</th>
                                            <th className="align-middle">Official Abbreviation</th>
                                            <th className="align-middle">HQ Country</th>
                                            <th className="align-middle">Website</th>
                                            <th className="align-middle">Company Type</th>
                                            <th className="align-middle">Address</th>
                                            <th className="align-middle">Telephone</th>
                                            <th className="align-middle">Email</th>
                                            <th className="align-middle">Logo</th>
                                            <th className="align-middle">Action</th>

                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            CompanyData.length>0 && CompanyData.map((item, index) => {
                                                return (
                                                    <tr key={index + 1}>
                                                        <td className="align-middle">{index + 1}</td>
                                                        <td className="align-middle">{item.companyRegisteredName}</td>
                                                        <td className="align-middle">{item.companyOfficialAbbreviation}</td>
                                                        <td className="align-middle">{item.companyHQCountry}</td>
                                                        <td className="align-middle">{item.companyWebsite}</td>
                                                        <td className="align-middle">{item.companyType}</td>
                                                        <td className="align-middle">{item.companyAddress}</td>
                                                        <td className="align-middle">{item.companyTelephone}</td>
                                                        <td className="align-middle">{item.companyEmail}</td>
                                                        <td className="align-middle">

                                                            <img style={{
                                                                width: 22,
                                                                cursor: "pointer",
                                                            }}
                                                                 alt="logo"
                                                                 src={`${logo_url}/${item.companyLogo}`}
                                                                 title="logo"

                                                            />

                                                        </td>

                                                        <td className="align-middle">
                                                            <div style={{
                                                                display: "flex",
                                                                justifyContent: "space-evenly"
                                                            }}>
                                                                <img style={{
                                                                    width: 18,
                                                                    cursor: "pointer"
                                                                }}
                                                                     alt="Edit Company"
                                                                     src={require('../../../Images/edit.png')}
                                                                     data-index={index + 1}
                                                                     data-fid={item.id}
                                                                     onClick={() => this.onCompanyEditClick(item.id)}
                                                                     title={"Edit Company"}
                                                                />

                                                                <img style={{
                                                                    width: 18,
                                                                    cursor: "pointer",
                                                                    marginLeft: "10px"
                                                                }}
                                                                     alt="Delete Company"
                                                                     src={require('../../../Images/delete.png')}
                                                                     data-index={index + 1}
                                                                     data-fid={item.id}
                                                                     onClick={() => this.onCompanyDeleteClick(item.companyEmail)}
                                                                     title="Delete Company"
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )

                                            })
                                        }
                                        </tbody>
                                    </Table>
                                </div>
                                <Modal
                                    size="lg"
                                    show={popup}
                                    onHide={this.popupClose}
                                    backdrop="static"
                                    centered
                                >
                                    <Modal.Header closeButton>
                                        <Modal.Title style={{color: "#6d6d6c"}}>Company Registration</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <div className="config-form-block sm-w-800">
                                            <div>
                                                <Form id="CompanyReg">
                                                    <Row>
                                                        <Form.Group size="sm" as={Col}>
                                                            <Form.Label>Name</Form.Label>
                                                            <Form.Control
                                                                placeholder="Company Registered Name"
                                                                name="companyRegisteredName"
                                                                autoComplete="off"
                                                                onChange={this.onFieldChange}
                                                                defaultValue={CompanyUpdate.companyRegisteredName}

                                                            />

                                                        </Form.Group>



                                                        <Form.Group size="sm" as={Col}>
                                                            <Form.Label>Official Abbreviation</Form.Label>
                                                            <Form.Control
                                                                placeholder="Company Official Abbreviation"
                                                                name="companyOfficialAbbreviation"
                                                                autoComplete="off"
                                                                onChange={this.onFieldChange}
                                                                defaultValue={CompanyUpdate.companyOfficialAbbreviation}

                                                            />


                                                        </Form.Group>

                                                    </Row>
                                                    <Row>
                                                        <Form.Group size="sm" as={Col}>
                                                            <Form.Label>HQ Country</Form.Label>
                                                            <Form.Control
                                                                placeholder="Company HQ Country"
                                                                name="companyHQCountry"
                                                                autoComplete="off"
                                                                onChange={this.onFieldChange}
                                                                defaultValue={CompanyUpdate.companyHQCountry}

                                                            />

                                                        </Form.Group>

                                                        <Form.Group size="sm" as={Col}>
                                                            <Form.Label>Website</Form.Label>
                                                            <Form.Control
                                                                placeholder="Company Website"
                                                                name="companyWebsite"
                                                                autoComplete="off"
                                                                onChange={this.onFieldChange}
                                                                defaultValue={CompanyUpdate.companyWebsite}
                                                                style={ErrorMessageCss(companyErrorObject["companyWebsite"])}
                                                            />
                                                            <ErrorMessage errorMessage={companyErrorObject["companyWebsite"]} />
                                                        </Form.Group>
                                                    </Row>
                                                    <Row>
                                                        <Form.Group size="sm" as={Col}>
                                                            <Form.Label>Company Type</Form.Label>
                                                            <Form.Control
                                                                placeholder="Company Type"
                                                                autoComplete="off"
                                                                name="companyType"
                                                                onChange={this.onFieldChange}
                                                                defaultValue={CompanyUpdate.companyType}

                                                            />

                                                        </Form.Group>

                                                        <Form.Group size="sm" as={Col}>
                                                            <Form.Label>Address</Form.Label>
                                                            <Form.Control
                                                                placeholder="Company Address"
                                                                autoComplete="off"
                                                                name="companyAddress"
                                                                onChange={this.onFieldChange}
                                                                defaultValue={CompanyUpdate.companyAddress}

                                                            />

                                                        </Form.Group>
                                                    </Row>
                                                    <Row>
                                                        <Form.Group size="sm" as={Col}>
                                                            <Form.Label>Telephone</Form.Label>
                                                            <Form.Control
                                                                placeholder="Company Telephone"
                                                                autoComplete="off"
                                                                name="companyTelephone"
                                                                onChange={this.onFieldChange}
                                                                defaultValue={CompanyUpdate.companyTelephone}
                                                                style={ErrorMessageCss(companyErrorObject["companyTelephone"])}
                                                                maxLength="13"
                                                            />
                                                            <ErrorMessage errorMessage={companyErrorObject["companyTelephone"]} />
                                                        </Form.Group>

                                                        <Form.Group size="sm" as={Col}>
                                                            <Form.Label>Email</Form.Label>
                                                            <Form.Control
                                                                placeholder="Company Email"
                                                                autoComplete="off"
                                                                name="companyEmail"
                                                                onChange={this.onFieldChange}
                                                                defaultValue={CompanyUpdate.companyEmail}
                                                                style={ErrorMessageCss(companyErrorObject["companyEmail"])}
                                                            />
                                                            <ErrorMessage errorMessage={companyErrorObject["companyEmail"]} />

                                                        </Form.Group>


                                                    </Row>
                                                    <Row>
                                                        <Form.Group size="sm" as={Col}>
                                                            <Form.Label>Upload Logo</Form.Label>
                                                            <Form.Control
                                                                placeholder="Company Logo"
                                                                autoComplete="off"
                                                                type="file"
                                                                name="companyLogo"
                                                                className="text-dark"
                                                                onChange={this.onFieldChange}
                                                                // defaultValue={CompanyUpdate.companyLogo}
                                                                style={ErrorMessageCss(companyErrorObject["companyLogo"])}
                                                            />
                                                            <ErrorMessage errorMessage={companyErrorObject["companyLogo"]}/>
                                                        </Form.Group>
                                                    </Row>
                                                </Form>
                                            </div>
                                        </div>
                                    </Modal.Body>
                                    <Modal.Footer style={{marginTop: "-20px"}}>
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
                                                CompanyUpdate.id === "" && (
                                                    <Button
                                                        size="sm"
                                                        className="parameter-add-button ml-0"
                                                        variant="outline-secondary"
                                                        onClick={this.onSubmitRegisterCompany}
                                                        disabled={!isCompanyEntryFormValid}
                                                    >
                                                        Register
                                                    </Button>
                                                )
                                            )
                                            || (
                                                <Button
                                                    size="sm"
                                                    className="parameter-add-button ml-0"
                                                    variant="outline-secondary"
                                                    data-fid={CompanyUpdate.id}
                                                    onClick={this.onSubmitUpdateCompany}
                                                    disabled={!isCompanyEntryFormValid}
                                                >
                                                    Update
                                                </Button>
                                            )
                                        }
                                    </Modal.Footer>
                                </Modal>
                            </div>
                        </div>
                    }
                </div>
            </SMSidebar>
        )
    }
}

export default CompanyEntryTable;
