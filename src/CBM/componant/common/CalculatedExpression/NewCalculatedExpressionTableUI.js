import React from 'react';
import {Button, Table} from 'react-bootstrap';

const defaultCalculatedExpressionForm = {
    uId: -1,
    name: "",
    description: "",
    expression: "",
};

function NewCalculatedExpressionTableUI(props) {
    let {
        addedElements,
        onAddNewCalculatedExpressionClick,
        onEditCalculatedExpressionClick,
        onDuplicateCalculatedExpressionClick
    } = {...props};
    addedElements = !addedElements ? [] : addedElements;
    return (
        <div className="tableUIWrapper">
            <div className="tableButtonWrapper">

                {/*TODO : Enable This button after implementing Calculated Expression*/}
                <Button
                    className="SM-p-button"
                    onClick={onAddNewCalculatedExpressionClick}
                    variant="outline-secondary"
                    disabled={true}
                >
                    <img
                        alt=""
                        width={16}
                        src={require('../../../Images/plus.png')}
                        style={{marginRight: 6}}
                    />
                    Add Calculated Expression
                </Button>
            </div>
            <Table size="sm" className="sm-custom-table">
                <thead>
                <tr>
                    {/*<th>Name</th>*/}
                    {/*<th>Description</th>*/}
                    {/*<th>Expression</th>*/}
                    {/*<th>Actions</th>*/}
                </tr>
                </thead>
                <tbody>
                {
                    addedElements.map((addedElement, index) => {
                        return (
                            <tr key={`singleInputTable` + index}>
                                <td>
                                    <div className="nameText">{addedElement.name}</div>
                                    <div className="descriptionText">{addedElement.description}</div>
                                </td>
                                <td>Expression: {addedElement.expression}</td>
                                <td style={{
                                    position: "relative",
                                    maxWidth: 60,
                                    width: 60
                                }}>
                                    <div className="d-flex flex-row">
                                        <div title="Edit Calculated Expression">
                                            <img style={{
                                                width: 18,
                                                cursor: "pointer"
                                            }}
                                                 alt="Edit Calculated Expression"
                                                 src={require('../../../Images/edit.png')}
                                                 data-index={index}
                                                 data-uid={addedElement.uId}
                                                 onClick={onEditCalculatedExpressionClick}
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
                                                 src={require('../../../Images/duplicate.png')}
                                                 data-index={index}
                                                 data-uid={addedElement.uId}
                                                 onClick={onDuplicateCalculatedExpressionClick}
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
        </div>
    );
}

export default NewCalculatedExpressionTableUI;
