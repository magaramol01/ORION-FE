import React from "react";
import _ from "lodash";
import {Responsive, WidthProvider} from "react-grid-layout";
import Panel from "../common/panel";
import {establishSocketConnection} from "../../api";
import {setItemInLocalStorage, getCorrectFormattedDate2, getItemFromLocalStorage} from "../common/helper";
import '../../RTCM/common/css/App.css'

const ResponsiveReactGridLayout = WidthProvider(Responsive);

class DashboardGridLayout extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            otherData: props.otherData,
            className: "layout",
            rowHeight: 1,
            // breakpoints: {lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0},
            // cols: {lg: 1200, md: 996, sm: 786, xs: 480, xxs: 200},
            breakpoints: {lg: 1200, md: 1200, sm: 1200, xs: 1200, xxs: 1200},
            cols: {lg: 1200, md: 1200, sm: 1200, xs: 1200, xxs: 1200},
            currentBreakpoint: "lg",
            verticalCompact: false,
            compactType: "null",
            mounted: false,
            // layouts: { lg: this.layouts },
            gridItems: props.dashboardGridLayoutState ? props.dashboardGridLayoutState : {},
            newCounter: 5,
            needResizeManually: false,
            socketSubscriberName: props.socketSubscriberName,
            socket: establishSocketConnection(props.socketSubscriberName, props.otherData),
            dashboardRef: props.dashboardRef,
            dashboardtStateForCompass:this.props.dashboardtStateForCompass,
            windData:this.props.windyDataForCompass,
            MRVLatestData:this.props.MRVLatestData
        };

        this.subscribeToSocket(this.state.socketSubscriberName);

        this.onLayoutChange = this.onLayoutChange.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDrag = this.onDrag.bind(this);
        this.onDragStop = this.onDragStop.bind(this);
        this.onResizeStart = this.onResizeStart.bind(this);
        this.onResize = this.onResize.bind(this);
        this.onResizeStop = this.onResizeStop.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.onBreakpointChange = this.onBreakpointChange.bind(this);
        this.onCompactTypeChange = this.onCompactTypeChange.bind(this);
        this.forceUpdate = this.forceUpdate.bind(this);
        this.createPanel = this.createPanel.bind(this);
        this.addPanel = this.addPanel.bind(this);
        this.removePanel = this.removePanel.bind(this);
    }

    componentDidMount() {
        this.setState({ mounted: true });
    }

    componentDidUpdate(prevState, prevProps) {
        if (this.state.needResizeManually) {
            this.forceUpdate();
        }
        if (!_.isEqual(this.props.dashboardGridLayoutState, prevState.dashboardGridLayoutState)) {
            this.setState({gridItems: this.props.dashboardGridLayoutState});
        }
    }

    subscribeToSocket(socketSubscriberName) {
        this.state.socket.on(socketSubscriberName, dataSentOverSocket => {
            if(dataSentOverSocket.updatedTime) {
                setItemInLocalStorage('lastUpdatedHeaderTime', JSON.stringify(dataSentOverSocket.updatedTime));
            }
            if (dataSentOverSocket.otherData) {
                this.setState({
                    otherData: dataSentOverSocket.otherData
                });
            } else {
                delete dataSentOverSocket.updatedTime;
                this.setState({
                    gridItems: dataSentOverSocket
                });
            }
        });
    }

    // Calls back with (currentLayout) after every drag or resize stop.
    onLayoutChange = (layout, layouts) => {
        // send layout object on backend and modify existing objects coordinates from this and store it
        // callToBackendMethod();

        // console.log("onLayoutChange");
        // console.log(layout);
        // console.log(layouts);
    };

    // Calls when drag starts.
    onDragStart = (layouts, oldLayoutItem, newLayoutItem, placeholderLayoutItem, mouseEvent, htmlElement) => {
        // console.log("onDragStart");
    };

    // Calls on each drag movement.
    onDrag = (layouts, oldLayoutItem, newLayoutItem, placeholderLayoutItem, mouseEvent, htmlElement) => {
        // console.log("onDrag");
    };

    // Calls when drag is complete.
    onDragStop = (layouts, oldLayoutItem, newLayoutItem, placeholderLayoutItem, mouseEvent, htmlElement) => {
        // console.log("onDragStop");
    };

    // Calls when resize starts.
    onResizeStart = (layouts, oldLayoutItem, newLayoutItem, placeholderLayoutItem, mouseEvent, htmlElement) => {
        // console.log("onResizeStart");
    };

    // Calls when resize movement happens.
    onResize = (layouts, oldLayoutItem, newLayoutItem, placeholderLayoutItem, mouseEvent, htmlElement) => {
        // console.log("onResize");
    };

    // Calls when resize is complete.
    onResizeStop = (layouts, oldLayoutItem, newLayoutItem, placeholderLayoutItem, mouseEvent, htmlElement) => {
        // console.log("onResizeStop");
    };

    // Calls when some element has been dropped
    onDrop = (element) => {
        // console.log("onDrop");
        // alert(`Element parameters:\n${JSON.stringify(element, ['x', 'y', 'w', 'h'], 2)}`);
        this.addPanel(element);
    };

    // Calls when breakpoint has been changed
    onBreakpointChange = (breakpoint) => {
        // console.log("onBrakpointChange");
        this.setState({
            currentBreakpoint: breakpoint
        });
    };

    onCompactTypeChange = () => {
        const { compactType: oldCompactType } = this.state;
        const compactType =
            oldCompactType === "horizontal"
                ? "vertical"
                : oldCompactType === "vertical"
                ? null
                : "horizontal";
        this.setState({ compactType });
    };

    forceUpdate = () => {
        this.fireResizeManually();
    };

    /**
     * Fire resize event in order to repaint dashboard.
     */
    fireResizeManually = () => {
        this.timeoutResizing = setTimeout(() => {
            const evt = document.createEvent('UIEvents');
            evt.initUIEvent('resize', true, false, window, 0);
            window.dispatchEvent(evt);
        }, 301); // wait just 1 millisecond more than transition open/close dashboard notes animations
    };

    createPanel = (element) => {
        const isShowHeader = element.configuration.header.configuration.isShow;

        const elementLayout = _.clone(element.layout);
        if (!isShowHeader)  {
            elementLayout.h -= 1.3;
        }
        elementLayout.w = elementLayout.w * 100;
        elementLayout.x = elementLayout.x * 100;

        // this function's HTML should come from different files
        // already created reusable components but it's not working
        // need to check and debug
        const panelBody = Panel.getPanelBody(element, this.state.otherData, this.state.dashboardRef,this.state.dashboardtStateForCompass,this.state.windData,this.props.MRVLatestData,this.props.ciiLast90DaysData,this.props.fetchCII90DaysData,this.props.fetchCII90DaysDataByOption);
        const panelHeaderClass = Panel.getPanelHeaderClass(element);

        // TODO: Its a hack but forcefully remove below code as it will impact whole resize functionality
        if (elementLayout.h > elementLayout.maxH) {
            elementLayout.maxH = elementLayout.h;
        }
        if (elementLayout.h < elementLayout.minH) {
            elementLayout.minH = elementLayout.h;
        }

        return(
            <div key={elementLayout.i} data-grid={elementLayout} id={elementLayout.i}>
                <div className={element.configuration.panel.isTransparent ? "panel-container panel-container--absolute panel-container--transparent" : "panel-container panel-container--absolute"}>
                    {
                        isShowHeader
                        ? <div className="panel-header grid-drag-handle">
                                <div className="panel-title-container" aria-label="Panel header title item server requests">
                                    <div className={"panel-title " + panelHeaderClass}>
                                        <span className="icon-gf panel-alert-icon"/>
                                        <span className="panel-title-text">
                                            {element.configuration.header.text}

                                            {/*<span style={{position: "absolute"}}>
                                                <Dropdown id={"dropdown-toggle" + element.layout.i} onToggle={this.onToggleDropDown.bind(this, element)}>
                                                    <Dropdown.Toggle as={CustomToggle} id="dropdown-toggle"/>
                                                    <Dropdown.Menu className="dropdown-menu--menu panel-header-dropdown-panel-menu">
                                                        <Dropdown.Item eventKey="edit"
                                                                       data={element.layout.i} onSelect={this.onDropDownItemClick.bind(this, element)}>
                                                            <i className="fa fa-edit"/>
                                                            <span>Edit</span>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item eventKey="freezePanel"
                                                                       data={element.layout.i} onSelect={this.onDropDownItemClick.bind(this, element)}>
                                                            <div className={!element.configuration.header.configuration.isShow ? "movable-icon": "non-movable-icon"} />
                                                            <span>{element.configuration.header.configuration.isShow ? "Toggle Freeze Panel": "Toggle Freeze Panel"}</span>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item eventKey="toggleHeader"
                                                                       data={element.layout.i} onSelect={this.onDropDownItemClick.bind(this, element)}>
                                                            <i className="fa fa-eye-slash"/>
                                                            <span>{element.configuration.header.configuration.isShow ? "Hide Header": "Show Header"}</span>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item eventKey="transparentPanel"
                                                                       data={element.layout.i} onSelect={this.onDropDownItemClick.bind(this, element)}>
                                                            <i className="fa fa-edit"/>
                                                            <span>Toggle Panel Transparency</span>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item eventKey="remove"
                                                                       data={element.layout.i} onSelect={this.onDropDownItemClick.bind(this, element)}>
                                                            <i className="fa fa-trash-o"/>
                                                            <span>Remove</span>
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>{' '}
                                            </span>*/}

                                        </span>
                                    </div>
                                </div>
                            </div>
                         : null
                    }
                    <div className="nonDraggableArea">
                        {panelBody}
                    </div>
                </div>
            </div>
        );
    };

    addPanel = (element) => {
        const elementWidgetData = JSON.parse(element.e.dataTransfer.getData("widgetData"));

        // ideally panel Id should be generated on backend
        const panelId = "Panel-" + this.state.newCounter;

        const panelLayout = Panel.getPanelLayout(element, elementWidgetData, panelId);
        // this is temporary method, ideally this should get from backend...
        // for SmartShip demo purpose added here...
        const panelConfiguration = Panel.getPanelConfiguration(elementWidgetData);

        let gridItems = _.clone(this.state.gridItems);
        gridItems[panelId] = {
            layout: panelLayout,
            configuration: panelConfiguration,
            widgetDetails: elementWidgetData
        };

        this.setState({
            // Add a new item. It must have a unique key!
            gridItems: gridItems,
            // Increment the counter to ensure key is always unique.
            newCounter: this.state.newCounter + 1
        });
    };

    removePanel = (i) => {
        this.setState({
            gridItems: _.omit(this.state.gridItems, i)
        });
    };

    toggleFreezePanel = (element) => {
        let gridItems = _.clone(this.state.gridItems);
        let gridItemElement = gridItems[element.layout.i];
        gridItemElement.layout.isDraggable = !gridItemElement.layout.isDraggable;
        this.setState({gridItems: gridItems});
    };

    toggleHeader = (element) => {
        let gridItems = _.clone(this.state.gridItems);
        let gridItemElement = gridItems[element.layout.i];
        gridItemElement.configuration.header.configuration.isShow = !gridItemElement.configuration.header.configuration.isShow;
        this.setState({gridItems: gridItems});

        // TODO : Adjust layout and height of container
    };

    togglePanelTransparency = (element) => {
        let gridItems = _.clone(this.state.gridItems);
        let gridItemElement = gridItems[element.layout.i];
        gridItemElement.configuration.panel.isTransparent = !gridItemElement.configuration.panel.isTransparent;
        this.setState({gridItems: gridItems});
    };

    onDropDownItemClick = (element, eventKey, event) => {

        switch (eventKey) {
            case "":
                break;
        }

    };

    onToggleDropDown = (element, isOpen, event, metadata) => {
        /*
        * This is hack for drop-down menu as it gets disappear behind react grid panes and hence applied this logic
        * */
        // workaround 1 start
        if (isOpen) {
            document.getElementById(element.layout.i).style.zIndex = 1;
        } else {
            document.getElementById(element.layout.i).style.zIndex = "unset";
        }
        // workaround 1 end

        // workaround 2 start
        /*
        * revert above changes and set following
        * useCSSTransforms={false}
        * measureBeforeMount={true}
        * */
        // workaround 2 end
    };

    render() {
        /*
        * Disable draggable if mobile device, solving an issue with unintentionally
        * moving panels. https://github.com/grafana/grafana/issues/18497
        * */
        // const isDraggable = width <= 420 ? false : isDraggable;

        return (
            <ResponsiveReactGridLayout
                // draggableHandle=".react-grid-placeholder"
                className={this.state.class}
                rowHeight={this.state.rowHeight}
                breakpoints={this.state.breakpoints}
                cols={this.state.cols}
                verticalCompact={this.state.verticalCompact}
                // layouts={this.state.layouts}
                onLayoutChange={this.onLayoutChange}
                onDragStart={this.onDragStart}
                onDrag={this.onDrag}
                onDragStop={this.onDragStop}
                onResizeStart={this.onResizeStart}
                onResize={this.onResize}
                onResizeStop={this.onResizeStop}
                onDrop={this.onDrop}
                onBreakpointChange={this.onBreakpointChange}
                onCompactTypeChange={this.onCompactTypeChange}
                // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
                // and set `measureBeforeMount={true}`.
                useCSSTransforms={this.state.mounted}
                measureBeforeMount={false}
                compactType={this.state.compactType}
                preventCollision={true}
                isDroppable={true}
                // draggableHandle='.react-grid-item.react-grid-placeholder.cssTransforms.react-resizable-hide.react-resizable'
                draggableCancel=".nonDraggableArea"
                margin={[1, 1]}
            >
                {_.map(this.state.gridItems, el => this.createPanel(el))}
            </ResponsiveReactGridLayout>
        );
    }
}

export default DashboardGridLayout;
