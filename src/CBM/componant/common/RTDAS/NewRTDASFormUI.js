import React from "react";
import {Button, Col, Container, Form, FormControl, Row, Tab, Table, Tabs} from "react-bootstrap";
import Select from 'react-select';
import {
    getAllRTDASRegistrations,
    testRTDASConnection,
    saveRTDASRegistration,
    updateRTDASRegistration,
    saveJSONFile
} from "../../../../api"
import SmartShipLoader from "../SmartShipLoader";
import {defaultConnectionForm, defaultJsonForm, databaseTypeOptions} from "../../Constants";
import NavigationBar from "../NavigationBar";
import SMSidebar from "../../../../SMSidebar";
import {getValidatedValue} from "../validationHelper";


class NewRTDASFormUI extends React.Component {
    constructor(props) {
        debugger
        super(props);
        let connectionId = "-1";
        let selectedDbJsonTab = "DB";
        let isDuplicate = false;
        let connectionForm = JSON.parse(JSON.stringify(defaultConnectionForm));
        let jsonForm = JSON.parse(JSON.stringify(defaultJsonForm));
        if (props.location.data) {
            selectedDbJsonTab = props.location.data.selectedDbJsonTab;
            isDuplicate = !!props.location.data.isDuplicate;
            if("DB" === selectedDbJsonTab) {
                connectionForm = props.location.data.connectionForm;
                connectionId = connectionForm.connectionId;
            } else if("JSON" === selectedDbJsonTab) {
                jsonForm = props.location.data.jsonForm;
                connectionId = jsonForm.connectionId;
            }
        }
        this.state = {
            loading: false,
            connectionId,
            selectedDbJsonTab,
            connectionForm,
            jsonForm,
            isTestConnectionButtonDisabled: false,
            isTestConnectionSuccessful: false,
            isSaveConnectionDisabled: true,
            isSaveUpdateJsonDisabled: true,
            tableOptions:[],
            isDuplicate
        }
    }

    componentDidMount () {
        const jsonForm = this.state.jsonForm;
        const selectedFileStreamRadio = (jsonForm.fileStreamRadio ==="file"&& "fileObject")
            || (jsonForm.fileStreamRadio ==="stream"&& "streamObject");
        const isSaveUpdateJsonDisabled = this.getIsSaveUpdateJsonDisabled(jsonForm, selectedFileStreamRadio);
        const isTestConnectionButtonDisabled = this.getIsTestConnectionDisabled(this.state.connectionForm);
        this.setState({
            loading: false,
            isTestConnectionButtonDisabled,
            isSaveUpdateJsonDisabled
        })
    }


    saveRTDASRegistrationSuccess = (resp) =>{
        //debugger
        if(resp){
            const newId = this.state.selectedDbJsonTab==="JSON" ? resp.data :resp.data.data;
            this.props.history.push({
                pathname: '/MonitorPolicies',
                data: {
                    type: "rtdas",
                    uId: newId
                }
            })
        }

    };
    saveRTDASRegistrationFailure = (resp) =>{
        //debugger
        this.setState({
            loading: false
        })
    };
    updateRTDASRegistrationSuccess = (resp) =>{
        //debugger
        let connectionId = "-1"
        if("DB" === this.state.selectedDbJsonTab) {
            const connectionForm = {...this.state.connectionForm};
            connectionId = connectionForm.connectionId;
        } else if("JSON" === this.state.selectedDbJsonTab) {
            const jsonForm = {...this.state.jsonForm};
            connectionId = jsonForm.connectionId;
        }
        this.props.history.push({
            pathname: '/MonitorPolicies',
            data: {
                type: "rtdas",
                uId: connectionId
            }
        })
    };
    updateRTDASRegistrationFailure = (resp) => {
        this.setState({
            loading: false
        })
    };
    onTestConnectionSuccess = (resp) =>{
        ////debugger
        if(resp.data.error) {
            this.setState({
                loading: false
            }, () => {
                alert(resp.data.data)
            })
        } else {
            let tableOptions = [];
            for(let index = 0 ; index < resp.data.data.length ; index++){
                const val = resp.data.data[index];
                let table ={
                    label:val,
                    value:val
                }
                tableOptions.push(table);
            }
            this.setState({
                loading: false,
                isTestConnectionSuccessful: true,tableOptions
            })
        }
    };
    onTestConnectionFailure = (resp) =>{
        this.setState({
            loading: false
        })
    };

