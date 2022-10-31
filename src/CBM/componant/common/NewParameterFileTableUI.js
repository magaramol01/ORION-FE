import React from 'react';
import {Table} from 'react-bootstrap';

function NewParameterFileTableUI({
                                addedElements,
                                onDownloadParameterFileClick
                            }) {
    addedElements = !addedElements ? [] : addedElements;

    return (
        <div className="tableUIWrapper">
            <Table size="sm" className="sm-custom-table">
                <tbody>
                <tr>
                    <td>
                        {
                            (!!addedElements.fileName)?(
                                <div style={{display:"flex",width:"100%"}}>
                                    <div style={{width:"30%"}}>File Name : <b>{addedElements.fileName}</b></div>
                                    <div style={{width:"30%"}}>Uploaded User Name :<b>{addedElements.userName}</b></div>
                                    <div>Uploaded Time :<b>{addedElements.createdTime}</b></div>
                                </div>
                            ):(
                                <div className="nameText">File Not Uploaded.</div>
                            )
                        }
                    </td>
                    {
                        <td style={{
                            position: "relative",
                            maxWidth: 55,
                            width: 55
                        }}>
                            <div className="d-flex flex-row">
                                <div
                                    title="Download"
                                >
                                    <img style={{
                                        width: 30,
                                        cursor: "pointer"
                                    }}
                                         alt="Download"
                                         src={require('../../Images/download.png')}
                                         data-uid={addedElements.id}
                                         onClick={onDownloadParameterFileClick}
                                    />
                                </div>
                            </div>
                        </td>
                    }
                </tr>
                </tbody>
            </Table>
        </div>
    );
}

export default NewParameterFileTableUI;
