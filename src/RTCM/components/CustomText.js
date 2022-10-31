import React, {Component} from "react";
import {Editor} from '@tinymce/tinymce-react';
import {Button} from "react-bootstrap";
import CustomModal from "./customModal";
import Parser from 'html-react-parser';

/**
 * todo
 * updated value in to able to show in tinyMCE editor
 * **/

class CustomText extends Component {

    constructor(props) {
        super(props);

        const textHTML = props.element.configuration.body.textData;

        this.state = {
            textValue: textHTML,
            editorTextValue: textHTML
        };
        this.customModalRef = React.createRef();
    }

    handleEditorChange = (e) => {
        //console.log('Content was updated:', e.target.getContent());
        const editorTextValue = e.target.getContent();
        // this.tinyMCE.activeEditor.setContent('<span>some</span>');
        this.setState({editorTextValue});
    };

    showInformationInModal = () => {
        this.customModalRef.current.showModal();
    };

    handleOkClick = () => {
        this.setState({
            textValue: this.state.editorTextValue
        });
        this.customModalRef.current.hideModal();
    };

    handleCancelClick = () => {
        this.customModalRef.current.hideModal();
    };

    render() {
        const {
            textValue,
            editorTextValue
        } = this.state;

        return (
            <div className="smartship-custom-text" onDoubleClick={this.showInformationInModal}>
                <CustomModal isShow={false} headerText={"Header"} body={
                    <div>
                        <Editor
                            apiKey={"009jpb6oyolomwfiky9xs1vmz37ezkq9mzf0uf08z2sp85kg"}
                            textareaName='myTextArea'
                            init={{
                                branding: false,
                                resize: false,
                                menubar: false,
                                contextmenu_never_use_native: true,
                                placeholder: 'Type here...',
                                plugins: [
                                    'advlist autolink lists link image charmap print preview anchor',
                                    'searchreplace visualblocks code fullscreen',
                                    'insertdatetime media table paste code help wordcount'
                                ],
                                toolbar:
                                    'undo redo | fontselect | fontsizeselect | formatselect | bold italic underline strikethrough | \
                                    forecolor backcolor | link | \
                                    bul alignleft aligncenter alignright alignjustify | \
                                    numlist bullist outdent indent | removeformat |',
                                toolbar_mode: 'sliding',
                                min_height: 280
                            }}
                            initialValue={editorTextValue}
                            key={Math.random()+"in"} // this line makes the trick
                            content={editorTextValue}
                            onChange={this.handleEditorChange}
                        />
                        <div className="textEditorButtonsWrapper" >
                            <Button variant="dark" size="sm" onClick={this.handleCancelClick}>
                                Cancel
                            </Button>
                            <Button variant="dark" size="sm" onClick={this.handleOkClick}>
                                Ok
                            </Button>
                        </div>
                    </div>
                } size={"md"} ref={this.customModalRef}/>
                {Parser(textValue)}
            </div>
        );
    };

}

export default CustomText;