    /***
     * Connection form functions
     * **/
    getDbObjectForServer = (connectionForm) => {
        //debugger
        const {
            connectionId,
            rtdasName,
            rtdasDescription,
            databaseType,
            dataBaseName,
            host,
            port,
            username,
            password,
            selectedTable,
        } = connectionForm;
        const dbObjectForServer = {
            type: "DB",//DB, JSON
            dbObject:{
                rtdas_name: rtdasName,
                description: rtdasDescription,
                db_type: databaseType,
                db_name: dataBaseName,
                host: host,
                port: port,
                user_name: username,
                password: password,
                table_name: selectedTable
            }
        };

        return dbObjectForServer;
    };
    getIsTestConnectionDisabled = (connectionForm) => {
        ////debugger
        let isTestConnectionButtonDisabled = false;
        for (let key in connectionForm) {
            ////debugger
            if (!isTestConnectionButtonDisabled) {
                isTestConnectionButtonDisabled = connectionForm[key] === "";
            }
        }
        return isTestConnectionButtonDisabled;
    };
    onDbJsonTabSelect = (selectedTab) => {
        ////debugger
        this.setState({
            selectedDbJsonTab: selectedTab
        })
    };
    onConnectionFormItemValueChange = (event) => {
        ////debugger
        let connectionForm = {...this.state.connectionForm};
        const dataset = event.target.dataset;
        const key = dataset.key;

        const validatedValue = getValidatedValue(event.target.value, event.target.dataset.validation);
        if(validatedValue ==="" || validatedValue) {
            connectionForm[key] = validatedValue;
        }

        const isTestConnectionButtonDisabled = this.getIsTestConnectionDisabled(connectionForm);
        this.setState({
            connectionForm,
            isTestConnectionButtonDisabled,
            isTestConnectionSuccessful: false
        })
    };
    onConnectionFormTableDropdownValueChange = (selectedValue) => {
        //console.log(selectedValue);
        //debugger
        const isSaveConnectionDisabled = !selectedValue;
        let connectionForm = {...this.state.connectionForm};
        connectionForm.selectedTable = selectedValue;
        this.setState({
            connectionForm,
            isSaveConnectionDisabled
        });
    };
    onSaveConnectionClick = () => {
        //debugger
        let connectionForm = {...this.state.connectionForm};

        const selectedDbJsonTab = this.state.selectedDbJsonTab;
        const fileStreamRadio = this.state.jsonForm.fileStreamRadio;
        this.setState({
            loading: true
        });
        if (selectedDbJsonTab === "DB") {
            //debugger
            const payload = this.getDbObjectForServer(connectionForm);
            saveRTDASRegistration(this.saveRTDASRegistrationSuccess, this.saveRTDASRegistrationFailure, payload);
        } else if (selectedDbJsonTab === "JSON") {
            if ("file" === fileStreamRadio) {
                const fileObject = {...this.state.jsonForm.fileObject}
                const formData = this.getJSONFileObjectForServer(fileObject);
                ////debugger
                saveJSONFile(this.saveJSONFileSuccess, this.onFailure, formData);
            } else if ("stream" === fileStreamRadio) {
                //debugger
                const jsonForm = this.state.jsonForm;
                const streamObject = jsonForm.streamObject;
                const payload = this.getJSONStreamObjectForServer(streamObject);
                saveRTDASRegistration(this.saveRTDASRegistrationSuccess, this.saveRTDASRegistrationFailure, payload);
            }
        }
    };
    onUpdateConnectionClick = () => {
        //debugger
        const connectionForm = {...this.state.connectionForm};
        const selectedDbJsonTab = this.state.selectedDbJsonTab;
        const fileStreamRadio = this.state.jsonForm.fileStreamRadio;

        this.setState({
            loading: true,
        });
        if(selectedDbJsonTab === "DB") {
            const payload = this.getDbObjectForServer(connectionForm);
            const objectForServer = {
                [connectionForm.connectionId]: payload
            };
            /*this.setState({
                loading: true
            });*/
            updateRTDASRegistration(this.updateRTDASRegistrationSuccess,this.updateRTDASRegistrationFailure,objectForServer);
        } else if(selectedDbJsonTab === "JSON") {
            if("file" === fileStreamRadio) {
                //debugger
                const jsonForm = this.state.jsonForm;
                const fileObject = jsonForm.fileObject;
                let formData = this.getJSONFileObjectForServer(fileObject, jsonForm.connectionId);
                // formData.append("rtdasId", jsonForm.connectionId);
                saveJSONFile(this.updateJSONFileSuccess, this.onFailure, formData);
            } else if("stream" === fileStreamRadio) {
                //debugger
                const jsonForm = this.state.jsonForm;
                const streamObject = jsonForm.streamObject;
                const jsonObject = this.getJSONStreamObjectForServer(streamObject);
                const payload = {
                    [jsonForm.connectionId]: {...jsonObject}
                };
                updateRTDASRegistration(this.updateRTDASRegistrationSuccess,this.updateRTDASRegistrationFailure,payload);
            }
        }
    };
    onTestConnectionClick = () => {
        let connectionForm = {...this.state.connectionForm};
        let data = {
            dataBase:connectionForm.databaseType,
            host: connectionForm.host,
            port: connectionForm.port,
            user: connectionForm.username,
            password: connectionForm.password,
            dataBaseName:connectionForm.dataBaseName,
            selectedTable: null
        };
        this.setState({
            loading: true
        });
        testRTDASConnection(this.onTestConnectionSuccess,this.onTestConnectionFailure,data);
    };

