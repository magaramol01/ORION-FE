export const formOptions = {
    /*"SHIP": {
      name: "Ship"
    },*/
    /*"USE_CASE": {
      name: "Use Case"
    },*/
    "ADVISORY": {
        name: "Advisory",
        sidebarName: "Advisory",
    },
    "CAUSES": {
        name: "Causes"
    },
    "OUTCOME": {
        name: "Outcome"
    },
    "RULE_CHAIN": {
        name: "Rule"
    },
    "PARAMETERS": {
        name: "Parameters"
    },
    "CONSTANT": {
        name: "Constant"
    },
    "RTDAS_REGISTRATION": {
        name: "RTDAS Registration"
    },
    "CALCULATED_EXPRESSION": {
        name: "Calculated Expression"
    },
};

export const prefieldOptions = [
    {value: 'NormalRange', label: 'Normal Range'},
    {value: 'SpecifiedRange', label: 'Specified Range'},
];

export const comparisonOptions = [
    {value: 'greaterThan', label: '>'},
    {value: 'lessThan', label: '<'},
    {value: 'greaterThanEqual', label: '>='},
    {value: 'lessThanEqual', label: '<='},
    {value: 'equalTo', label: '=='},
    {value: 'notEqualTo', label: '!='},
];


export const defaultCauseForm = {
    uId: "-1",
    name: "",
    description: "",
};


export const specifiedRange = {
    key: "specifiedRange",
    isChecked: false,
    selectedRadio: "range",
    singleValue: "",
    from: "",
    to: "",
    operator: "",
    calculatedExpression: "",
};
export const normalRange = {
    key: "normalRange",
    isChecked: false,
    selectedRadio: "range",
    singleValue: "",
    from: "",
    to: "",
    operator: "",
    calculatedExpression: "",
};
export const enumeratedValue = {
    isChecked: false,
    enumeratedValueId: -1,
    currentValue: "",
    selectedListValue: "",
    list: ["-"]
};
export const defaultPagination = {
    activePage: 0,
    itemsCountPerPage: 0,
    totalItemsCount: 0,
    pageRangeDisplayed: 0,
};
export const defaultConstantParameterForm = Object.freeze({
    uId: -1,
    variableName: "",
    description: "",
    variableUnit: "°C",
    precision: "",
    specifiedRange: {...specifiedRange},
    normalRange: {...normalRange},
    enumeratedValue: {...enumeratedValue},
    currentValueOfParameter: "",
    remark: "",
    durationUnit: "min",
    duration: "",
    ID: "1"
    // file:{}
});
export const databaseTypeOptions = [
    {value: 'mySQL', label: 'mySQL'},
    {value: 'HSQL', label: 'HSQL'},
    {value: 'Oracle', label: 'Oracle'},
    {value: 'PostgresSQL', label: 'PostgresSQL'},
    {value: 'Sybase', label: 'Sybase'},
];
export const defaultConnectionForm = {
    connectionId: "-1",
    rtdasName: "",
    rtdasDescription: "",
    databaseType: "mySQL",
    selectedTable: [],
    dataBaseName: "",
    host: "",
    port: "",
    username: "",
    password: "",
};
export const defaultJsonForm = {
    connectionId: "-1",//todo
    fileStreamRadio: "file",
    fileObject: {
        jsonName: "",
        jsonDescription: "",
        jsonFile: {
            name: "",
            data: ""
        },
    },
    streamObject: {
        jsonName: "",
        jsonDescription: "",
        jsonHost: "",
        jsonPort: "",
        fetchRecords: "",
        fetchRecordsinMilliseconds: ""
    }
};

export const defaultCalculatedExpressionForm = {
    uId: -1,
    name: "",
    description: "",
    expression: "",
};

export const defaultParameterForm = Object.freeze({
    variableName: "",
    description: "",
    variableUnit: "°C",
    machine: "ME",
    // informationSource: "",
    // type: "Digital",
    precision: "",
    scale: "",
    isScaleChecked: false,
    rtdasMapping: "",
    specifiedRange: {...specifiedRange},
    normalRange: {...normalRange},
    enumeratedValue: {...enumeratedValue}
    // dataSource: "calculated",
});


export const defaultSelectedCondition = {
    value: "||",
    label: "OR"
};

