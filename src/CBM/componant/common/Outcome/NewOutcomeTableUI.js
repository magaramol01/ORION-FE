import React,{useState,useEffect} from "react";
import {Accordion, Button,Modal, Card, Col, Container, Form, Row, Table} from "react-bootstrap";
import Select from 'react-select';
import {getRuleConfigAllData, saveConfigureUseCase, updateConfigureUseCase} from "../../../../api"
import CustomTooltip from "../../custom/CustomTooltip";
import {getItemFromLocalStorage} from "../../../../RTCM/common/helper";
import Pagination from "react-js-pagination";

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

const defaultDropdownValue = {
    value: "",
    label: ""
};
const defaultRuleChainObject = {
    condition: {
        value: "||",
        label: "OR"
    },
    ruleChain: {...defaultDropdownValue}
};
const defaultSelectedCondition = {
    value: "||",
    label: "OR"
};
const defaultCauseList = [
    {
        cause: {...defaultDropdownValue},
        condition: {...defaultSelectedCondition},
        ruleChainArrList: [
            {
                isAccordionOpen: false,
                arr: [
                    {
                        condition: {...defaultSelectedCondition},
                        ruleChain: {...defaultDropdownValue}
                    }
                ]
            }
        ]
    }
];
const defaultCauseArrObject = {
    isAccordionOpen: true,
    condition: {...defaultSelectedCondition},
    causeList: [...defaultCauseList]
};
const defaultCauseArrObjectFromServer = {
    isAccordionOpen: true,
    condition: {...defaultSelectedCondition},
    causeList: []
};

const defaultConfigForm = {
    configId: -1,
    fa_alarm_radio: "failure_advisory",
    failureAdvisory: null,
    causeArrList: [JSON.parse(JSON.stringify(defaultCauseArrObject))]
};
const defaultSelected = {
    causeArrIndex: 0,
    causeListIndex: 0
};
const conditionOptions = [
    {
        value: "||",
        label: "OR"
    },
    {
        value: "&&",
        label: "AND"
    }
];
const fa_alarm_text = {
    failure_advisory: "Failure",
    alarm: "Alarm",
};

