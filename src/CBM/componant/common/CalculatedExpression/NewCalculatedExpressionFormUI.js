import React, {Component} from 'react';
import {Button, Col, Container, Form, Row, Table} from 'react-bootstrap';
import SmartShipLoader from "../SmartShipLoader";
import Select from 'react-select';
import {
    getAllParametersOnlyNames,
    updateCalculatedExpression,
    createCalculatedExpression
} from "../../../../api";
import NavigationBar from "../NavigationBar";
import {defaultCalculatedExpressionForm} from "../../Constants";
import SMSidebar from "../../../../SMSidebar";


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

class NewCalculatedExpressionFormUI extends Component {
    constructor(props) {
        super(props);
        debugger
        let currentUid = -1;
        let calculatedExpressionForm = JSON.parse(JSON.stringify(defaultCalculatedExpressionForm));
        if (props.location.data) {
            calculatedExpressionForm = props.location.data.calculatedExpressionForm;
            currentUid = calculatedExpressionForm.hasOwnProperty("uId") && calculatedExpressionForm.uId;
        }
        this.state = {
            loading: true,
            currentUid,
            calculatedExpressionForm,
            isSaveUpdateButtonDisabled: true,
            isCETableVisible: true,
            parameterOptions: [],
            cursorPosition: -1
        };
        this.textareaInput = React.createRef();
    }

    componentDidMount() {
        getAllParametersOnlyNames(this.getAllParametersOnlyNamesSuccess, this.getAllParametersOnlyNamesFauilure)
    }

    getAllParametersOnlyNamesSuccess = (parametersOnlyNamesResponse, calculatedExpressionResponse) => {
        const parametersObj = parametersOnlyNamesResponse.data;
        let parameterOptions = [];
        for (let key in parametersObj) {
            parameterOptions.push({
                value: parametersObj[key]["name"],
                label: parametersObj[key]["name"]
            });
        }

        const isSaveUpdateButtonDisabled = this.getIsSaveUpdateButtonDisabled(this.state.calculatedExpressionForm);
        this.setState({
            loading: false,
            parameterOptions,
            isSaveUpdateButtonDisabled
        })
    };
    getAllParametersOnlyNamesFauilure = (error) => {
        console.log(error);
        this.setState({
            loading: false
        })
    };

    getObjectForServer = () => {
        const {
            name,
            description,
            expression
        } = {...this.state.calculatedExpressionForm};

        return {
            name,
            description,
            expression
        }
    };

    getIsSaveUpdateButtonDisabled = (calculatedExpressionForm) => {
        let isSaveUpdateButtonDisabled = false;
        for (let key in calculatedExpressionForm) {
            if (!isSaveUpdateButtonDisabled) {
                isSaveUpdateButtonDisabled = calculatedExpressionForm[key] === "";
            }
        }
        return isSaveUpdateButtonDisabled;
    };

    onAddButtonClick = () => {
        const payload = this.getObjectForServer();
        this.setState({
            loading: true
        });
        createCalculatedExpression(this.onCreateElementSuccess, this.onCreateElementFailure, payload)
    };
    onCreateElementSuccess = (res) => {
        if (res.status === 200 ) {
            this.props.history.push({
                pathname: '/MonitorPolicies',
                data: {
                    type: "calculated_expression",
                    uId: res.data
                }
            })
        }
    };
    onCreateElementFailure = (err) => {
        this.setState({
            loading: false
        });
        console.log(err)
    };

    onUpdateButtonClick = () => {
        const currentUid = this.state.currentUid;
        const calculatedExpressionForm = this.getObjectForServer();
        const payload = {
            [currentUid]: calculatedExpressionForm
        };
        this.setState({
            loading: true
        });

        updateCalculatedExpression(this.onUpdateElementSuccess, this.onUpdateElementFailure, payload)
    };
    onUpdateElementSuccess = (res) => {
        if (res.status === 200 ) {
            const currentUid = this.state.currentUid;
            this.props.history.push({
                pathname: '/MonitorPolicies',
                data: {
                    type: "calculated_expression",
                    uId: currentUid
                }
            })
        }
    };
    onUpdateElementFailure = (err) => {
        this.setState({
            loading: false
        });
        console.log(err)
    };


    onElementValueChange = (event) => {
        const key = event.target.dataset.key;
        const value = event.target.value;
        const calculatedExpressionForm = this.state.calculatedExpressionForm;
        calculatedExpressionForm[key] = value;
        const isSaveUpdateButtonDisabled = this.getIsSaveUpdateButtonDisabled(calculatedExpressionForm);
        this.setState({
            calculatedExpressionForm,
            isSaveUpdateButtonDisabled,
            cursorPosition: this.textareaInput.current.selectionStart
        });
    };
    onDropdownValueChange = (key, selectedValue) => {
        console.log(this.textareaInput.current.selectionStart)
        console.log(this.textareaInput.current.selectionEnd)
        let calculatedExpressionForm = {...this.state.calculatedExpressionForm};
        let expression = calculatedExpressionForm.expression;
        let newText = "";
        console.log(selectedValue);
        if ("parameterDropdown" === key) {
            newText = "[" + selectedValue.value + "]";
        } else if ("mathDropdown" === key) {
            newText = selectedValue.value + "()";
        }
        const position = this.textareaInput.current.selectionStart;
        expression = [expression.slice(0, position), newText, expression.slice(position)].join('');
        calculatedExpressionForm.expression = expression;
        this.setState({
            calculatedExpressionForm,
            cursorPosition: this.textareaInput.current.selectionStart
        }, () => {
            const positionDiff = "parameterDropdown" === key ? 0 : 1;
            this.textareaInput.current.focus();
            this.textareaInput.current.selectionStart = this.textareaInput.current.selectionEnd = newText.length + position - positionDiff;
        })
    };