    /**
     * JSON file
     * ***/
    getJSONFileObjectForServer = (fileObject, connectionId) => {
        //debugger
        let formData = new FormData();
        const {jsonName, jsonDescription, jsonFile} = fileObject;
        if(connectionId) {
            formData.append('rtdasId', connectionId);
        }
        formData.append('jsonName', jsonName);
        formData.append('jsonDescription', jsonDescription);
        formData.append('file', jsonFile.data);
        return formData;
    };
    getJSONStreamObjectForServer = (streamObject) => {
        //debugger
        const {
            jsonName,
            jsonDescription,
            jsonHost,
            jsonPort,
            fetchRecords,
            fetchRecordsinMilliseconds
        } = streamObject;
        const jsonObjectForServer = {
            type: "JSON",
            jsonObject: {
                type: "STREAM",
                streamObject: {
                    jsonName,
                    jsonDescription,
                    jsonHost,
                    jsonPort,
                    fetchRecords,
                    fetchRecordsinMilliseconds

                }
            }
        };
        return jsonObjectForServer;
    };
    saveJSONFileSuccess = (resp) => {
        const newId = resp.data;
        this.props.history.push({
            pathname: '/MonitorPolicies',
            data: {
                type: "rtdas",
                message: newId
            }
        })
    };
    updateJSONFileSuccess = (resp) => {
        //debugger
        const connectionId = this.state.jsonForm.connectionId;
        this.props.history.push({
            pathname: '/MonitorPolicies',
            data: {
                type: "rtdas",
                uId: connectionId
            }
        })
    };
    onFailure = () => {
        this.setState({
            loading: false,
        })
    };

