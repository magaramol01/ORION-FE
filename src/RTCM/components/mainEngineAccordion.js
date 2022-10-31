import React, {Component, Fragment} from "react";
import {Carousel} from "react-bootstrap";
import _ from "lodash";
import MachineryAndEquipmentAccordion from "./machineryAndEquipmentAccordion";

class MainEngineAccordion extends Component {

    constructor(props) {
        super(props);

        this.state = {
            element: this.props.element,
            carouselIndex: 0
        };

        this.handleSelect = this.handleSelect.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!_.isEqual(nextProps.element, prevState.element)) {
            return {element: nextProps.element};
        } else return null;
    }

    handleSelect = (selectedIndex, e) => {
        this.setState({
            carouselIndex: selectedIndex
        });
    };

    render() {
        const element = this.state.element;
        const data = element.configuration.body.data;

        if (!data) {
            return null;
        }

        let i = 0;
        const carousels = _.map(data, carouselData => {
            i++;

            return (
                <Carousel.Item style={{height: "inherit", width: "inherit"}} key={"dhic" + i}>
                    <div style={{height: "272px", width: "100%"}}>
                        <MachineryAndEquipmentAccordion carouselData={carouselData}/>
                    </div>
                </Carousel.Item>
            );
        });

        return (
            <Fragment>
                <Carousel
                    activeIndex={this.state.carouselIndex}
                    onSelect={this.handleSelect}
                    controls={true}
                    indicators={false}
                    interval={1000000}
                    style={{height: "inherit", width: "inherit", background: "#212124"}}
                >
                    {carousels}
                </Carousel>
            </Fragment>
        );
    }
}

export default MainEngineAccordion;