const ConfigTableUI = ({
                           configList,
                           pagination,
                           onConfigItemEdit,
                           onConfigDeleteClick,
                           onAddNewConfigClick,
                           onConfigItemDuplicate,
                           createExpression,
                           getCauseExpressionTableUI,
                           onPageChange,
                           checkBoxActionHandler,
                           checkBoxAllActionHandler,
                           allUserDataForShip,
                           saveEmailNotificationHandler,
                           showAutoEmailModal,
                           handleCloseAutoEmailModal,
                           handleOpenAutoEmailModal
                       }) => {
                        const [selectedUsersList, setSelectedUsers] = useState([]);
                        const onUserSelectionChange =async (selectedValue)=>{
                            await setSelectedUsers(await getSelectedUsers(selectedValue));
                        };

                        const getSelectedUsers=(selectedValue)=>{
                            let selectedValueArr = [];
                            {
                                if(!(selectedValue==null)){
                                    for(let i=0;i<selectedValue.length;i++){
                                        selectedValueArr.push(selectedValue[i].id);
                                    }
                                }
                            }
                            return selectedValueArr;
                        }
    return (
        <div className="tableUIWrapper">
            <div className="tableButtonWrapper">
                <Button
                    className="SM-p-button"
                    onClick={onAddNewConfigClick}
                    variant="outline-secondary">
                    <img
                        alt=""
                        width={16}
                        src={require('../../../Images/plus.png')}
                        style={{marginRight: 6}}
                    />
                    Configure Condition-based Alarm
                </Button>
                <Button  className="SM-p-button" variant="outline-secondary" onClick={handleOpenAutoEmailModal}>
                Set Auto Email
            </Button>
                <span className='pull-right'>
           <Form.Check
               style={{marginTop: '10px'}}
               type={`checkbox`}
               id={`default-checkbox`}
               label={`Select All`}
               onChange={checkBoxAllActionHandler}
           />
           </span>
            </div>
            <Table size="sm" className="sm-custom-table">
                <thead>
                <tr>
                    {/*<th className="min-width-66">Advisory</th>
                    <th className="min-width-66">Outcome</th>
                    <th className="min-width-66">Causes</th>
                    <th>Actions</th>*/}
                </tr>
                </thead>
                <tbody>
                {
                    configList.map((configItem, index) => {
                        let causeListItemUI = [];
                        let isSendEmail=configItem.sendEmail?.send===true?true:false;
                        let emailClass=(isSendEmail===true)?'fa fa-envelope-square faEmailActive':'fa fa-envelope-square faEmailNotActive';
                        const configId = configItem.configId;
                        causeListItemUI = getCauseExpressionTableUI(configItem);

                        let userListNotify='Send Email';
                        if(isSendEmail){
                            let ulist=configItem.sendEmail.userList;
                            if(ulist){
                                if(ulist.length){
                                    let unameList=ulist.reduce((acc,current)=>{
                                        acc=acc+"\n"+current.username;
                                        return acc;
                                    },'Send to:');
                                    userListNotify=unameList;
                                }
                            }
                        }
                        return (
                            <tr
                                key={`ctable-${index}`}>
                                <td>
                                    <div style={{display: "flex", flexDirection: "row"}}>
                                        <div className="pt-1">
                                            {fa_alarm_text[configItem.fa_alarm_radio]}:
                                        </div>
                                        <CustomTooltip
                                            customKey={`ctooltip-${index}`}
                                            description={configItem.failureAdvisory.description}
                                            label={configItem.failureAdvisory.label}
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div style={{display: "flex", flexDirection: "row", flexWrap: "wrap"}}>
                                        {causeListItemUI}
                                    </div>
                                </td>
                                {
                                    (getItemFromLocalStorage("editRules")==="true") && (
                                <td style={{ width: 105, maxWidth: 105, }}>
                                    <div className="d-flex flex-row">
                                    <div title={`${userListNotify}`} style={{marginRight:'7px',marginTop:'0px'}}>
                                    {/* <Form.Check style={{'cursor':'pointer'}}
                                                type={`checkbox`}
                                                id={`${configId+Math.floor(Math.random() * Date.now())}`}
                                                data-index={index}
                                                data-configid={configId}
                                                data-sendemail={configItem.sendEmail.send}
                                                onChange={checkBoxActionHandler} 
                                               // onChange={(e)=>{checkBoxActionHandler(e,configId)}}
                                                checked={configItem.sendEmail.send}
                                            /> */}
                                            <i className={emailClass} aria-hidden="true"
                                            style={{fontSize: 'x-large',marginRight: '0px','cursor': 'pointer'}}
                                            id={`${configId+Math.floor(Math.random() * Date.now())}`}
                                                data-index={index}
                                                data-configid={configId}
                                                data-sendemail={configItem.sendEmail.send}
                                                onClick={checkBoxActionHandler}></i>
                                    </div>
                                        <div title="Edit Outcome">
                                            <img style={{width: 18, cursor: "pointer"}}
                                                 alt="Edit Outcome"
                                                 data-index={index}
                                                 data-configid={configId}
                                                 src={require('../../../Images/edit.png')}
                                                 onClick={onConfigItemEdit}
                                            />
                                        </div>
                                        <div title="Duplicate Outcome" className="ml-2">
                                            <img style={{width: 18, cursor: "pointer"}}
                                                 alt="Duplicate Outcome"
                                                 data-index={index}
                                                 data-configid={configId}
                                                 src={require('../../../Images/duplicate.png')}
                                                 onClick={onConfigItemDuplicate}
                                            />
                                        </div>
                                        <div title="Delete Outcome" className="ml-2">
                                            <img style={{width: 18, cursor: "pointer"}}
                                                 alt="Delete Outcome"
                                                 data-index={index}
                                                 data-configid={configId}
                                                 src={require('../../../Images/delete.png')}
                                                 onClick={onConfigDeleteClick}
                                            />
                                        </div>
                                    </div>
                                </td>
                                    )
                                }
                            </tr>
                        )
                    })
                }
                </tbody>
            </Table>
            <div className="d-flex justify-content-end pr-4">
                {pagination.totalItemsCount > 0 && <Pagination
                    itemClass="page-item"
                    linkClass="page-link"
                    activePage={pagination.activePage}
                    itemsCountPerPage={pagination.itemsCountPerPage}
                    totalItemsCount={pagination.totalItemsCount}
                    pageRangeDisplayed={pagination.pageRangeDisplayed}
                    onChange={(activePage) => onPageChange("outcome", activePage)}
                />}
            </div>
            <div>
                <Modal show={showAutoEmailModal} onHide={handleCloseAutoEmailModal} size="lg"> 
                <Modal.Header closeButton>
                <Modal.Title>Set Auto Email for selected Condition-based Rules and Causes</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form.Group size="sm" as={Col} className="pr-0">
                                                    <Form.Label>Select Users</Form.Label>
                                                    <Select
                                                        theme={theme}
                                                        options={allUserDataForShip}
                                                        name="userName"
                                                        onChange={onUserSelectionChange}
                                                        isMulti={true}
                                                        closeMenuOnSelect={true}
                                                    />
                                                </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseAutoEmailModal}>
                    Close
                </Button>
                <Button variant="primary" onClick={(event)=>saveEmailNotificationHandler(event,selectedUsersList)}>
                    Save Changes
                </Button>
                </Modal.Footer>
                </Modal>
            </div>
        </div>
    )
};

