import React from "react";
import _ from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";
import Panel from "../common/panel";
const ResponsiveReactGridLayout = WidthProvider(Responsive);

class DashboardGridLayout extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            className: "layout",
            rowHeight: 1,
            breakpoints: {lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0},
            cols: {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2},
            currentBreakpoint: "lg",
            compactType: "null",
            mounted: false,
            // layouts: { lg: this.layouts },
            gridItems: this.props.dashboardGridLayoutState ? this.props.dashboardGridLayoutState : {},
            newCounter: 5
        };

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
        this.createPanel = this.createPanel.bind(this);
        this.addPanel = this.addPanel.bind(this);
        this.removePanel = this.removePanel.bind(this);
    }

    componentDidMount() {
        this.setState({ mounted: true });
    }

    // Calls back with (currentLayout) after every drag or resize stop.
    onLayoutChange = (layout, layouts) => {
        // send layout object on backend and modify existing objects coordinates from this and store it
        // callToBackendMethod();

        //console.log("onLayoutChange");
        // console.log(layout);
        // console.log(layouts);
    };

    // Calls when drag starts.
    onDragStart = (layouts, oldLayoutItem, newLayoutItem, placeholderLayoutItem, mouseEvent, htmlElement) => {
        //console.log("onDragStart");
    };

    // Calls on each drag movement.
    onDrag = (layouts, oldLayoutItem, newLayoutItem, placeholderLayoutItem, mouseEvent, htmlElement) => {
        //console.log("onDrag");
    };

    // Calls when drag is complete.
    onDragStop = (layouts, oldLayoutItem, newLayoutItem, placeholderLayoutItem, mouseEvent, htmlElement) => {
        //console.log("onDragStop");
    };

    // Calls when resize starts.
    onResizeStart = (layouts, oldLayoutItem, newLayoutItem, placeholderLayoutItem, mouseEvent, htmlElement) => {
        //console.log("onResizeStart");
    };

    // Calls when resize movement happens.
    onResize = (layouts, oldLayoutItem, newLayoutItem, placeholderLayoutItem, mouseEvent, htmlElement) => {
        //console.log("onResize");
    };

    // Calls when resize is complete.
    onResizeStop = (layouts, oldLayoutItem, newLayoutItem, placeholderLayoutItem, mouseEvent, htmlElement) => {
        //console.log("onResizeStop");
    };

    // Calls when some element has been dropped
    onDrop = (element) => {
        //console.log("onDrop");
        // alert(`Element parameters:\n${JSON.stringify(element, ['x', 'y', 'w', 'h'], 2)}`);
        this.addPanel(element);
    };

    // Calls when breakpoint has been changed
    onBreakpointChange = (breakpoint) => {
        //console.log("onBrakpointChange");
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

    /*createPanel = (element) => {
        const elementLayout = element.layout;
        const removeStyle = {
            position: "absolute",
            right: "2px",
            top: 0,
            cursor: "pointer"
        };

        const i = elementLayout.i;

        return (
            <div key={i} data-grid={elementLayout}>
                <span className="text">{i}</span>
                <span
                    className="remove"
                    style={removeStyle}
                    onClick={this.removePanel.bind(this, i)}
                > X </span>
            </div>
        );
    };*/

    createPanel = (element) => {
        const isShowHeader = element.configuration.header.configuration.isShow;
        if (!isShowHeader)  {
            element.layout.h -= 1.3;
        }
        // this function's HTML should come from different files
        // already created reusable components but it's not working
        // need to check and debug
        const panelBody = Panel.getPanelBody(element);

        return(
            <div key={element.layout.i} data-grid={element.layout}>
                <div className="panel-container panel-container--absolute">
                    {
                        isShowHeader
                        ? <div className="panel-header grid-drag-handle">
                                <div className="panel-title-container" aria-label="Panel header title item server requests">
                                    <div className="panel-title">
                                        <span className="icon-gf panel-alert-icon"/>
                                        <span className="panel-title-text">
                                            {element.configuration.header.text}
                                            {/*<span className="fa fa-caret-down panel-menu-toggle"/>*/}
                                </span>
                                    </div>
                                </div>
                            </div>
                         : null
                    }
                    {panelBody}
                </div>
            </div>
        );
    };

    addPanel = (element) => {

        // this.setState({
        //     // Add a new item. It must have a unique key!
        //     gridItems: this.state.gridItems.concat({
        //         i: "n" + this.state.newCounter,
        //         x: (this.state.gridItems.length * 2) % (this.state.cols || 12),
        //         y: Infinity, // puts it at the bottom
        //         w: 2,
        //         h: 2
        //     }),
        //     // Increment the counter to ensure key is always unique.
        //     newCounter: this.state.newCounter + 1
        // });

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

    render() {
        /*
        * Disable draggable if mobile device, solving an issue with unintentionally
        * moving panels. https://github.com/grafana/grafana/issues/18497
        * */
        // const isDraggable = width <= 420 ? false : isDraggable;

        return (
            <ResponsiveReactGridLayout
                className={this.state.class}
                rowHeight={this.state.rowHeight}
                breakpoints={this.state.breakpoints}
                cols={this.state.cols}
                // verticalCompact={this.state.verticalCompact}
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
                measureBeforeMount={false}
                // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
                // and set `measureBeforeMount={true}`.
                useCSSTransforms={this.state.mounted}
                compactType={this.state.compactType}
                preventCollision={!this.state.compactType}
                isDroppable={true}
                isDraggable={true}
                // draggableHandle='.react-grid-item.react-grid-placeholder.cssTransforms.react-resizable-hide.react-resizable'
                droppingItem={{i: 'uniqueID', w: 1, h: 10}}
            >
                {_.map(this.state.gridItems, el => this.createPanel(el))}
            </ResponsiveReactGridLayout>
        );
    }
}

export default DashboardGridLayout;
