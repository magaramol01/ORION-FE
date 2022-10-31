import React from 'react';
import {Table} from 'react-bootstrap';

function NewWidgetMappingTableUI({
                             addedElements,
                             onDownloadFileClick
                         }) {
    addedElements = !addedElements ? [] : addedElements;

    return (
        <div className="tableUIWrapper">
            <Table size="sm" className="sm-custom-table">
                <tbody>
                            <tr>
                                <td>
                                    {
                                        (!!addedElements.filename)?(
                                            <div className="nameText">{addedElements.filename}</div>
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
                                                         onClick={onDownloadFileClick}
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

export default NewWidgetMappingTableUI;