    /**
     *  JSON form functions
     * ***/
    getIsSaveUpdateJsonDisabled = (jsonForm, selectedFileStreamRadio) => {
        //debugger
        let isSaveUpdateJsonDisabled = false;
        for (let key in jsonForm[selectedFileStreamRadio]) {
            ////debugger
            if (!isSaveUpdateJsonDisabled && "dateTimeOfMappingStarted" !== key) {
                if(key === "jsonFile") {
                    //debugger
                    /**
                     *
                     * **/
                    isSaveUpdateJsonDisabled = jsonForm[selectedFileStreamRadio].jsonFile.name === "" || Array.isArray(jsonForm[selectedFileStreamRadio].jsonFile.data);
                } else {
                    isSaveUpdateJsonDisabled = jsonForm[selectedFileStreamRadio][key] === "";
                }
            }
        }
        return isSaveUpdateJsonDisabled;
    };
    onJSONFormItemValueChange = (event) => {
        ////debugger
        let jsonForm = {...this.state.jsonForm};
        const targetType = event.target.type;
        const dataset = event.target.dataset;
        const key = dataset.key;
        let selectedFileStreamRadio ="fileObject";

        if(key === "jsonFile") {
            ////debugger
            const  jsonFile = {
                name:event.target.files[0].name,
                data: event.target.files[0]
            };
            selectedFileStreamRadio = (jsonForm.fileStreamRadio ==="file"&& "fileObject")
                || (jsonForm.fileStreamRadio ==="stream"&& "streamObject");
            jsonForm[selectedFileStreamRadio].jsonFile = {...jsonFile};
        } else if(key === "fileStreamRadio") {
            const selectedRadioOption = event.target.dataset.radioname;
            jsonForm[key] = selectedRadioOption;
            selectedFileStreamRadio = (jsonForm.fileStreamRadio ==="file"&& "fileObject")
                || (jsonForm.fileStreamRadio ==="stream"&& "streamObject");
        } else {
            selectedFileStreamRadio = (jsonForm.fileStreamRadio ==="file"&& "fileObject")
                || (jsonForm.fileStreamRadio ==="stream"&& "streamObject");

            const validatedValue = getValidatedValue(event.target.value, event.target.dataset.validation);
            if(validatedValue ==="" || validatedValue) {
                jsonForm[selectedFileStreamRadio][key] = validatedValue;
            }
        }
        const isSaveUpdateJsonDisabled = this.getIsSaveUpdateJsonDisabled(jsonForm, selectedFileStreamRadio);
        this.setState({
            jsonForm,
            isSaveUpdateJsonDisabled,
            isTestConnectionSuccessful: false
        })
    };

    resetToDefaultView = () => {
        this.props.history.goBack();
    };

