import React from "react";
import {Modal} from "react-bootstrap";

class CustomModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            header: this.props.headerText,
            body: this.props.body,
            isShow: this.props.isShow,
            size: this.props.size
        };

        this.onHide = this.onHide.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }

    onHide = () => {
        this.hideModal();
    };

    showModal = () => {
        this.setState({
            isShow: true
        })
    };

    hideModal = () => {
        this.setState({
            isShow: false
        })
    };

    render() {
        return (
            <Modal
                size={this.state.size}
                show={this.state.isShow}
                onHide={() => this.onHide()}
                aria-labelledby="example-modal-sizes-title-sm"
            >
                <Modal.Header bsPrefix={"custom-modal-header"} closeButton>
                    <Modal.Title bsPrefix={"custom-modal-header-text"} id="example-modal-sizes-title-sm">
                        {this.state.header}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body bsPrefix={"custom-modal-body"}>
                    {this.state.body}
                </Modal.Body>
            </Modal>
        );
    }
}

export default CustomModal;
