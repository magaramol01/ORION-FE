import React, {Component} from "react";
import {Scrollbars} from 'react-custom-scrollbars';

class CustomScrollBar extends Component {

    constructor(props) {
        super(props);

        /*
        * Important :: when you mention autoHeight to true then also mention autoHeightMin and autoHeightMax
        * also don't mention height if possible
        * */

        this.renderThumb = this.renderThumb.bind(this);
    }

    renderThumb = ({ style, ...props }) => {
        // added css in App.css by name .customScrollBarCss
        const thumbStyle = {
            backgroundColor: "#414350",
            // backgroundImage: "-webkit-gradient(linear,left top,left bottom,from(#404357),to(#424345))",
            // backgroundImage: "-webkit-linear-gradient(top,#404357,#424345)",
            // backgroundImage: "-o-linear-gradient(top,#404357,#424345)",
            backgroundImage: "linear-gradient(180deg,#404357,#424345)",
            backgroundRepeat: "repeat-x",
            borderRadius: "6px",
            width: "9px"
            // opacity: 0
        };
        return (
            <div
                style={{ ...style, ...thumbStyle }}
                {...props}/>
        );
    };

    render() {
        const {autoHeight, autoHeightMin, autoHeightMax, height, width} = this.props;

        return (
            <Scrollbars
                autoHide
                renderThumbVertical={this.renderThumb}
                renderThumbHorizontal={this.renderThumb}
                autoHeight={autoHeight}
                autoHeightMin={autoHeightMin}
                autoHeightMax={autoHeightMax}
                style={{height: height, width: width}}
                {...this.props}
            >
            </Scrollbars>
        );
    }
}

export default CustomScrollBar;