    render() {
        const {
            loading,
            connectionForm,
            isTestConnectionSuccessful,
            isTestConnectionButtonDisabled,
            isSaveConnectionDisabled,
            selectedDbJsonTab,
            tableOptions,
            jsonForm,
            isSaveUpdateJsonDisabled,
            isDuplicate
        } = this.state;
        const {
            onDbJsonTabSelect,
            onConnectionFormItemValueChange,
            onConnectionFormTableDropdownValueChange,
            onSaveConnectionClick,
            onUpdateConnectionClick,
            onTestConnectionClick,
            onJSONFormItemValueChange,
        } = this;

        const selectedFileStreamRadio = (jsonForm.fileStreamRadio ==="file"&& "fileObject")
            || (jsonForm.fileStreamRadio ==="stream"&& "streamObject");
        //debugger
        const isUpdateDBConnection = connectionForm.connectionId !== "-1" || isDuplicate;
        const isUpdateJSONConnection = jsonForm.connectionId !== "-1" || isDuplicate;

        return (
            <SMSidebar history={this.props.history} screenPath={"/Alarm"}>
                <div className="smartShipBody d-flex flex-column vh-100">
                    <SmartShipLoader isVisible={loading}/>
                    <NavigationBar
                        title={"RTDAS Registration"}/>
                    <div className="d-flex justify-content-center pt-5 overflow-auto cbm-wrapper">
                        <div className="config-form-block sm-w-700" style={{margin: "0px auto"}}>
                            <div className="config-form-block-header">
                                RTDAS Registration
                            </div>
                            <div >
                                <Tabs
                                    defaultActiveKey={selectedDbJsonTab}
                                    id="uncontrolled-tab-example"
                                    onSelect={onDbJsonTabSelect}
                                >
                                    {/*selectedDbJsonTab {selectedDbJsonTab}*/}
                                    <Tab
                                        eventKey="DB"
                                        title="DB"
                                        disabled={isUpdateJSONConnection && selectedDbJsonTab!=="DB"}>
                                        <div className={"mt-4"}>
                                            <Row>
                                                <Form.Group size="sm" as={Col}>
                                                    <Form.Label>Name</Form.Label>
                                                    <Form.Control
                                                        placeholder="Name"
                                                        data-key="rtdasName"
                                                        onChange={onConnectionFormItemValueChange}
                                                        value={connectionForm["rtdasName"]}
                                                        autoComplete="off"
                                                    />
                                                </Form.Group>
                                                <Form.Group size="sm" as={Col}>
                                                    <Form.Label>Description</Form.Label>
                                                    <Form.Control
                                                        placeholder="Description"
                                                        data-key="rtdasDescription"
                                                        onChange={onConnectionFormItemValueChange}
                                                        value={connectionForm["rtdasDescription"]}
                                                        autoComplete="off"
                                                    />
                                                </Form.Group>
                                            </Row>
                                            <Row>
                                                <Form.Group size="sm" as={Col}>
                                                    <Form.Label>Database Type</Form.Label>
                                                    <Form.Control
                                                        as="select"
                                                        value={connectionForm["databaseType"]}
                                                        data-key="databaseType"
                                                        data-dropdownname="databaseType"
                                                        onChange={onConnectionFormItemValueChange}
                                                    >
                                                        {
                                                            databaseTypeOptions.map((opt, index) => {
                                                                return (
                                                                    <option key={`dbTypes-${index}`}>{opt.label}</option>
                                                                )
                                                            })
                                                        }
                                                    </Form.Control>
                                                </Form.Group>
                                                <Form.Group size="sm" as={Col}>
                                                    <Form.Label>Database Name</Form.Label>
                                                    <Form.Control
                                                        placeholder="Database Name"
                                                        data-key="dataBaseName"
                                                        onChange={onConnectionFormItemValueChange}
                                                        value={connectionForm["dataBaseName"]}
                                                        autoComplete="off"
                                                    />
                                                </Form.Group>
                                            </Row>
                                            <Row>
                                                <Form.Group size="sm" as={Col}>
                                                    <Form.Label>Host</Form.Label>
                                                    <Form.Control
                                                        placeholder="Host"
                                                        data-key="host"
                                                        onChange={onConnectionFormItemValueChange}
                                                        value={connectionForm["host"]}
                                                        autoComplete="off"
                                                    />
                                                </Form.Group>
                                                <Form.Group size="sm" as={Col}>
                                                    <Form.Label>Port</Form.Label>
                                                    <Form.Control
                                                        placeholder="Port"
                                                        data-key="port"
                                                        data-validation="integer"
                                                        onChange={onConnectionFormItemValueChange}
                                                        value={connectionForm["port"]}
                                                        autoComplete="off"
                                                    />
                                                </Form.Group>
                                            </Row>
                                            <Row>
                                                <Form.Group size="sm" as={Col}>
                                                    <Form.Label>Username</Form.Label>
                                                    <Form.Control
                                                        placeholder="Username"
                                                        data-key="username"
                                                        onChange={onConnectionFormItemValueChange}
                                                        value={connectionForm["username"]}
                                                        autoComplete="off"
                                                    />
                                                </Form.Group>
                                                <Form.Group size="sm" as={Col}>
                                                    <Form.Label>Password</Form.Label>
                                                    <Form.Control
                                                        placeholder="Password"
                                                        data-key="password"
                                                        type="password"
                                                        onChange={onConnectionFormItemValueChange}
                                                        value={connectionForm["password"]}
                                                        autoComplete="off"
                                                    />
                                                </Form.Group>
                                            </Row>
                                            <Row style={{marginBottom: 0}}>
                                                <Form.Group
                                                    size="sm" as={Col}
                                                    className="d-flex flex-row justify-content-between mt-2 mb-2"
                                                >
                                                    {
                                                        !isTestConnectionSuccessful &&
                                                        (<Button
                                                            size="sm"
                                                            className="parameter-header-button"
                                                            onClick={this.resetToDefaultView}
                                                            variant="outline-secondary">
                                                            Cancel
                                                        </Button>)
                                                    }
                                                    <Button
                                                        size="sm"
                                                        className="parameter-header-button ml-0"
                                                        onClick={onTestConnectionClick}
                                                        variant="outline-secondary"
                                                        disabled={isTestConnectionButtonDisabled}
                                                    >
                                                        Test Connection
                                                    </Button>
                                                </Form.Group>
                                            </Row>
                                            {
                                                isTestConnectionSuccessful && [
                                                    (<Row key="selectTableUI">
                                                        <Form.Group size="sm" as={Col}>
                                                            <Form.Label>Select Table</Form.Label>
                                                            <Select
                                                                options={tableOptions}
                                                                key="selectedTable"
                                                                data-key="selectedTable"
                                                                onChange={onConnectionFormTableDropdownValueChange}
                                                                isMulti={true}
                                                                closeMenuOnSelect={true}
                                                                defaultValue={connectionForm["selectedTable"]}
                                                                menuPlacement="top"
                                                            />
                                                        </Form.Group>
                                                    </Row>),
                                                    (<Row key="rtdasSaveCancelButton" style={{marginBottom: 0}}>
                                                        <Form.Group size="sm" as={Col}
                                                                    className="d-flex flex-row justify-content-between mt-2"
                                                        >
                                                            <Button
                                                                size="sm"
                                                                className="parameter-header-button"
                                                                onClick={this.resetToDefaultView}
                                                                variant="outline-secondary">
                                                                Cancel
                                                            </Button>
                                                            {
                                                                connectionForm.connectionId === "-1" ? (<Button
                                                                        size="sm"
                                                                        className="parameter-header-button"
                                                                        onClick={onSaveConnectionClick}
                                                                        variant="outline-secondary"
                                                                        disabled={!isTestConnectionSuccessful || isSaveConnectionDisabled}
                                                                    >
                                                                        Save
                                                                    </Button>)
                                                                    : (<Button
                                                                        size="sm"
                                                                        className="parameter-header-button"
                                                                        onClick={onUpdateConnectionClick}
                                                                        variant="outline-secondary"
                                                                        disabled={!isTestConnectionSuccessful || isSaveConnectionDisabled}
                                                                    >
                                                                        Update
                                                                    </Button>)
                                                            }
                                                        </Form.Group>
                                                    </Row>)
                                                ]
                                            }
                                        </div>
                                    </Tab>
                                    <Tab
                                        eventKey="JSON"
                                        title="JSON"
                                        disabled={isUpdateDBConnection && selectedDbJsonTab!=="JSON"}>
                                        <div className={"mt-4"}>
                                            <div key={`inline-radio`} style={{whiteSpace: "nowrap"}}>
                                                <Form.Check
                                                    name="fileStreamRadio" inline
                                                    label="CSV"
                                                    type="radio"
                                                    id={`file-inline-radio`}
                                                    data-key="fileStreamRadio"
                                                    data-radioname="file"
                                                    checked={jsonForm["fileStreamRadio"] === 'file'}
                                                    onChange={onJSONFormItemValueChange}
                                                    disabled={isUpdateJSONConnection && jsonForm["fileStreamRadio"] !== 'file'}
                                                />
                                                <Form.Check
                                                    name="fileStreamRadio" inline
                                                    label="Stream"
                                                    type="radio"
                                                    id={`stream-inline-radio`}
                                                    data-key="fileStreamRadio"
                                                    data-radioname="stream"
                                                    checked={jsonForm["fileStreamRadio"] === 'stream'}
                                                    onChange={onJSONFormItemValueChange}
                                                    disabled={isUpdateJSONConnection && jsonForm["fileStreamRadio"] !== 'stream'}
                                                />
                                            </div>
                                            <Row>
                                                <Form.Group size="sm" as={Col}>
                                                    <Form.Label>Name</Form.Label>
                                                    <Form.Control
                                                        placeholder="Name"
                                                        data-key="jsonName"
                                                        onChange={onJSONFormItemValueChange}
                                                        value={jsonForm[selectedFileStreamRadio]["jsonName"]}
                                                        autoComplete="off"
                                                    />
                                                </Form.Group>
                                                <Form.Group size="sm" as={Col}>
                                                    <Form.Label>Description</Form.Label>
                                                    <Form.Control
                                                        placeholder="Description"
                                                        data-key="jsonDescription"
                                                        onChange={onJSONFormItemValueChange}
                                                        value={jsonForm[selectedFileStreamRadio]["jsonDescription"]}
                                                        autoComplete="off"
                                                    />
                                                </Form.Group>
                                            </Row>
                                            {
                                                (jsonForm["fileStreamRadio"] === 'file' && (
                                                    <Row>
                                                        <Form.Group size="sm" as={Col}>
                                                            <Form.Label>Select JSON File</Form.Label>
                                                            <FormControl
                                                                type="file"
                                                                data-key="jsonFile"
                                                                onChange={onJSONFormItemValueChange}
                                                                multiple={false}
                                                                accept=".csv"
                                                                // value={jsonForm["fileObject"].jsonFile.data}
                                                            />
                                                        </Form.Group>
                                                    </Row>
                                                ))
                                                || (
                                                    jsonForm["fileStreamRadio"] === 'stream' && (
                                                        <div>
                                                            <Row>
                                                                <Form.Group size="sm" as={Col}>
                                                                    <Form.Label>Host</Form.Label>
                                                                    <Form.Control
                                                                        placeholder="Host"
                                                                        data-key="jsonHost"
                                                                        onChange={onJSONFormItemValueChange}
                                                                        value={jsonForm["streamObject"]["jsonHost"]}
                                                                        autoComplete="off"
                                                                    />
                                                                </Form.Group>
                                                                <Form.Group size="sm" as={Col}>
                                                                    <Form.Label>Port</Form.Label>
                                                                    <Form.Control
                                                                        placeholder="Port"
                                                                        data-key="jsonPort"
                                                                        data-validation="integer"
                                                                        onChange={onJSONFormItemValueChange}
                                                                        value={jsonForm["streamObject"]["jsonPort"]}
                                                                        autoComplete="off"
                                                                    />
                                                                </Form.Group>
                                                            </Row>
                                                            <Row>
                                                                <Form.Group size="sm" as={Col}>
                                                                    <Form.Label>Fetch Records</Form.Label>
                                                                    <Form.Control
                                                                        placeholder="Fetch Records"
                                                                        data-key="fetchRecords"
                                                                        data-validation="integer"
                                                                        onChange={onJSONFormItemValueChange}
                                                                        value={jsonForm["streamObject"]["fetchRecords"]}
                                                                        autoComplete="off"
                                                                    />
                                                                </Form.Group>
                                                                <Form.Group size="sm" as={Col}>
                                                                    <Form.Label>Fetch Records in Milliseconds</Form.Label>
                                                                    <Form.Control
                                                                        placeholder="Fetch Records in Milliseconds"
                                                                        data-key="fetchRecordsinMilliseconds"
                                                                        data-validation="float"
                                                                        onChange={onJSONFormItemValueChange}
                                                                        value={jsonForm["streamObject"]["fetchRecordsinMilliseconds"]}
                                                                        autoComplete="off"
                                                                    />
                                                                </Form.Group>
                                                            </Row>
                                                        </div>)
                                                )
                                            }
                                            <div>
                                                <Row style={{marginBottom: 0}}>
                                                    <Form.Group
                                                        size="sm" as={Col}
                                                        className="d-flex flex-row justify-content-between mt-2"
                                                    >
                                                        <Button
                                                            size="sm"
                                                            className="parameter-header-button"
                                                            onClick={this.resetToDefaultView}
                                                            variant="outline-secondary">
                                                            Cancel
                                                        </Button>
                                                        {
                                                            jsonForm.connectionId === "-1" ? (<Button
                                                                    size="sm"
                                                                    className="parameter-header-button"
                                                                    onClick={onSaveConnectionClick}
                                                                    variant="outline-secondary"
                                                                    disabled={isSaveUpdateJsonDisabled}
                                                                >
                                                                    Save
                                                                </Button>)
                                                                : (<Button
                                                                    size="sm"
                                                                    className="parameter-header-button"
                                                                    onClick={onUpdateConnectionClick}
                                                                    variant="outline-secondary"
                                                                    disabled={isSaveUpdateJsonDisabled}
                                                                >
                                                                    Update
                                                                </Button>)
                                                        }
                                                    </Form.Group>
                                                </Row>
                                            </div>
                                        </div>
                                    </Tab>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </div>
            </SMSidebar>
        )
    }
}

export default NewRTDASFormUI;


