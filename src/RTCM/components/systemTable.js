import React from "react";
import CustomScrollBar from "./CustomScrollBar";
import _ from "lodash";

function getIcon(iconColor) {
    if (iconColor === "green") {
        return <i className="fa fa-exclamation-triangle system-table-green" aria-hidden="true"/>;
    } else if (iconColor === "red") {
        return <i className="fa fa-exclamation-triangle system-table-red" aria-hidden="true"/>;
    } else if (iconColor === "white") {
        return <i className="fa fa-exclamation-triangle system-table-white" aria-hidden="true"/>;
    } else {
        return <i className="fa fa-exclamation-triangle system-table-green" aria-hidden="true"/>;
    }
}

function detectColSpan(tableData) {
    let colSpan = 0;
    _.map(tableData, row => {
        const noOfColumns = Object.keys(row).length - 1;
        if (noOfColumns> colSpan) {
            colSpan = noOfColumns;
        }
    });

    return colSpan;
}

function prepareDynamicTable(tableData) {
    const colSpan = detectColSpan(tableData);
    let tableRows = _.map(tableData, row => {
        const noOfColumns = Object.keys(row).length - 1;
        let finalColSpan = colSpan;
        if (noOfColumns === colSpan) {
            finalColSpan = finalColSpan / colSpan;
        }

        return (
            <tr>
                {
                    Object.keys(row).map(col => {
                        let colData = row[col];
                        const isHeaderColumn = !!colData.caption;

                        if (isHeaderColumn) {
                            return (
                                <td>{colData.caption}</td>
                            );
                        } else {
                            return (
                                <td colSpan={finalColSpan}>
                                    {colData.isIndicator ? getIcon(colData.value) : colData.value}
                                    {colData.unit}
                                </td>
                            );
                        }
                    })
                }
            </tr>
        );
    });

    return (
        <tbody>
            {tableRows}
        </tbody>
    );
}

class SystemTable extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            containerHeight: this.props.height,
            containerWidth: this.props.width,
            element: this.props.element
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!_.isEqual(nextProps.element, prevState.element)) {
            return {element: nextProps.element};
        } else return null;
    }

    render() {
        const element = this.state.element;
        const tableData = element.configuration.body.data;
        let table = prepareDynamicTable(tableData);
        let height = element.configuration.body.configuration.height + "px";

        return (
            <div style={{padding: '1px'}}>
                <CustomScrollBar height={height} width={"auto"}>
                    <table className="system-table table table-dark table-sm">
                        {table}
                    </table>
                </CustomScrollBar>
            </div>
        );

    };
}

export default SystemTable;
