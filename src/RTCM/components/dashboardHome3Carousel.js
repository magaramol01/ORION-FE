import React, {Component} from "react";
import {Carousel} from "react-bootstrap";
import MachineryAndEquipmentAccordion from "./machineryAndEquipmentAccordion";
import _ from "lodash";

class DashboardHome3Carousel extends Component {

    constructor(props) {
        super(props);

        this.state = {
            element: props.element,
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

        const carousels = _.map(data, carouselData => {

            return (
                <Carousel.Item style={{height: "inherit", width: "inherit"}} key={Object.keys(carouselData)[0]}>
                    <div style={{height: "405px", width: "100%"}}>
                        <MachineryAndEquipmentAccordion carouselData={carouselData}/>
                    </div>
                </Carousel.Item>
            );
        });

        return (
            <div>
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
            </div>
        );
    }
}

export default DashboardHome3Carousel;