    resetToDefaultView = () => {
        this.props.history.goBack();
    };

    render() {
        const {
            calculatedExpressionForm,
            loading,
            currentUid,
            isSaveUpdateButtonDisabled,
            parameterOptions
        } = {...this.state};
        return (
            <SMSidebar history={this.props.history} screenPath={"/Alarm"}>
                <div className="smartShipBody d-flex flex-column vh-100">
                    <SmartShipLoader isVisible={loading}/>
                    <NavigationBar
                        title={"Calculated Expression"}/>
                    <div className="d-flex justify-content-center pt-5 pb-4 overflow-auto cbm-wrapper">
                        <div className="config-form-block sm-w-600" style={{margin: "0px auto"}}>
                            <div className="config-form-block-header">
                                Calculated Expression
                            </div>
                            <Form.Group size="sm" as={Col}>
                                <Row>
                                    <Form.Group size="sm" as={Col}>
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control
                                            placeholder="Name"
                                            data-key="name"
                                            onChange={this.onElementValueChange}
                                            value={calculatedExpressionForm["name"]}
                                            maxLength={30}
                                            autoComplete="off"
                                        />
                                    </Form.Group>
                                    <Form.Group size="sm" as={Col}>
                                        <Form.Label>Description</Form.Label>
                                        <Form.Control
                                            // as="textarea"
                                            aria-label="With textarea"
                                            placeholder="Description"
                                            data-key="description"
                                            onChange={this.onElementValueChange}
                                            value={calculatedExpressionForm["description"]}
                                            autoComplete="off"
                                        />
                                    </Form.Group>
                                </Row>
                                <Row>
                                    <Form.Group size="sm" as={Col}>
                                        <Form.Label>Expression</Form.Label>
                                        <Form.Control
                                            ref={this.textareaInput}
                                            as="textarea" aria-label="With textarea"
                                            placeholder="Expression"
                                            data-key="expression"
                                            onChange={this.onElementValueChange}
                                            value={calculatedExpressionForm["expression"]}
                                            autoComplete="off"
                                        />
                                    </Form.Group>
                                </Row>
                                <Row>
                                    <Form.Group size="sm" as={Col}>
                                        <Form.Label>Parameters</Form.Label>
                                        <Select
                                            theme={theme}
                                            options={parameterOptions}
                                            data-key="parameters"
                                            onChange={(selectedOption) => this.onDropdownValueChange("parameterDropdown", selectedOption)}
                                            isMulti={false}
                                            closeMenuOnSelect={true}
                                            // defaultValue={}
                                        />
                                    </Form.Group>
                                    {/*<Form.Group size="sm" as={Col}>
                                                    <Form.Label>Expression</Form.Label>
                                                    <Select
                                                        options={mathExpressionDropdown}
                                                        data-key="parameters"
                                                        onChange={(selectedOption) => this.onDropdownValueChange("mathDropdown", selectedOption)}
                                                        isMulti={false}
                                                        closeMenuOnSelect={true}
                                                        // defaultValue={}
                                                    />
                                                </Form.Group>*/}
                                </Row>
                            </Form.Group>
                            <Form.Group size="sm" as={Col} className="d-flex flex-row justify-content-between mt-3" >
                                {/*{currentUid}*/}
                                <Button
                                    size="sm"
                                    className="parameter-add-button"
                                    onClick={this.resetToDefaultView}
                                    variant="outline-secondary"
                                >
                                    Cancel
                                </Button>

                                {
                                    (
                                        currentUid === -1 && (
                                            <Button
                                                size="sm"
                                                className="parameter-add-button ml-0"
                                                onClick={this.onAddButtonClick}
                                                variant="outline-secondary"
                                                disabled={isSaveUpdateButtonDisabled}
                                            >
                                                Add
                                            </Button>
                                        )
                                    )
                                    || (
                                        <Button
                                            size="sm"
                                            className="parameter-add-button ml-0"
                                            onClick={this.onUpdateButtonClick}
                                            variant="outline-secondary"
                                            disabled={isSaveUpdateButtonDisabled}
                                        >
                                            Update
                                        </Button>
                                    )
                                }
                            </Form.Group>
                        </div>
                    </div>
                </div>
            </SMSidebar>
        );
    }
}

export default NewCalculatedExpressionFormUI;
