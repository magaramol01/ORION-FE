import React from "react";
import f1 from '../../CBM/Images/downloadedImages/f1.png';
import f2 from '../../CBM/Images/downloadedImages/f2.png';
import f3 from '../../CBM/Images/downloadedImages/f3.png';
import f4 from '../../CBM/Images/downloadedImages/f4.png';
import m1 from '../../CBM/Images/downloadedImages/m1.png';
import m2 from '../../CBM/Images/downloadedImages/m2.png';
import m3 from '../../CBM/Images/downloadedImages/m3.png';

const SideBar = ({triggerSideBarClick}) => {

    const listOfItems = [
        {
            id: 0,
            src: m1,
            header: true,
            text: "Widget 1"
        }, {
            id: 1,
            src: f1,
            text: "Widget 2",
            // price: "$3.00"
        }, {
            id: 2,
            src: m2,
            text: "Widget 3",
            // price: "$2.60"
        }, {
            id: 3,
            src: f2,
            text: "Widget 4",
            // price: "$3.50"
        }, {
            id: 4,
            src: f3,
            text: "Widget 4",
            // price: "$2.50"
        }, {
            id: 5,
            src: f4,
            text: "Widget 5",
            // price: "$3.50"
        }, {
            id: 6,
            src: m3,
            text: "Widget 6",
            // price: "$3.00"
        }, {
            id: 7,
            src: f2,
            text: "Widget 7",
            // price: "$2.00"
        }/*, {
            id: 8,
            header: true,
            text: "Alcoholic drinks"
        }*/, {
            id: 9,
            src: f1,
            text: "Widget 8",
            // price: "$3.00"
        }, {
            id: 10,
            src: m1,
            text: "Widget 9",
            // price: "$4.00"
        }/*, {
            id: 11,
            src: "https://img.mobiscroll.com/demos/dMartini.jpg",
            text: "Martini",
            price: "$4.50"
        }, {
            id: 12,
            src: "https://img.mobiscroll.com/demos/dRum.jpg",
            text: "Rum",
            price: "$5.00"
        }, {
            id: 13,
            src: "https://img.mobiscroll.com/demos/dWine.jpg",
            text: "Wine",
            price: "$4.50"
        }, {
            id: 14,
            src: "https://img.mobiscroll.com/demos/dWhiskey.jpg",
            text: "Whiskey",
            price: "$6.00"
        }*/
    ];

    return (
        <div style={{marginTop: "20px"}}>

            <div style={{marginBottom: "20px"}}>
                <button onClick={() => triggerSideBarClick()}
                        className="btn btn--radius-right-0 navbar-button navbar-button--border-right-0">
                    <i className="fa fa-arrow-circle-left" style={{marginRight: "5px"}}/>
                    Dashboard Widgets
                </button>
            </div>

            <ul style={{paddingLeft: "30px", paddingRight: "30px"}}>
                {listOfItems.map(function (item) {
                    return <div key={item.id} style={{padding: "5px", cursor: "pointer", userSelect: "none"}}>
                        {item.src ?
                            <img src={item.src} style={{resize: "both", height: "40px", width: "40px"}}/> : null}
                        <span style={{marginLeft: "10px"}}>{item.text}</span>
                    </div>;
                })}
            </ul>
        </div>
    );
};

export default SideBar;