class NewOutcomeTableUI extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isConfigUpdate: false,
            isConfigEdit: false,
            configList: [],
            ruleChainId: 8,
            configId: 50,
            configForm: JSON.parse(JSON.stringify(defaultConfigForm)),
            ruleChainList: [],
            isAddUpdateConfigDisabled: true,
            isConfigTableVisible: true,
            selectedRuleChainsArr: [],
            causesData: [],
            failureAdvisoryData: [],
            selected: JSON.parse(JSON.stringify(defaultSelected))
        }
    }



    render() {
        let {
            configList,
            pagination,
            onConfigItemEdit,
            onConfigDeleteClick,
            onAddNewConfigClick,
            onConfigItemDuplicate,
            createExpression,
            getCauseExpressionTableUI,
            onPageChange,
            checkBoxActionHandler,
            checkBoxAllActionHandler,
            allUserDataForShip,
            saveEmailNotificationHandler,
            showAutoEmailModal,
            handleCloseAutoEmailModal,
            handleOpenAutoEmailModal
        } = this.props;
        configList = !configList ? [] : configList;
        return (<ConfigTableUI
            configList={configList}
            pagination={pagination}
            onConfigItemEdit={onConfigItemEdit}
            onConfigDeleteClick={onConfigDeleteClick}
            onAddNewConfigClick={onAddNewConfigClick}
            onConfigItemDuplicate={onConfigItemDuplicate}
            createExpression={createExpression}
            getCauseExpressionTableUI={getCauseExpressionTableUI}
            onPageChange={onPageChange}
            checkBoxActionHandler={checkBoxActionHandler}
            checkBoxAllActionHandler={checkBoxAllActionHandler}
            allUserDataForShip={allUserDataForShip}
            saveEmailNotificationHandler={saveEmailNotificationHandler}
            showAutoEmailModal={showAutoEmailModal}
            handleCloseAutoEmailModal={handleCloseAutoEmailModal}
            handleOpenAutoEmailModal={handleOpenAutoEmailModal}
        />)
    }
}

export default NewOutcomeTableUI;