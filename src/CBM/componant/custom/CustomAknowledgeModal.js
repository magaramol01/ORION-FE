import React, {Component} from "react";
import {Button, Col, Form, Modal, Row, Table} from "react-bootstrap";
import SmartShipLoader from "../common/SmartShipLoader";
// import {updateMachines} from "../api";

class CustomAknowledgeModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            comment: ""
        }
    }

    handleClose = () => {
        this.setState({
            show: false
        })
    };
    handleShow = () => {
        this.setState({
            show: true
        })
    };

    onElementValueChange = (event) => {
        debugger
        const {name, value} = event.target;
        this.setState({
            [name]: value
        })
    };

    render() {
        const {
            show,
            comment
        } = this.state;
        const disableButtonCss = this.props.disabled ? { pointerEvents: "none"} : null;


        return (
            <>
                <Button
                    className="parameter-add-button ml-0"
                    onClick={this.handleShow}
                    style={{height: 28}}
                >Acknowledge</Button>
                <Modal className="smartShipModal" show={show} onHide={this.handleClose} animation={false}>
                    <SmartShipLoader isVisible={false} />
                    <Modal.Header closeButton>
                        Acknowledge
                    </Modal.Header>
                    <Modal.Body>
                        <div className="config-form-block p-0" style={{margin: "0px auto"}}>
                            <div>
                                <Form.Group size="sm" as={Col} className="p-0 mb-0">
                                    <Form.Label>Comment</Form.Label>
                                    <Form.Control
                                        as="textarea" aria-label="With textarea"
                                        placeholder="Add Comment"
                                        name="comment"
                                        onChange={this.onElementValueChange}
                                        value={comment}
                                        autoComplete="off"
                                    />
                                </Form.Group>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="d-flex justify-content-between">
                        <Button
                            size="sm"
                            className="parameter-add-button"
                            onClick={this.handleClose}
                            variant="outline-secondary"
                            // disabled={false}
                        >
                            Cancel
                        </Button>
                        <Button
                            size="sm"
                            className="parameter-add-button"
                            onClick={this.props.handleAcknowledge.bind(this,comment)}
                            variant="outline-secondary"
                            // disabled={false}
                        >
                            Acknowledge
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default CustomAknowledgeModal;
