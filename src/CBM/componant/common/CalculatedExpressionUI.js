import React, {Component} from 'react';
import {Button, Col, Container, Form, Row, Table} from 'react-bootstrap';
import SmartShipLoader from "./SmartShipLoader";
import Select from 'react-select';
import {
    getAllParametersOnlyNames,
    updateCalculatedExpression,
    createCalculatedExpression
} from "../../../api";

const defaultCalculatedExpressionForm = {
    uId: -1,
    name: "",
    description: "",
    expression: "",
};

class CalculatedExpressionUI extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            calculatedExpressionForm: JSON.parse(JSON.stringify(defaultCalculatedExpressionForm)),
            isSaveUpdateButtonDisabled: true,
            addedElements: [],
            currentUid: -1,
            isCETableVisible: true,
            parametersObj: {},
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
        const calculatedExpressionObj = calculatedExpressionResponse.data;
        let parameterOptions = [];
        let addedElements = [];
        for (let key in parametersObj) {
            parameterOptions.push({
                value: parametersObj[key]["name"],
                label: parametersObj[key]["name"]
            });
        }
        for (let ceKey in calculatedExpressionObj) {
            const calculatedExpressionItem = calculatedExpressionObj[ceKey];
            addedElements.unshift({
                uId: ceKey,
                name: calculatedExpressionItem.name,
                description: calculatedExpressionItem.description,
                expression: calculatedExpressionItem.expression,
            })
        }

        this.setState({
            loading: false,
            addedElements,
            parameterOptions,
            parametersObj
        })
    };

    getAllParametersOnlyNamesFauilure = (error) => {
        //console.log(error);
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
            let calculatedExpressionForm = {...this.state.calculatedExpressionForm};
            calculatedExpressionForm.uId = res.data;
            const addedElements = [calculatedExpressionForm, ...this.state.addedElements];
            this.setState({
                loading: false,
                addedElements,
                calculatedExpressionForm: JSON.parse(JSON.stringify(defaultCalculatedExpressionForm)),
                currentUid: -1,
                isSaveUpdateButtonDisabled: true,
                isCETableVisible: true
            });
        }
    };
    onCreateElementFailure = (err) => {
        this.setState({
            loading: false
        });
        //console.log(err)
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
            const addedElements = [...this.state.addedElements];
            for (let eIndex = 0; eIndex < addedElements.length; eIndex++) {
                if (currentUid === addedElements[eIndex].uId) {
                    addedElements[eIndex] = {...this.state.calculatedExpressionForm};
                    break;
                }
            }
            this.setState({
                loading: false,
                addedElements,
                calculatedExpressionForm: JSON.parse(JSON.stringify(defaultCalculatedExpressionForm)),
                currentUid: -1,
                isSaveUpdateButtonDisabled: true,
                isCETableVisible: true
            });

        }
    };
    onUpdateElementFailure = (err) => {
        this.setState({
            loading: false
        });
        //console.log(err)
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
        //console.log(this.textareaInput.current.selectionStart)
        //console.log(this.textareaInput.current.selectionEnd)
        let calculatedExpressionForm = {...this.state.calculatedExpressionForm};
        let expression = calculatedExpressionForm.expression;
        let newText = "";
        //console.log(selectedValue);
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
    onCancelClick = () => {
        this.setState({
            currentUid: -1,
            calculatedExpressionForm: JSON.parse(JSON.stringify(defaultCalculatedExpressionForm)),
            isSaveUpdateButtonDisabled: true,
            isCETableVisible: true
        })
    };

    onAddNewCalculatedExpressionClick = () => {
        this.setState({
            isCETableVisible: false
        })
    };
    onEditClick = (event) => {
        let calculatedExpressionForm = {};
        let addedElements = [...this.state.addedElements];
        const currentUid = event.target.dataset.uid;
        for (let eIndex = 0; eIndex < addedElements.length; eIndex++) {
            if (currentUid === addedElements[eIndex].uId) {
                calculatedExpressionForm = {...addedElements[eIndex]};
                break;
            }
        }
        this.setState(
            {
                addedElements,
                calculatedExpressionForm,
                currentUid,
                isSaveUpdateButtonDisabled: true,
                isCETableVisible: false
            }
        );
    };
    onDuplicateClick = (event) => {
        debugger
        let calculatedExpressionForm = {};
        let addedElements = [...this.state.addedElements];
        let currentUid = event.target.dataset.uid;
        for (let eIndex = 0; eIndex < addedElements.length; eIndex++) {
            debugger
            if (currentUid === addedElements[eIndex].uId) {
                calculatedExpressionForm = {...addedElements[eIndex]};
                calculatedExpressionForm.uId = -1;
                calculatedExpressionForm.name = `copy ${calculatedExpressionForm.name}`;
                break;
            }
        }
        this.setState(
            {
                addedElements,
                calculatedExpressionForm,
                currentUid: -1,
                isSaveUpdateButtonDisabled: false,
                isCETableVisible: false
            }
        );
    };

    render() {
        const {
            calculatedExpressionForm,
            loading,
            currentUid,
            isSaveUpdateButtonDisabled,
            addedElements,
            isCETableVisible,
            parameterOptions
        } = {...this.state};
        return (
            <Container>
                <SmartShipLoader isVisible={loading}/>
                {
                    isCETableVisible
                        ? (<Row ld={8} md={8} xs={16} sm={16}>
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
                                <Button className="SM-button"
                                        onClick={this.onAddNewCalculatedExpressionClick}
                                        variant="outline-secondary">
                                    <img
                                        alt=""
                                        width={16}
                                        src={require('../../Images/plus.png')}
                                        style={{marginRight: 6}}
                                    />
                                    Add Calculated Expression
                                </Button>
                            </div>
                            <Table style={{maxWidth: 700, margin: "0px auto"}} striped bordered hover size="sm">
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Expression</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    addedElements.map((addedElement, index) => {
                                        return (
                                            <tr key={`singleInputTable` + index}>
                                                <td>{addedElement.name}</td>
                                                <td>{addedElement.description}</td>
                                                <td>{addedElement.expression}</td>
                                                <td style={{
                                                    position: "relative",
                                                    maxWidth: 50,
                                                    width: 50
                                                }}>
                                                    <div className="d-flex flex-row">
                                                        <div title="Edit Calculated Expression">
                                                            <img style={{
                                                                width: 18,
                                                                cursor: "pointer"
                                                            }}
                                                                 alt="Edit Calculated Expression"
                                                                 src={require('../../Images/edit.png')}
                                                                 data-index={index}
                                                                 data-uid={addedElement.uId}
                                                                 onClick={this.onEditClick}
                                                            />
                                                        </div>
                                                        <div
                                                            className="ml-2"
                                                            title="Duplicate Calculated Expression">
                                                            <img style={{
                                                                width: 18,
                                                                cursor: "pointer"
                                                            }}
                                                                 alt="Duplicate Calculated Expression"
                                                                 src={require('../../Images/duplicate.png')}
                                                                 data-index={index}
                                                                 data-uid={addedElement.uId}
                                                                 onClick={this.onDuplicateClick}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                </tbody>
                            </Table>
                        </Row>)
                        : (<Row ld={8} md={8} xs={8}>
                            <div id="parametersUI">
                                <div className="cardHeader">
                                    Calculated Expressions
                                </div>
                                <div style={{padding: 20}}>
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
                                    <Form.Group size="sm" as={Col} style={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        marginTop: 15
                                    }}>
                                        {/*{currentUid}*/}

                                        {
                                            (
                                                currentUid === -1 && (
                                                    <Button
                                                        size="sm"
                                                        className="parameter-add-button"
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
                                                    className="parameter-add-button"
                                                    onClick={this.onUpdateButtonClick}
                                                    variant="outline-secondary"
                                                    disabled={isSaveUpdateButtonDisabled}
                                                >
                                                    Update
                                                </Button>
                                            )
                                        }
                                        <Button
                                            size="sm"
                                            className="parameter-add-button"
                                            onClick={this.onCancelClick}
                                            variant="outline-secondary"
                                        >
                                            Cancel
                                        </Button>
                                    </Form.Group>
                                </div>
                            </div>
                        </Row>)
                }

            </Container>
        );
    }
}

export default CalculatedExpressionUI;
