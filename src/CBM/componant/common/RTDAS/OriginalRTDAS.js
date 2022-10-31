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
import SmartShipLoader from "./SmartShipLoader";

const databaseTypeOptions = [
    {value: 'mySQL', label: 'mySQL'},
    {value: 'HSQL', label: 'HSQL'},
    {value: 'Oracle', label: 'Oracle'},
    {value: 'PostgresSQL', label: 'PostgresSQL'},
    {value: 'Sybase', label: 'Sybase'},
];
const defaultConnectionForm = {
    connectionId: -1,
    rtdasName: "",
    rtdasDescription: "",
    databaseType: "mySQL",
    selectedTable: [],
    dataBaseName: "",
    host: "",
    port: "",
    username: "",
    password: "",
};
const defaultJsonForm = {
    connectionId: -1,//todo
    fileStreamRadio:"file",
    fileObject: {
        jsonName: "",
        jsonDescription: "",
        jsonFile:{
            name:"",
            data:""
        },
    },
    streamObject: {
        jsonName: "",
        jsonDescription: "",
        jsonHost:"",
        jsonPort:"",
        fetchRecords:"",
        fetchRecordsinMilliseconds:""
    }
};

const ConnectionFormUI = ({
                              selectedDbJsonTab,
                              connectionForm,
                              isTestConnectionButtonDisabled,
                              isSaveConnectionDisabled,
                              isTestConnectionSuccessful,
                              onDbJsonTabSelect,
                              jsonForm,
                              isSaveUpdateJsonDisabled,
                              onConnectionFormItemValueChange,
                              onConnectionFormTableDropdownValueChange,
                              onSaveConnectionClick,
                              onCancelConnectionClick,
                              onUpdateConnectionClick,
                              onTestConnectionClick,
                              tableOptions,
                              onJSONFormItemValueChange,
                          }) => {

    // //debugger
    /*for (let rbIndex = 0; rbIndex < tableList.length; rbIndex++) {
        //debugger
        const ruleChainItem = tableList[rbIndex];
        tableOptions.push({
            value: `RC-${ruleChainItem.ruleChainId}`,
            label: ruleChainItem.ruleChainName
        })
    }*/

    const selectedFileStreamRadio = (jsonForm.fileStreamRadio ==="file"&& "fileObject")
        || (jsonForm.fileStreamRadio ==="stream"&& "streamObject");
    //debugger
    const isUpdateDBConnection = connectionForm.connectionId !== -1;
    const isUpdateJSONConnection = jsonForm.connectionId !== -1;
    return (
        <Container>
            <Row ld={8} md={8} xs={8}>
                <div id="parametersUI">
                    <div className="cardHeader">
                        RTDAS Registration
                    </div>
                    <div style={{
                        width: "100%",
                        paddingTop: 15,
                        paddingRight: 15,
                        paddingLeft: 15,
                        paddingBottom: 10
                    }}>
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
                                <div>
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
                                        <Form.Group size="sm" as={Col}
                                                    style={{
                                                        display: "flex",
                                                        padding: "10px 10px  0px 10px",
                                                        justifyContent: "center"
                                                    }}>
                                            <Button
                                                size="sm"
                                                className="parameter-header-button"
                                                onClick={onTestConnectionClick}
                                                variant="outline-secondary"
                                                disabled={isTestConnectionButtonDisabled}
                                            >
                                                Test Connection
                                            </Button>
                                            {
                                                !isTestConnectionSuccessful &&
                                                (<Button
                                                    size="sm"
                                                    className="parameter-header-button"
                                                    onClick={onCancelConnectionClick}
                                                    variant="outline-secondary">
                                                    Cancel
                                                </Button>)
                                            }
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
                                                            style={{
                                                                display: "flex",
                                                                padding: 10,
                                                                justifyContent: "center"
                                                            }}>
                                                    {
                                                        connectionForm.connectionId === -1 ? (<Button
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
                                                    <Button
                                                        size="sm"
                                                        className="parameter-header-button"
                                                        onClick={onCancelConnectionClick}
                                                        variant="outline-secondary">
                                                        Cancel
                                                    </Button>
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
                                <div>
                                    <div key={`inline-radio`} style={{whiteSpace: "nowrap"}}>
                                        <Form.Check
                                            name="fileStreamRadio" inline
                                            label="File"
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
                                                        accept="application/JSON"
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
                                            <Form.Group size="sm" as={Col}
                                                        style={{
                                                            display: "flex",
                                                            padding: 10,
                                                            justifyContent: "center"
                                                        }}>
                                                {
                                                    jsonForm.connectionId === -1 ? (<Button
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
                                                <Button
                                                    size="sm"
                                                    className="parameter-header-button"
                                                    onClick={onCancelConnectionClick}
                                                    variant="outline-secondary">
                                                    Cancel
                                                </Button>
                                            </Form.Group>
                                        </Row>
                                    </div>
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </Row>
        </Container>
    )
};

const ConnectionTableUI = ({
                               connectionList,
                               onConnectionItemEdit,
                               onAddNewConnectionClick,
                           }) => {
    return (
        <Container>
            <Row ld={8} md={8} xs={8}>
                <div style={{
                    width: "100%",
                    borderWidth: 1,
                    borderColor: "black",
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: 10,
                    maxWidth: 700,
                    margin: "0px auto",
                    paddingBottom: 10
                }}>
                    <Button className="SM-button" onClick={onAddNewConnectionClick}
                            variant="outline-secondary">
                        <img
                            alt=""
                            width={16}
                            src={require('../../Images/plus.png')}
                            style={{marginRight: 6}}
                        />
                        Configure RTDAS and Upload CSV
                    </Button>
                </div>
                <Table style={{maxWidth: 700, margin: "0px auto"}} striped bordered hover size="sm">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Database Source</th>
                        <th>Table Name/ Url</th>
                        <th>Action</th>
                        {/*<th>Delete</th>*/}
                    </tr>
                    </thead>
                    <tbody>
                    {
                        connectionList.map((connectionItem, index) => {
                            //debugger
                            let name,
                                databaseType="-",
                                tableList="-";
                            const type = connectionItem.type;
                            if("DB" === type) {
                                //debugger
                                name = connectionItem.dbObject.rtdasName;
                                databaseType = connectionItem.dbObject.databaseType;
                                tableList = connectionItem.dbObject.selectedTable.map((table) => `[${table.label}] `)
                            } else if("JSON" === type) {
                                const jsonObject = connectionItem.jsonObject;
                                if("FILE" === jsonObject.type) {
                                    name = jsonObject.fileObject.jsonName;
                                } else if("STREAM" === jsonObject.type) {
                                    name = jsonObject.streamObject.jsonName;
                                }
                            }
                            const connectionId = connectionItem.connectionId;
                            // const tableList = connectionItem.type==="DB" ? connectionItem.selectedTable.map((table) => `[${table.label}] `): [];
                            // const tableList = [];
                            // connectionItem.dbObject;
                            return (
                                <tr key={`cti-${index}`}>
                                    <td>{name}</td>
                                    <td>{type}</td>
                                    <td>{databaseType}</td>
                                    <td>{tableList}</td>
                                    <td>
                                        <div
                                            title={"Edit RTDAS"}
                                            // style={{textAlign: "center"}}
                                        >
                                            <img style={{width: 18, cursor: "pointer"}}
                                                 alt="Edit RTDAS"
                                                 data-index={index}
                                                 data-connectionid={connectionId}
                                                 src={require('../../../Images/edit.png')}
                                                 onClick={onConnectionItemEdit}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </Table>
            </Row>
        </Container>
    )
};

class ConnectionUI extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            connectionList: [],
            connectionId: 12,
            connectionForm: {...defaultConnectionForm},
            jsonForm: {...defaultJsonForm},
            selectedDbJsonTab: 'DB',
            isTestConnectionButtonDisabled: false,
            isConnectionTableVisible: true,
            isTestConnectionSuccessful: false,
            isSaveConnectionDisabled: true,
            isSaveUpdateJsonDisabled: true,
            tableOptions:[]
        }
    }

    componentDidMount () {
        getAllRTDASRegistrations(this.onGetAllRTDASRegsSuccess,this.onGetAllRTDASRegsFailure)
    }
    onGetAllRTDASRegsSuccess = (resp) => {
        //debugger
        const connectionListFromServer = resp.data.data;
        if (connectionListFromServer) {
            let connectionList = [];
            let connectionListItem = {};
            for(let clKey in connectionListFromServer) {
                //debugger
                //console.log(connectionListFromServer[clKey]);
                const currentConnectionListItem = connectionListFromServer[clKey];
                const connectionId = clKey;
                const type = currentConnectionListItem.type;
                if("JSON" === type) {
                    connectionListItem = {
                        ...{
                            ...currentConnectionListItem,
                            connectionId
                        }
                    };
                } else if("DB" === type){
                    //debugger
                    let tableNames = [];
                    const dbObject = currentConnectionListItem.dbObject;
                    for (let innerIndex = 0; innerIndex < dbObject.table_name.length; innerIndex++) {
                        let table = {
                            value: dbObject.table_name[innerIndex].value,
                            label: dbObject.table_name[innerIndex].value
                        };
                        tableNames.push(table);
                    }
                    connectionListItem = {
                        connectionId,
                        type: "DB",
                        dbObject: {
                            connectionId: dbObject.id,
                            rtdasName: dbObject.rtdas_name,
                            rtdasDescription: dbObject.description,
                            databaseType: dbObject.db_type,
                            dataBaseName: dbObject.db_name,
                            host: dbObject.host,
                            port: dbObject.port,
                            username: dbObject.user_name,
                            password: dbObject.password,
                            selectedTable: tableNames
                        }
                    }
                }
                connectionList.unshift(connectionListItem);
            }
            /*for (let index = 0; index < connectionListFromServer.length; index++) {
                //debugger
                let tableNames = [];
                for (let innerIndex = 0; innerIndex < connectionListFromServer[index].table_name.length; innerIndex++) {
                    let table = {
                        value: connectionListFromServer[index].table_name[innerIndex],
                        label: connectionListFromServer[index].table_name[innerIndex]
                    }
                    tableNames.push(table);
                }
                let connectionData = {
                    connectionId: connectionListFromServer[index].id,
                    rtdasName: connectionListFromServer[index].rtdas_name,
                    rtdasDescription: connectionListFromServer[index].description,
                    databaseType: connectionListFromServer[index].db_type,
                    dataBaseName: connectionListFromServer[index].db_name,
                    host: connectionListFromServer[index].host,
                    port: connectionListFromServer[index].port,
                    username: connectionListFromServer[index].user_name,
                    password: connectionListFromServer[index].password,
                    selectedTable: tableNames
                }
                //debugger
                connectionList.unshift(connectionData);
            }*/
            //debugger
            this.setState({
                loading: false,
                connectionList
            })
        }
    };
    onGetAllRTDASRegsFailure = (resp) => {
        this.setState({
            loading: false
        })
    };
    saveRTDASRegistrationSuccess = (resp) =>{
        //debugger
        if(resp){
            const newId = this.state.selectedDbJsonTab==="JSON" ? resp.data :resp.data.data;
            const newObject = this.getObjectForUI(newId);
            let connectionList = [newObject, ...this.state.connectionList];
            this.setState({
                loading: false,
                connectionForm: {...defaultConnectionForm},
                isTestConnectionButtonDisabled: true,
                isConnectionTableVisible: true,
                connectionList
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
        let connectionList = [...this.state.connectionList];
        if("DB" === this.state.selectedDbJsonTab) {
            const connectionForm = {...this.state.connectionForm};
            const connectionId = connectionForm.connectionId;
            for (let rbIndex = 0; rbIndex < connectionList.length; rbIndex++) {
                const connectionItem = {...connectionList[rbIndex]};
                if (connectionId === connectionItem.connectionId) {
                    //debugger
                    let connectionListItem = connectionList[rbIndex];
                    connectionListItem.dbObject = {...connectionForm};
                    connectionList[rbIndex] = connectionListItem;
                    break;
                }
            }
        } else if("JSON" === this.state.selectedDbJsonTab) {
            const jsonForm = {...this.state.jsonForm};
            const connectionId = jsonForm.connectionId;
            for (let rbIndex = 0; rbIndex < connectionList.length; rbIndex++) {
                const connectionItem = {...connectionList[rbIndex]};
                if (connectionId === connectionItem.connectionId) {
                    //debugger
                    let connectionListItem = connectionList[rbIndex];
                    connectionListItem.jsonObject = {...jsonForm};
                    connectionList[rbIndex] = connectionListItem;
                    break;
                }
            }
        }
        this.setState({
            loading: false,
            connectionList,
            isTestConnectionButtonDisabled: true,
            isConnectionTableVisible: true
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

    getObjectForUI = (newId) => {
        ////debugger
        let payload = {};
        let dbObject = {};
        let fileObject = {};
        let streamObject = {};

        const selectedDbJsonTab = this.state.selectedDbJsonTab;
        const fileStreamRadio = this.state.jsonForm.fileStreamRadio;

        if(selectedDbJsonTab === "DB") {
            let connectionForm = {...this.state.connectionForm};
            connectionForm.connectionId = newId;
            dbObject = {...connectionForm};
        } else if(selectedDbJsonTab === "JSON"){
            ////debugger
            let jsonForm = {...this.state.jsonForm};
            if("file" === fileStreamRadio) {
                const {jsonName, jsonDescription, jsonFile} = {...jsonForm.fileObject};
                ////debugger
                fileObject = {
                    jsonName,
                    jsonDescription,
                    jsonFile: {...jsonFile}
                }
            } else if("stream" === fileStreamRadio) {
                streamObject = {...jsonForm.streamObject}
            }
        }

        payload = {
            connectionId: newId,
            type: selectedDbJsonTab,//DB, JSON
            jsonObject: {
                type: fileStreamRadio.toLocaleUpperCase(),//FILE, STREAM
                fileObject,
                streamObject,
            },
            dbObject
        };

        return payload;
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
        connectionForm[key] = event.target.value;
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
        // const isTestConnectionButtonDisabled= this.getIsTestConnectionDisabled(connectionForm);
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
        // let connectionList = [...this.state.connectionList];
        // const connectionId = connectionForm.connectionId;
        // for (let rbIndex = 0; rbIndex < connectionList.length; rbIndex++) {
        //     const connectionItem = {...connectionList[rbIndex]};
        //     if (connectionId === connectionItem.connectionId) {
        //         connectionList[rbIndex] = connectionForm;
        //         break;
        //     }
        // }
        // this.setState({
        //     connectionList,
        //     isTestConnectionButtonDisabled: true,
        //     isConnectionTableVisible: true
        // })

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
    onCancelConnectionClick = () => {
        this.toggleConnectionTableUI();
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
        //debugger
        let connectionList = this.state.connectionList;
        let connectionId = -1;
        //console.log(resp);
        if(resp.status === 200 && resp.statusText === "OK") {
            const newId = resp.data;
            const newObject = this.getObjectForUI(newId);
            connectionId = newId
            connectionList = [newObject, ...connectionList]
        }
        this.setState({
            loading: false,
            connectionList,
            jsonForm: {...defaultJsonForm},
            isTestConnectionButtonDisabled: true,
            isConnectionTableVisible: true,
            connectionId
        });
    };
    updateJSONFileSuccess = (resp) => {
        //debugger
        let connectionList = this.state.connectionList;
        const connectionId = this.state.jsonForm.connectionId;
        if(resp.status === 200 && resp.statusText === "OK") {
            //debugger
            for (let clIndex = 0; clIndex < connectionList.length; clIndex++) {
                if(connectionList[clIndex].connectionId === connectionId) {
                    //debugger
                    let connectionListItem = {...connectionList[clIndex]};
                    connectionListItem.jsonObject = {
                        type: "FILE",
                        fileObject: this.state.jsonForm.fileObject
                    };
                    connectionList[clIndex] =  connectionListItem;
                    break;
                }
            }
        }
        this.setState({
            loading: false,
            connectionList,
            jsonForm: {...defaultJsonForm},
            isTestConnectionButtonDisabled: true,
            isConnectionTableVisible: true,
            connectionId: -1
        });
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
            jsonForm[selectedFileStreamRadio][key] = event.target.value;
        }
        const isSaveUpdateJsonDisabled = this.getIsSaveUpdateJsonDisabled(jsonForm, selectedFileStreamRadio);
        this.setState({
            jsonForm,
            isSaveUpdateJsonDisabled,
            isTestConnectionSuccessful: false
        })
    };

    /**
     * Connection Table Functions
     * **/
    onConnectionItemEdit = (event) => {
        ////debugger
        let selectedDbJsonTab="DB";
        const connectionId = event.target.dataset.connectionid;
        const connectionList = [...this.state.connectionList];
        let connectionForm = {...this.state.connectionForm};
        let jsonForm = {...this.state.jsonForm};
        for (let rbIndex = 0; rbIndex < connectionList.length; rbIndex++) {
            const connectionItem = connectionList[rbIndex];
            if (connectionId === connectionItem.connectionId) {
                const type = connectionItem.type;
                if("DB" === type) {
                    const dbObject = JSON.parse(JSON.stringify(connectionItem.dbObject));
                    //debugger
                    selectedDbJsonTab = type;
                    connectionForm =  {
                        connectionId: connectionItem.connectionId,
                        ...dbObject
                    };
                } else if("JSON" === type) {
                    ////debugger
                    const jsonObject = JSON.parse(JSON.stringify(connectionItem.jsonObject));
                    selectedDbJsonTab = type;
                    jsonForm =  {
                        connectionId: connectionItem.connectionId,
                        fileStreamRadio: connectionItem.jsonObject.type.toLocaleLowerCase(),
                        ...jsonObject
                    };
                    /*const jsonObject = connectionItem.jsonObject;
                    if("FILE" === jsonObject.type) {
                        name = jsonObject.fileObject.jsonName;
                    } else if("STREAM" === jsonObject.type) {
                        name = jsonObject.streamObject.jsonName;
                    }*/
                }
                break;
            }
        }

        this.setState({
            selectedDbJsonTab,
            connectionForm,
            jsonForm,
            isConnectionTableVisible: false,
            isTestConnectionSuccessful: false,
            isTestConnectionButtonDisabled: true,
            isSaveConnectionDisabled: false
        })
    };
    onAddNewConnectionClick = () => {
        ////debugger
        this.setState({
            selectedDbJsonTab: "DB",
            jsonForm: JSON.parse(JSON.stringify(defaultJsonForm)),
            connectionForm: JSON.parse(JSON.stringify(defaultConnectionForm)),
            isConnectionTableVisible: false,
            isTestConnectionSuccessful: false,
            isTestConnectionButtonDisabled: true,
            isSaveConnectionDisabled: true,
        })
    };
    toggleConnectionTableUI = () => {
        this.setState({
            isConnectionTableVisible: !this.state.isConnectionTableVisible
        })
    };

    render() {
        const {
            loading,
            connectionForm,
            isTestConnectionSuccessful,
            isTestConnectionButtonDisabled,
            isSaveConnectionDisabled,
            isConnectionTableVisible,
            connectionList,
            selectedDbJsonTab,
            tableOptions,
            jsonForm,
            isSaveUpdateJsonDisabled
        } = this.state;

        return (
            <div>
                <SmartShipLoader isVisible={loading} />
                {
                    isConnectionTableVisible
                        ? (<ConnectionTableUI
                            connectionList={connectionList}
                            onConnectionItemEdit={this.onConnectionItemEdit}
                            onAddNewConnectionClick={this.onAddNewConnectionClick}
                        />)
                        : (<ConnectionFormUI
                            selectedDbJsonTab={selectedDbJsonTab}
                            connectionForm={connectionForm}
                            isTestConnectionButtonDisabled={isTestConnectionButtonDisabled}
                            isSaveConnectionDisabled={isSaveConnectionDisabled}
                            isConnectionTableVisible={isConnectionTableVisible}
                            isTestConnectionSuccessful={isTestConnectionSuccessful}
                            jsonForm={jsonForm}
                            isSaveUpdateJsonDisabled={isSaveUpdateJsonDisabled}
                            onDbJsonTabSelect={this.onDbJsonTabSelect}
                            onConnectionFormItemValueChange={this.onConnectionFormItemValueChange}
                            onConnectionFormTableDropdownValueChange={this.onConnectionFormTableDropdownValueChange}
                            onSaveConnectionClick={this.onSaveConnectionClick}
                            onCancelConnectionClick={this.onCancelConnectionClick}
                            onUpdateConnectionClick={this.onUpdateConnectionClick}
                            onTestConnectionClick={this.onTestConnectionClick}
                            tableOptions={tableOptions}
                            onJSONFormItemValueChange={this.onJSONFormItemValueChange}
                        />)
                }
            </div>
        )
    }
}

export default ConnectionUI;


