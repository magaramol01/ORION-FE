import React from "react";
import _ from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";
const ResponsiveReactGridLayout = WidthProvider(Responsive);

export default class NoCompactingLayout extends React.Component {

    static defaultProps = {
        className: "layout",
        rowHeight: 1,
        onLayoutChange: function() {},
        cols: { lg: 1200, md: 10, sm: 6, xs: 4, xxs: 2 },
        initialLayout: generateLayout(),
        margin: [5, 5]
    };

    state = {
        currentBreakpoint: "lg",
        compactType: "null",
        mounted: false,
        layouts: { lg: this.props.initialLayout },
        toolbox: { lg: [] }
    };

    componentDidMount() {
        this.setState({ mounted: true });
    }

    generateDOM() {
        return _.map(this.state.layouts[this.state.currentBreakpoint], l => {
            return (
                <div key={l.i} className={l.static ? "static" : ""} style={{background: "#2d4b69"}}>
                    <div className="hide-button" onClick={this.onPutItem.bind(this, l)}>
                        &times;
                    </div>
                    {l.static ? (
                        <span
                            className="text"
                            title="This item is static and cannot be removed or resized."
                        >
              Static - {l.i}
            </span>
                    ) : (
                        <span className="text">{l.i}</span>
                    )}
                </div>
            );
        });
    }

    onBreakpointChange = breakpoint => {
        this.setState(prevState => ({
            currentBreakpoint: breakpoint,
            toolbox: {
                ...prevState.toolbox,
                [breakpoint]:
                prevState.toolbox[breakpoint] ||
                prevState.toolbox[prevState.currentBreakpoint] ||
                []
            }
        }));
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

    onTakeItem = item => {
        this.setState(prevState => ({
            toolbox: {
                ...prevState.toolbox,
                [prevState.currentBreakpoint]: prevState.toolbox[
                    prevState.currentBreakpoint
                    ].filter(({ i }) => i !== item.i)
            },
            layouts: {
                ...prevState.layouts,
                [prevState.currentBreakpoint]: [
                    ...prevState.layouts[prevState.currentBreakpoint],
                    item
                ]
            }
        }));
    };

    onPutItem = item => {
        this.setState(prevState => {
            return {
                toolbox: {
                    ...prevState.toolbox,
                    [prevState.currentBreakpoint]: [
                        ...(prevState.toolbox[prevState.currentBreakpoint] || []),
                        item
                    ]
                },
                layouts: {
                    ...prevState.layouts,
                    [prevState.currentBreakpoint]: prevState.layouts[
                        prevState.currentBreakpoint
                        ].filter(({ i }) => i !== item.i)
                }
            };
        });
    };

    onLayoutChange = (layout, layouts) => {
        this.props.onLayoutChange(layout, layouts);
        this.setState({ layouts });
    };

    onNewLayout = () => {
        this.setState({
            layouts: { lg: generateLayout() }
        });
    };

    render() {
        return (
            <div >
                <ResponsiveReactGridLayout
                    {...this.props}
                    layouts={this.state.layouts}
                    onBreakpointChange={this.onBreakpointChange}
                    onLayoutChange={this.onLayoutChange}
                    // WidthProvider option
                    measureBeforeMount={false}
                    // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
                    // and set `measureBeforeMount={true}`.
                    useCSSTransforms={this.state.mounted}
                    compactType={this.state.compactType}
                    preventCollision={true}
                >
                    {this.generateDOM()}
                </ResponsiveReactGridLayout>
            </div>
        );
    }
}

function generateLayout() {
    return _.map(_.range(0, 10), function(item, i) {
        let y = Math.ceil(Math.random() * 4) + 1;
        return {
            x: (_.random(0, 5) * 2) % 1200,
            y: Math.floor(i / 6) * y,
            w: 2 * 100,
            h: 25,
            i: i.toString(),
            static: Math.random() < 0.05
        };
    });
}
