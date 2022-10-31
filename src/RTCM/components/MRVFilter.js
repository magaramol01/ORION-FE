import React, { Fragment, PureComponent } from "react";
import { Button, Col, Form } from "react-bootstrap";
import Select from "react-select";
import CustomAlarmDatePicker from "../../CBM/componant/Ship/CustomDatePicker";
import _ from "lodash";
import { AppContext } from "../context/GlobalContext";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const theme = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    // All possible overrides
    primary: "grey",
    primary25: "black",
  },
  // Other options you can use
  borderRadius: 2,
  baseUnit: 1,
  // controlHeight: 35,
  fontSize: 14,
  spacing: {
    ...theme.spacing,
    controlHeight: 30,
    baseUnit: 3,
  },
});

const customStyles = {
  control: (base, state) => ({
    ...base,
    background: "transparent",
    color: "white",
    // match with the menu
    borderRadius: state.isFocused ? "3px 3px 0 0" : 3,
    // Overwrittes the different states of border
    borderColor: state.isFocused ? "grey" : "grey",
    // Removes weird border around container
    boxShadow: state.isFocused ? null : null,
  }),
  menu: (base) => ({
    ...base,
    background: "#181a1c",
    // override border radius to match the box
    borderRadius: 0,
    // kill the gap
    marginTop: 0,
  }),
  menuList: (base) => ({
    ...base,
    background: "transparent",
    // kill the white space on first and last option
    padding: 0,
    "::-webkit-scrollbar": {
      width: "9px",
    },
    "::-webkit-scrollbar-track": {
      background: "transparent",
    },
    "::-webkit-scrollbar-thumb": {
      background: "#555",
    },
    "::-webkit-scrollbar-thumb:hover": {
      background: "#555",
    },
    textAlign: "left",
  }),
  input: (base) => ({
    ...base,
    color: "white",
  }),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = "opacity 300ms";
    const color = "white";

    return { ...provided, opacity, transition, color };
  },
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    // const color = chroma(data.color);

    return {
      ...styles,
      backgroundColor: isFocused ? "#dd6b66" : null,
      color: "#ffffff",
    };
  },
};

const getFormattedFromDate = (date) => {
  const fDate = ("0" + date.getDate()).slice(-2); //date.getDate();
  const fMonth = ("0" + (Number(date.getMonth()) + 1)).slice(-2);
  const fYear = date.getFullYear();
  return `${fYear}-${fMonth}-${fDate} 00:00:00`;
};

const getFormattedToDate = (date) => {
  const fDate = date.getDate();
  const fMonth = ("0" + (Number(date.getMonth()) + 1)).slice(-2);
  const fYear = date.getFullYear();
  return `${fYear}-${fMonth}-${fDate} 23:59:59`;
};

const getDisplayFromDate = (date) => {
  date = date.replace(" 00:00:00", "");
  let dataArr = date.split("-");
  const fDate = dataArr[0];
  const fMonth = dataArr[1];
  const fYear = dataArr[2];
  return `${fYear}-${fMonth}-${fDate}`;
};

const getDisplayToDate = (date) => {
  date = date.replace(" 23:59:59", "");
  let dataArr = date.split("-");
  const fDate = dataArr[0];
  const fMonth = dataArr[1];
  const fYear = dataArr[2];
  return `${fYear}-${fMonth}-${fDate}`;
};

const getVoyageListForFilter = (voyageListByDate) => {
  let disVoyageListByDate = [];
  let obj = {
    disaplyName: "All",
    selectedFlag: true,
    classVoyageName: "btnTypeVovageSelected",
  };
  disVoyageListByDate.push(obj);
  if (voyageListByDate != undefined) {
    if (voyageListByDate != "0.00") {
      for (let i = 0; i < voyageListByDate.length; i++) {
        let record = voyageListByDate[i];
        // if (record.isLatest) {
        let obj = {
          disaplyName: record.Voyage,
          selectedFlag: false,
          classVoyageName: "",
        };
        disVoyageListByDate.push(obj);
        //  }
      }
    }
  }

  return disVoyageListByDate;
};
const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index;
};