export const defaultDropdownValue = {
    value: "",
    label: ""
};
export const defaultCauseList = [
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
export const defaultCauseArrObject = {
    isAccordionOpen: true,
    condition: {...defaultSelectedCondition},
    causeList: [...defaultCauseList]
};

export const defaultCauseArrObjectFromServer = {
    isAccordionOpen: true,
    condition: {...defaultSelectedCondition},
    causeList: []
};
export const defaultConfigForm = {
    configId: -1,
    fa_alarm_radio: "failure_advisory",
    failureAdvisory: null,
    causeArrList: [JSON.parse(JSON.stringify(defaultCauseArrObject))]
};

export const defaultSelected = {
    causeArrIndex: 0,
    causeListIndex: 0
};
export const conditionOptions = [
    {
        value: "||",
        label: "OR"
    },
    {
        value: "&&",
        label: "AND"
    }
];


export const defaultRuleChainForm = {
    ruleChainId: -1,
    ruleChainName: "",
    ruleChainDescription: "",
    ruleConfig: "",// here will be all ids of created rule config
    frequency: "",
    frequencyUnit: "sec",//dropdown
    isNumberOfOccurrencesChecked: false,
    isEvaluationFactorChecked: false,
    numberOfOccurrences: "",
    // ruleConfigs: [...[{...defaultRuleConfigForm}]]
    ruleConfigs: [],
    evaluationFactorUnit: "Probability",
    evaluationFactorValue: ""
};
export const defaultAdvisoryForm = {
    uId: "-1",
    fa_alarm_radio: "failure_advisory",//"alarm"
    name: "",
    description: "",
};

export const machineOptions = [
    {value: 'Machine1', label: 'Machine1'},
    {value: 'Machine2', label: 'Machine2'},
    {value: 'Machine3', label: 'Machine3'},
    {value: 'Machine4', label: 'Machine4'},
    {value: 'Machine5', label: 'Machine5'},
];

export const rangeText = {
    normalRange: "Operating Normal",
    specifiedRange: "OEM Specified",
}

export const CurrentValueObject = {
    selectedRadio: "range",
    singleValue: "",
    from: "",
    to: "",
    operator: "",
    calculatedExpression: "",
};

export const defaultNewParameterConstantForm = {
    isConstantChecked: false,
    variableName: "",
    description: "",
    variableUnit: "°C",
    machine: "ME",
    // informationSource: "",
    // type: "Digital",
    precision: "",
    scale: "",
    isScaleChecked: false,
    rtdasMapping: "",
    specifiedRange: {...specifiedRange},
    normalRange: {...normalRange},
    enumeratedValue: {...enumeratedValue},
    // dataSource: "calculated",
    informationSource: "",
    currentValueOfParameter: "",
    remark: "",
    durationUnit: "min",
    duration: "",
    ID: "1"
};

export const pathScreenMapping = {
    "MainGaugesHome": "Gauge",
    "MainEngineHome": "Main Engine",
    "MainEngineCX": "MainEngineCX",
    "MainEngineMD": "MainEngineMD",
    "MainEngineYZJ": "MainEngineYZJ",
    "DashboardHome": "Dashboard",
    "DashboardPage": "Analytics",
    "DashboardPage2": "New_Analytics",
    "MainEngineSF":"MainEngineSF",
    "FleetDashboard": "Fleet Dashboard",
    "ReportPage":"ReportPage",
    "DigitalAlarmHome": "DigitalAlarmHome",
    "EEOI": "EEOI",
    "Navigation": "Navigation",
    "Alarm": "Alarm",
    "All": "All",
    "Ships": "Ships"
}

export const screenArr = [
    { value: 'All', label: 'All' },
    { value: 'Dashboard', label: 'Dashboard' },
    { value: 'Gauge', label: 'Gauge' },
    { value: 'MainEngineCX', label: 'MainEngineCX' },
    { value: 'XpressME', label: 'XpressME' },
    { value: 'MainEngineSF', label: 'MainEngineSF' },
    { value: 'DigitalAlarmHome', label: 'DigitalAlarmHome' },
    { value: 'MainEngineMD', label: 'MainEngineMD' },
    { value: 'MainEngineYZJ', label: 'MainEngineYZJ' },
    { value: 'Fleet Dashboard', label: 'Fleet Dashboard' },
    { value: 'Analytics', label: 'Analytics' },
    { value: 'New_Analytics', label: 'New_Analytics' },
    { value: ' ReportPage', label: ' ReportPage' },
   
    { value: 'SparIndusME', label: 'SparIndusME' },
    { value: 'Alarm', label: 'Alarm' },
    { value: 'EEOI', label: 'EEOI' },
    { value: 'Navigation', label: 'Navigation'},
    { value: 'Ships', label: 'Ships' }
];


export const sortByDropdownList = [
    {
        "label": "Ascending",
        "value": "asc"
    },
    {
        "label": "Descending",
        "value": "desc"
    }
];
