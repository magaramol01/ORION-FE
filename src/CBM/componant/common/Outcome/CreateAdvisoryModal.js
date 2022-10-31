import React, {Component} from "react";
import {Button, Col, Form, Modal, Row, Table} from "react-bootstrap";
import SmartShipLoader from "../SmartShipLoader";

class CreateAdvisoryModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            unitName: "",
            show: false,
            isAddButtonEnabled: true,
            unitOptions: props.unitOptions
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

    render() {
        const {
            show,
            loading
        } = this.state;
        const disableButtonCss = { pointerEvents: "none"};

        const {
            title,
            actionButton,
            modalBody
        } = this.props;


        return (
            <>
                <div
                    className="outcome-modal-button ml-2 mr-2"
                    onClick={this.handleShow}
                >
                    {title}
                </div>
                <Modal className="smartShipModal" show={show} onHide={this.handleClose} animation={false}>
                    <SmartShipLoader isVisible={loading} />
                    <Modal.Header className={"sm-modal-header"} closeButton>
                        {title}
                    </Modal.Header>
                    <Modal.Body>
                        {modalBody}
                    </Modal.Body>
                    <Modal.Footer className="d-flex flex-row justify-content-between">
                        <Button
                            size="sm"
                            className="parameter-add-button"
                            onClick={this.handleClose}
                            variant="outline-secondary"
                            // disabled={false}
                        >
                            Cancel
                        </Button>
                        {actionButton}
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default CreateAdvisoryModal;