class MRVFilter extends PureComponent {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    const element = props.element;
    const voyageData = this.extractVoyageData(element);
    const voyageNoData = this.extractVoyageNoData(element);
    const defaultVoyageLabel = this.extractLatestVoyageLabel(voyageData);
    const defaultVoyageValue = this.extractLatestVoyageValue(voyageData);
    const forQueryDefaultVoaygeLabel =
      this.extractLatestVoyageQuery(voyageData);

    this.state = {
      element: element,
      activeFilterType: "byVoyage",
      fromDate: getFormattedFromDate(new Date(new Date().getFullYear(), 0, 1)), //getFormattedFromDate(new Date(new Date().getFullYear(), 0, 1)),
      // fromDate: "2021-01-01 00:00:00", //getFormattedFromDate(new Date(new Date().getFullYear(), 0, 1)),
      toDate: getFormattedToDate(new Date()),
      voyageArr: voyageData,
      voyageForFilterArr: voyageData,
      forQueryDefaultVoaygeLabel: forQueryDefaultVoaygeLabel,
      defaultVoyageLabel: defaultVoyageLabel,
      defaultVoyageValue: defaultVoyageValue,
      dashboardRef: props.dashboardRef,
      selectType: "L",
      finalVoyageListByDate: voyageNoData,
      finalVoyageListByDateForFilter: voyageNoData,
      selectVoyageType: "All",
      voyageChangeFilter: false,
    };
    this.getVoyageListForFilter1 = this.getVoyageListForFilter1.bind(this);
    sessionStorage.setItem("Section", "ByVoyage");
    sessionStorage.setItem("type", "L");
    sessionStorage.setItem("voyageSelection", 0);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!_.isEqual(nextProps.element, prevState.element)) {
      return { element: nextProps.element };
    } else return null;
  }

  setFromDate = (date) => {
    this.setState({
      fromDate: getFormattedFromDate(date),
    });

    setTimeout(() => {
      this.filterMRVData();
    }, 0);
  };

  setToDate = (date) => {
    this.setState({
      toDate: getFormattedToDate(date),
    });

    setTimeout(() => {
      this.filterMRVData();
    }, 0);
  };

  onDateInputChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value,
    });
    this.filterMRVData();
  };

  onDateDateBlockInputChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value,
    });
    this.filterMRVData();
  };
  onDropDownVoyageChange = (selectedValue) => {
    setTimeout(() => {
      this.setState({
        defaultVoyageLabel: selectedValue.label,
        defaultVoyageValue: selectedValue.value,
        forQueryDefaultVoaygeLabel: selectedValue.forQuery,
      });
      this.filterMRVData();
    }, 0);
  };

  filterMRVData = () => {
    const currentFilter = this.state.activeFilterType;
    if (currentFilter === "byVoyage") {
      this.state.dashboardRef.fetchMRVScreenStateByVoyage(
        this.state.forQueryDefaultVoaygeLabel
      );
    } else {
      this.state.dashboardRef.fetchMRVScreenStateByDate(
        this.state.fromDate,
        this.state.toDate
      );
    }
  };

  onFilterTypeChange = (sectionFlag, event) => {
    sessionStorage.setItem("Section", sectionFlag);
    const { dispatch, state } = this.context;
    dispatch({
      type: "SET_VOYAGE_FILTER",
      payload: event.target.dataset.key,
    });
    dispatch({
      type: "SET_VOYAGE_TYPE",
      payload: "L",
    });
    // console.log("event.target.dataset.key", event.target.dataset.key)
    this.setState({ selectType: "L" });
    this.setState({ activeFilterType: event.target.dataset.key });
    setTimeout(() => {
      this.filterMRVData();
    }, 0);
  };

  extractVoyageData = (element) => {
    const valArr = element.configuration.body.data.voyageData.widgetData.value;
    return valArr ? valArr : [];
  };
  extractVoyageNoData = (element) => {
    let voyageNo = new Array();
    let valArr = element.configuration.body.data.voyageData.widgetData.value;
    let obj = {
      disaplyName: "All",
      selectedFlag: true,
      classVoyageName: "btnTypeVovageSelected",
    };
    voyageNo.push(obj);
    for (let i = 0; i < valArr.length; i++) {
      let checkDuplicate = voyageNo.findIndex(
        (x) => x.disaplyName === valArr[i].label.split(" ")[0].trim()
      );
      if (checkDuplicate === -1) {
        let obj = {
          disaplyName: valArr[i].label.split(" ")[0].trim(),
          selectedFlag: false,
          classVoyageName: "",
          forQuery: valArr[i].forQuery,
        };
        voyageNo.push(obj);
      }
    }
    return voyageNo ? voyageNo : [];
  };

  extractLatestVoyageLabel = (valArr) => {
    const latestVoyage = _.find(valArr, { isLatest: true });
    if (latestVoyage) {
      return latestVoyage.label;
    }
    return null;
  };
  extractLatestVoyageQuery = (valArr) => {
    const latestVoyage = _.find(valArr, { isLatest: true });
    if (latestVoyage) {
      return latestVoyage.forQuery;
    }
    return null;
  };

  extractLatestVoyageValue = (valArr) => {
    const latestVoyage = _.find(valArr, { isLatest: true });
    if (latestVoyage) {
      return latestVoyage.value;
    }
    return null;
  };
  onTypeSelection = (event) => {
    this.setState({ voyageChangeFilter: true });
    const { dispatch, state } = this.context;
    let vovageDataByBtwDate = this.state.finalVoyageListByDateForFilter;
    let vovageData = this.state.voyageArr;
    let res = [];
    let resByBtwDate = [];
    this.setState({ selectType: event.target.name });

    sessionStorage.setItem("type", event.target.name);
    dispatch({ type: "SET_VOYAGE_TYPE", payload: event.target.name });
    if (event.target.name === "B") {
      res = vovageData.filter(
        (word) => word.label.split(" ")[0].indexOf("L") === -1
      );
      resByBtwDate = vovageDataByBtwDate.filter(
        (word) => word.disaplyName.trim().split(" ")[0].indexOf("L") === -1
      );
    } else if (event.target.name === "L") {
      res = vovageData.filter(
        (word) => word.label.split(" ")[0].indexOf("B") === -1
      );
      resByBtwDate = vovageDataByBtwDate.filter(
        (word) => word.disaplyName.trim().split(" ")[0].indexOf("B") === -1
      );
    } else {
      res = vovageData;
      resByBtwDate = vovageDataByBtwDate;
    }
    let tempRes = res.sort(
      (a, b) =>
        new Date(a.reportDateTime).getTime() -
        new Date(a.reportDateTime).getTime()
    );
    this.setState({ voyageForFilterArr: tempRes });
    this.setState({ finalVoyageListByDate: resByBtwDate });
    this.setState({
      defaultVoyageLabel: tempRes[0].label,
      defaultVoyageValue: tempRes[0].value,
    });
  };

  onTypeSelectionSectionVoyage = (event) => {
    this.setState({ voyageChangeFilter: true });
    const { dispatch, state } = this.context;
    let vovageDataByBtwDate = this.state.finalVoyageListByDateForFilter;
    let vovageData = this.state.voyageArr;
    let res = [];
    let resByBtwDate = [];
    this.setState({ selectType: event.target.dataset.key });
    sessionStorage.setItem("type", "L");
    dispatch({ type: "SET_VOYAGE_TYPE", payload: event.target.dataset.key });

    if (event.target.dataset.key === "B") {
      res = vovageData.filter(
        (word) => word.label.split(" ")[0].indexOf("L") === -1
      );
      resByBtwDate = vovageDataByBtwDate.filter(
        (word) => word.disaplyName.trim().split(" ")[0].indexOf("L") === -1
      );
    } else if (event.target.dataset.key === "L") {
      res = vovageData.filter(
        (word) => word.label.split(" ")[0].indexOf("B") === -1
      );
      resByBtwDate = vovageDataByBtwDate.filter(
        (word) => word.disaplyName.trim().split(" ")[0].indexOf("B") === -1
      );
    } else if (event.target.dataset.key === "All") {
      res = vovageData;
      resByBtwDate = vovageDataByBtwDate;
    }
    let tempRes = res.sort(
      (a, b) =>
        new Date(a.reportDateTime).getTime() -
        new Date(a.reportDateTime).getTime()
    );
    this.setState({ voyageForFilterArr: tempRes });
    this.setState({ finalVoyageListByDate: resByBtwDate });
    this.setState({
      defaultVoyageLabel: tempRes[0].label,
      defaultVoyageValue: tempRes[0].value,
    });
  };

  componentDidMount = () => {
    let vovageDataByBtwDate = this.state.finalVoyageListByDateForFilter;
    let vovageData = this.state.voyageArr;
    let res = [];
    let resByBtwDate = [];
    res = vovageData.filter(
      (word) => word.label.split(" ")[0].indexOf("B") === -1
    );
    resByBtwDate = vovageDataByBtwDate.filter(
      (word) => word.disaplyName.trim().split(" ")[0].indexOf("B") === -1
    );
    let tempRes = res.sort(
      (a, b) =>
        new Date(a.reportDateTime).getTime() -
        new Date(a.reportDateTime).getTime()
    );
    this.setState({ voyageForFilterArr: tempRes });
    this.setState({ finalVoyageListByDate: resByBtwDate });
    this.setState({
      defaultVoyageLabel: tempRes[0].label,
      defaultVoyageValue: tempRes[0].value,
    });
  };
  componentDidUpdate = (prevProps, prevState) => {
    const { state, dispatch } = this.context;
    if (this.state.defaultVoyageLabel !== prevState.defaultVoyageValue) {
      const voyageId = this.state.defaultVoyageLabel.split("From")[0].trim();
      const forQuery = this.state.voyageForFilterArr.find(
        (voyage) => voyage.voyageId == voyageId
      ).forQuery;
      this.state.dashboardRef.fetchMRVScreenStateByVoyage(
        forQuery
      );
    }
  };

  unSelectAllVoyage = (voyageName) => {
    let tempfinalVoyageList = this.state.finalVoyageListByDate;
    for (let i = 0; i < tempfinalVoyageList.length; i++) {
      if (tempfinalVoyageList[i].disaplyName != voyageName) {
        tempfinalVoyageList[i].classVoyageName = "";
        tempfinalVoyageList[i].selectedFlag = false;
      } else {
        tempfinalVoyageList[i].classVoyageName = "btnTypeVovageSelected";
        tempfinalVoyageList[i].selectedFlag = true;
      }
    }
    this.setState({ finalVoyageListByDate: tempfinalVoyageList });
  };

  onVoyageSelection = (event, list) => {
    this.setState({ selectVoyageType: event.target.dataset.key });
    let voyageName = event.target.dataset.key;
    this.unSelectAllVoyage(voyageName);
    if (voyageName === "All") {
      this.filterMRVData();
    } else {
      sessionStorage.setItem("voyageSelection", 1);
      this.state.dashboardRef.fetchMRVScreenStateByDateAndVoyage(
        voyageName,
        this.state.fromDate,
        this.state.toDate
      );
    }
  };
  
  getVoyageListForFilter1 = (voyageDateWiseList) => {
    let disVoyageListByDate = [];
    let obj = {
      disaplyName: "All",
      selectedFlag: true,
      classVoyageName:
        this.state.selectVoyageType === "All" ? "btnTypeVovageSelected" : "",
    };
    disVoyageListByDate.push(obj);
    let voyageListByDate = voyageDateWiseList;
    if (voyageListByDate != undefined) {
      if (voyageListByDate != "0.00") {
        for (let i = 0; i < voyageListByDate.length; i++) {
          let record = voyageListByDate[i];
          // if (record.isLatest) {
          let obj = {
            disaplyName: record.Voyage,
            selectedFlag: false,
            classVoyageName:
              this.state.selectVoyageType === record.Voyage
                ? "btnTypeVovageSelected"
                : "",
          };
          disVoyageListByDate.push(obj);
          //  }
        }
      }
    }

    this.setState({ finalVoyageListByDate: disVoyageListByDate });
    this.setState({ finalVoyageListByDateForFilter: disVoyageListByDate });

    // return disVoyageListByDate;
  };
  render() {
    const { dispatch, state } = this.context;

    const {
      fromDate,
      toDate,
      activeFilterType,
      voyageArr,
      voyageForFilterArr,
      defaultVoyageLabel,
      defaultVoyageValue,
      selectType,
      voyageListByDate,
      voyageChangeFilter,
      finalVoyageListByDate,
    } = this.state;
    const isVoyageFilterApplied = activeFilterType === "byVoyage";
    const isTypeSelectionApplied = true;
    // var Checkbox = require('react-btn-checkbox').Checkbox;
    const classNameAll =
      state.voyageType === "All" ? "btnTypeVovageSelected" : "";
    const classNameB = state.voyageType === "B" ? "btnTypeVovageSelected" : "";
    const classNameL = state.voyageType === "L" ? "btnTypeVovageSelected" : "";

    // this.getVoyageListForFilter1();

    return (
      <>
        <div className="row">
          {isVoyageFilterApplied ? (
            <div className="col-lg-8" style={{ textAlign: "right" }}>
              <div
                id={"mrvFilterPanel"}
                style={{ width: "100%", height: "100%", marginLeft: "12px" }}
              >
                <div className="container-fluid d-flex pl-2 pr-2 pt-1 pb-1">
                  <div key={`inline-radio`} style={{ whiteSpace: "nowrap" }}>
                    <Form.Check
                      name={`mrvFilterRadio`}
                      inline
                      label="By Voyage"
                      type="radio"
                      id={`condition-inline-radio-1`}
                      data-key="byVoyage"
                      data-radioname="byVoyage"
                      checked={isVoyageFilterApplied}
                      onChange={(e) => this.onFilterTypeChange("ByDate", e)}
                    />
                    {/* <Form.Check
                      name={`mrvFilterRadio`}
                      inline
                      label="By Date"
                      type="radio"
                      id={`condition-inline-radio-2`}
                      data-key="byDate"
                      data-radioname="byDate"
                      checked={!isVoyageFilterApplied}
                      onChange={(e) => this.onFilterTypeChange("ByDate", e)}
                    /> */}
                  </div>
                </div>
                <div className="container-fluid pl-2 pr-2 d-flex">
                  {isVoyageFilterApplied ? (
                    <Form.Group
                      size="sm"
                      as={Col}
                      className="pl-0"
                      //   style={{ border: "2px solid red" }}
                    >
                      <Select
                        id="ddlvoyage"
                        styles={customStyles}
                        theme={theme}
                        options={voyageForFilterArr}
                        data-key="voyageName"
                        onChange={(selectedOption) =>
                          this.onDropDownVoyageChange(selectedOption)
                        }
                        isMulti={false}
                        closeMenuOnSelect={true}
                        value={[
                          {
                            label: defaultVoyageLabel,
                            value: defaultVoyageValue,
                          },
                        ]}
                      />
                    </Form.Group>
                  ) : (
                    <Fragment>
                      <Form.Group size="sm" className="d-flex pr-2">
                        <Form.Label className="pr-2">From</Form.Label>
                        <DatePicker
                          className="form-control form-control-sm"
                          onChange={this.setFromDate}
                          onDateInputChange={this.onDateInputChange}
                          value={getDisplayFromDate(fromDate)}
                          dateName={"fromDate"}
                        />
                        {/* <CustomAlarmDatePicker
                                                     onDateChange={this.setFromDate}
                                                     onDateInputChange={this.onDateInputChange}
                                                     value={getDisplayFromDate(fromDate)}
                                                     dateName={"fromDate"}
                                                     
                                                 /> */}
                      </Form.Group>
                      <Form.Group size="sm" className="d-flex pr-2">
                        <Form.Label className="pr-2">To</Form.Label>
                        {/* <CustomAlarmDatePicker
                                                     onDateChange={this.setToDate}
                                                     onDateInputChange={this.onDateInputChange}
                                                     value={getDisplayToDate(toDate)}
                                                     dateName={"toDate"}
                                                 /> */}
                        <DatePicker
                          className="form-control form-control-sm"
                          onChange={this.setToDate}
                          onDateInputChange={this.onDateInputChange}
                          // onChange={date => setStartDate(date)}
                          value={getDisplayToDate(toDate)}
                          dateName={"toDate"}
                        />
                      </Form.Group>
                    </Fragment>
                  )}
                  {/* <Button
                                        size="sm"
                                        className="mt-0"
                                        onClick={this.filterMRVData}
                                        variant="outline-secondary"
                                        disabled={false}
                                    >
                                        Show
                                    </Button> */}
                </div>
              </div>
            </div>
          ) : (
            <div className="col-lg-5" style={{ textAlign: "right" }}>
              <div
                id={"mrvFilterPanel"}
                style={{ width: "100%", height: "100%", marginLeft: "12px" }}
              >
                <div className="container-fluid d-flex pl-2 pr-2 pt-1 pb-1">
                  <div key={`inline-radio`} style={{ whiteSpace: "nowrap" }}>
                    <Form.Check
                      name={`mrvFilterRadio`}
                      inline
                      label="By Voyage"
                      type="radio"
                      id={`condition-inline-radio-1`}
                      data-key="byVoyage"
                      data-radioname="byVoyage"
                      checked={isVoyageFilterApplied}
                      onChange={(e) => this.onFilterTypeChange("ByVoyage", e)}
                    />
                    {/* <Form.Check
                      name={`mrvFilterRadio`}
                      inline
                      label="By Date"
                      type="radio"
                      id={`condition-inline-radio-2`}
                      data-key="byDate"
                      data-radioname="byDate"
                      checked={!isVoyageFilterApplied}
                      onChange={(e) => this.onFilterTypeChange("ByVoyage", e)}
                    /> */}
                  </div>
                </div>
                <div className="container-fluid pl-2 pr-2 d-flex">
                  {isVoyageFilterApplied ? (
                    <Form.Group size="sm" as={Col} className="pl-0">
                      <Select
                        id="ddlvoyage"
                        styles={customStyles}
                        theme={theme}
                        options={voyageForFilterArr}
                        data-key="voyageName"
                        onChange={(selectedOption) =>
                          this.onDropDownVoyageChange(selectedOption)
                        }
                        isMulti={false}
                        closeMenuOnSelect={true}
                        value={[
                          {
                            label: defaultVoyageLabel,
                            value: defaultVoyageValue,
                          },
                        ]}
                      />
                    </Form.Group>
                  ) : (
                    <Fragment>
                      <Form.Group size="sm" className="d-flex pr-2">
                        <Form.Label className="pr-2 mt4">From</Form.Label>
                        <DatePicker
                          className="form-control form-control-sm"
                          onChange={this.setFromDate}
                          onDateInputChange={this.onDateDateBlockInputChange}
                          value={getDisplayFromDate(fromDate)}
                          dateName={"fromDate"}
                        />
                        {/* <CustomAlarmDatePicker
                     onDateChange={this.setFromDate}
                     onDateInputChange={this.onDateInputChange}
                     value={getDisplayFromDate(fromDate)}
                     dateName={"fromDate"}
                     
                 /> */}
                      </Form.Group>
                      <Form.Group size="sm" className="d-flex pr-2">
                        <Form.Label className="pr-2 mt4">To</Form.Label>
                        {/* <CustomAlarmDatePicker
                     onDateChange={this.setToDate}
                     onDateInputChange={this.onDateInputChange}
                     value={getDisplayToDate(toDate)}
                     dateName={"toDate"}
                 /> */}
                        <DatePicker
                          className="form-control form-control-sm"
                          onChange={this.setToDate}
                          onDateInputChange={this.onDateDateBlockInputChange}
                          // onChange={date => setStartDate(date)}
                          value={getDisplayToDate(toDate)}
                          dateName={"toDate"}
                        />
                      </Form.Group>
                    </Fragment>
                  )}
                  {/* <Button
                                        size="sm"
                                        className="mt-0"
                                        onClick={this.filterMRVData}
                                        variant="outline-secondary"
                                        disabled={false}
                                    >
                                        Show
                                    </Button> */}
                </div>
              </div>
            </div>
          )}
          {isVoyageFilterApplied ? (
            <div
              className="col-lg-3"
              style={{ marginLeft: "48px", color: "#33b5e5" }}
            >
              {isVoyageFilterApplied ? (
                <div className="row">
                  <div className="col-lg-11">Select voyage Type</div>
                  <div className="col-lg-11">
                    <input
                      type="checkbox"
                      class="btn-check "
                      name="All"
                      id="btn-check3"
                      checked={isTypeSelectionApplied}
                      data-key="All"
                      onChange={this.onTypeSelectionSectionVoyage}
                      autocomplete="off"
                    />

                    <label
                      className={`btn mt4 btnTypeVovage  ${classNameAll}`}
                      for="btn-check3"
                    >
                      All
                    </label>
                    <input
                      type="checkbox"
                      className="btn-check"
                      name={`L`}
                      id={`btn-check`}
                      checked={isTypeSelectionApplied}
                      data-key="L"
                      onChange={this.onTypeSelectionSectionVoyage}
                      autocomplete="off"
                    />
                    <label
                      className={`btn mt4 btnTypeVovage ${classNameL}`}
                      for="btn-check"
                    >
                      Laden
                    </label>

                    <input
                      type="checkbox"
                      class="btn-check"
                      name="B"
                      id="btn-check2"
                      checked={isTypeSelectionApplied}
                      data-key="B"
                      onChange={this.onTypeSelectionSectionVoyage}
                      autocomplete="off"
                    />
                    <label
                      className={`btn mt4 btnTypeVovage ${classNameB}`}
                      for="btn-check2"
                    >
                      Ballast
                    </label>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div
              className="col-lg-6"
              style={{ marginLeft: "48px", color: "#33b5e5" }}
            >
              <div className="row">
                <div className="col-lg-4">
                  <div className="row">
                    <div className="col-lg-11">Select voyage Type</div>
                    <div className="col-lg-11">
                      <input
                        type="checkbox"
                        class="btn-check "
                        name="All"
                        id="btn-check3"
                        data-key="All"
                        onChange={this.onTypeSelection}
                        autocomplete="off"
                      />

                      <label
                        className={`btn mt4 btnTypeVovage  ${classNameAll}`}
                        for="btn-check3"
                      >
                        All
                      </label>
                      <input
                        type="checkbox"
                        className="btn-check"
                        name={`L`}
                        id={`btn-check`}
                        checked={isTypeSelectionApplied}
                        data-key="L"
                        onChange={this.onTypeSelection}
                        autocomplete="off"
                      />
                      <label
                        className={`btn mt4 btnTypeVovage ${classNameL}`}
                        for="btn-check"
                      >
                        Laden
                      </label>

                      <input
                        type="checkbox"
                        class="btn-check"
                        name="B"
                        id="btn-check2"
                        // checked
                        checked={isTypeSelectionApplied}
                        data-key="B"
                        onChange={this.onTypeSelection}
                        autocomplete="off"
                      />
                      <label
                        className={`btn mt4 btnTypeVovage ${classNameB}`}
                        for="btn-check2"
                      >
                        Ballast
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col-lg-8">
                  <div className="row">
                    <div className="col-lg-11">Select voyage</div>
                    <div className="col-lg-11">
                      <div className="divVoyageList">
                        {this.state.finalVoyageListByDate.map((voyage) => (
                          <>
                            <input
                              type="checkbox"
                              className="btn-check"
                              name={`chkType`}
                              id={`btn-voyage-check${voyage.disaplyName}`}
                              data-key={voyage.disaplyName}
                              onChange={this.onVoyageSelection}
                              autocomplete="off"
                            />
                            <label
                              className={`btn mt4 btnTypeVovageByDt ${voyage.classVoyageName}`}
                              for={`btn-voyage-check${voyage.disaplyName}`}
                            >
                              {voyage.disaplyName}
                            </label>
                          </>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }
}

export default MRVFilter;
