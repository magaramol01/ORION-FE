import React, { Component } from "react";
import SideNav, { NavIcon, NavItem, NavText } from "@trendmicro/react-sidenav";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { Link } from "react-router-dom";
import { deploymentType } from "../api";
import { getItemFromLocalStorage } from "../RTCM/common/helper";
import logo from "../CBM/Images/smart-ship-logo-white.png";

export default class SMSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: props.screenPath.replace("/", ""),
      expanded: false,
      ScreenMapping: {
        Dashboard: false,
        Gauge: false,
        MainEngineCX: false,
        ReportPage: false,
        "Fleet Dashboard": false,
        XpressME: false,
        MainEngineSF: false,
        MainEngineYZJ: false,
        DigitalAlarmHome: false,
        MainEngineMD: false,
        Alarm: false,
        Analytics: false,
        New_Analytics: false,
        SparIndusME: false,
        EEOI: false,
        Navigation: false,
        VoyageBannerEntry: false,
      },
    };
  }

  componentDidMount() {
    let { ScreenMapping } = this.state;
    const ScreenMappings = getItemFromLocalStorage("ScreenMapping");
    for (let ScreenKey in ScreenMapping) {
      if (ScreenMappings[0] === "All") {
        ScreenMapping[ScreenKey] = true;
      } else {
        ScreenMapping[ScreenKey] = ScreenMappings.indexOf(ScreenKey) > -1;
      }
    }
    this.setState({ ScreenMapping });
  }

  onSelect = (selected) => {
    this.setState({
      selected: selected,
    });

    const to = "/" + selected;
    if (window.location.pathname !== to) {
      this.props.history.push({
        pathname: to,
      });
    }
  };

  onToggle = () => {
    this.setState({ expanded: !this.state.expanded });
    console.log(this.state.expanded);
  };

  render() {
    const { expanded, selected, ScreenMapping } = this.state;

    return (
      <div>
        <div style={{ position: "absolute" }}>
          <div className="d-flex float-left">
            <ProSidebar
              collapsed={!expanded}
              width="240px"
              collapsedWidth="64px"
              style={{ height: "100vh" }}
            >
              <SidebarHeader
                style={{
                  position: "sticky",
                  top: "0",
                  zIndex: "101",
                  background: "rgb(33,33,36)",
                }}
              >
                <div onClick={this.onToggle} style={{ height: "45px" }}>
                  <i
                    className="fas fa-bars"
                    style={{
                      fontSize: "1.5em",
                      opacity: 0.7,
                      verticalAlign: "middle",
                      marginLeft: "27px",
                      marginTop: "20px",
                    }}
                  />
                  {/* {this.state.expanded ?
                                        <img src={logo} width="120px" style={{ marginLeft: '10px' }} />
                                        : <div> </div>
                                    } */}
                </div>
              </SidebarHeader>
              <SidebarContent>
                <Menu>
                  {ScreenMapping["Dashboard"] && (
                    <MenuItem
                      title="Dashboard"
                      active={selected === "DashboardHome"}
                      icon={
                        <i
                          className="fa fa-th-large"
                          style={{
                            fontSize: "1.60em",
                            verticalAlign: "middle",
                          }}
                        />
                      }
                    >
                      <Link to="/DashboardHome" />
                      Dashboard
                    </MenuItem>
                  )}
                  {/* 
                        {
                            (ScreenMapping["XpressME"] && getItemFromLocalStorage("shipName") == "xpress-kanchenjunga") &&
                            <NavItem eventKey="XpressME" title="Xpress ME"
                                active={selected === "XpressME"}>
                                <NavIcon>
                                    <i className="fa fa-fw fa-cogs" aria-hidden="true"
                                        style={{ fontSize: '1.50em', verticalAlign: 'middle' }} />
                                </NavIcon>
                                <NavText title="Main Engine">
                                    Xpress Main Engine
                                </NavText>
                            </NavItem>
                        } */}
                  {ScreenMapping["MainEngineMD"] &&
                    (getItemFromLocalStorage("shipName") ==
                      "nova-nanjing-express" ||
                      getItemFromLocalStorage("shipName") ==
                        "nova-fujian-express" ||
                      getItemFromLocalStorage("shipName") ==
                        "nova-xinhui-express" ||
                      getItemFromLocalStorage("shipName") ==
                        "nova-shanghai-express") && (
                      <MenuItem
                        title="Main Engine"
                        active={selected === "MainEngineMD"}
                        icon={
                          <i
                            className="fa fa-fw fa-cogs"
                            aria-hidden="true"
                            style={{
                              fontSize: "1.50em",
                              verticalAlign: "middle",
                            }}
                          />
                        }
                      >
                        <Link to="/MainEngineMD" />
                        Main Engine
                      </MenuItem>
                    )}
                  {ScreenMapping["MainEngineCX"] &&
                    (getItemFromLocalStorage("shipName") ==
                      "nova-china-express" ||
                      getItemFromLocalStorage("shipName") ==
                        "nova-indonesia-express" ||
                      getItemFromLocalStorage("shipName") ==
                        "nova-brazil-express" ||
                      getItemFromLocalStorage("shipName") ==
                        "nova-canada-express") && (
                      <MenuItem
                        title="Main Engine"
                        active={selected === "MainEngineCX"}
                        icon={
                          <i
                            className="fa fa-fw fa-cogs"
                            aria-hidden="true"
                            style={{
                              fontSize: "1.50em",
                              verticalAlign: "middle",
                            }}
                          />
                        }
                      >
                        <Link to="/MainEngineCX" />
                        MainEngineCX
                      </MenuItem>
                    )}

                  {ScreenMapping["MainEngineYZJ"] &&
                    (getItemFromLocalStorage("shipName") ==
                      "nova-batavia-express" ||
                      getItemFromLocalStorage("shipName") ==
                        "nova-kalimantan-express" ||
                      getItemFromLocalStorage("shipName") ==
                        "nova-medan-express" ||
                      getItemFromLocalStorage("shipName") ==
                        "tarakan-express") && (
                      <MenuItem
                        title="Main Engine"
                        active={selected === "MainEngineYZJ"}
                        icon={
                          <i
                            className="fa fa-fw fa-cogs"
                            aria-hidden="true"
                            style={{
                              fontSize: "1.50em",
                              verticalAlign: "middle",
                            }}
                          />
                        }
                      >
                        <Link to="/MainEngineYZJ" />
                        Main Engine
                      </MenuItem>
                    )}
                  {/* {
                            (ScreenMapping["SparIndusME"] && getItemFromLocalStorage("shipName") == "spar-indus") &&
                            <NavItem eventKey="SparIndusME" title="Spar Indus ME"
                                active={selected === "SparIndusME"}>
                                <NavIcon>
                                    <i className="fa fa-fw fa-cogs" aria-hidden="true"
                                        style={{ fontSize: '1.50em', verticalAlign: 'middle' }} />
                                </NavIcon>
                                <NavText title="Main Engine">
                                    SparIndus Main Engine
                                </NavText>
                            </NavItem>
                        } */}

                  {ScreenMapping["MainEngineSF"] &&
                    getItemFromLocalStorage("shipName") ==
                      "nova-asia-liberty-express" && (
                      <MenuItem
                        title="Main Engine"
                        active={selected === "Main Engine"}
                        icon={
                          <i
                            className="fa fa-fw fa-cogs"
                            aria-hidden="true"
                            style={{
                              fontSize: "1.50em",
                              verticalAlign: "middle",
                            }}
                          />
                        }
                      >
                        <Link to="/MainEngineSF" />
                        Main Engine
                      </MenuItem>
                    )}

                  {
                    //<NavItem eventKey="MRVHome" title="MRV Dashboard" active={selected === "MRVHome"}>
                    // <NavIcon>
                    //   <i className="fa fa-clone" aria-hidden="true"
                    //   style={{fontSize: '1.50em', verticalAlign: 'middle'}}/>
                    //</NavIcon>
                    // <NavText title="MRV Dashboard">
                    //  MRV Dashboard
                    // </NavText>
                    // </NavItem>
                  }

                  {ScreenMapping["Gauge"] && (
                    <MenuItem
                      title=" Gauges"
                      active={selected === "MainGaugesHome"}
                      icon={
                        <i
                          className="fa fa-tachometer"
                          aria-hidden="true"
                          style={{
                            fontSize: "1.50em",
                            verticalAlign: "middle",
                          }}
                        />
                      }
                    >
                      <Link to="/MainGaugesHome" />
                      Gauges
                    </MenuItem>
                  )}
                  <SubMenu
                    eventKey="Emissions"
                    title="Emissions"
                    active={selected === "Emissions"}
                    icon={
                      <i
                        className="fa fa-clone"
                        style={{ fontSize: "1.5em", verticalAlign: "middle" }}
                      />
                    }
                  >
                     {
                      <MenuItem
                        icon={
                          <i
                            className="fa fa-ship"
                            style={{
                              fontSize: "1.2em",
                              verticalAlign: "middle",
                              marginLeft: "8px",
                            }}
                            title="CII"
                          />
                        }
                      >
                        <Link to="/CII" />
                       CII
                      </MenuItem>
                    }
                    {
                      <MenuItem
                        icon={
                          <i
                            className="fa fa-home"
                            style={{
                              fontSize: "1.5em",
                              verticalAlign: "middle",
                              marginLeft: "8px",
                            }}
                            title="EEOI"
                          />
                        }
                      >
                        <Link to="/EEOI" />
                        EEOI
                      </MenuItem>
                    }
                   
                  </SubMenu>

                  {/* {ScreenMapping["EEOI"] && (
                    <MenuItem
                      title="Emissions"
                      active={selected === "EEOI"}
                      icon ={
                        <i
                          className="fa fa-clone"
                          aria-hidden="true"
                          style={{
                            fontSize: "1.50em",
                            verticalAlign: "middle",
                          }}
                        />}
                    >
                    <Link to="/EEOI" />

                    <SubMenu>
                      <MenuItem>1</MenuItem>
                      <MenuItem>2</MenuItem>
                      <MenuItem>3</MenuItem>
                    </SubMenu>
                    

                     Emissions
                    </MenuItem>
                  )} */}

                  {ScreenMapping["Navigation"] && (
                    <MenuItem
                      title="Navigation"
                      icon={
                        <i
                          className="fa fa-compass"
                          aria-hidden="true"
                          style={{
                            fontSize: "1.50em",
                            verticalAlign: "middle",
                          }}
                        />
                      }
                    >
                      <Link to="/Navigation" />
                      Navigation
                    </MenuItem>
                  )}

                  {ScreenMapping["DigitalAlarmHome"] && (
                    <MenuItem
                      title="DigitalAlarmHome"
                      active={selected === "DigitalAlarmHome"}
                      icon={
                        <i
                          className="fab fa-digital-ocean"
                          aria-hidden="true"
                          style={{
                            fontSize: "1.50em",
                            verticalAlign: "middle",
                          }}
                        />
                      }
                    >
                      <Link to="/DigitalAlarmHome" />
                      DigitalAlarmHome
                    </MenuItem>
                  )}

                  {ScreenMapping["Alarm"] && (
                    <MenuItem
                      title="Alarm"
                      active={selected === "Alarm"}
                      icon={
                        <i
                          className="fa fa-fw fa-list-alt"
                          style={{
                            fontSize: "1.50em",
                            verticalAlign: "middle",
                          }}
                        />
                      }
                    >
                      <Link to="/Alarm" />
                      Alarm
                    </MenuItem>
                  )}

                  {ScreenMapping["Fleet Dashboard"] && (
                    <MenuItem
                      title="Fleet Dashboard"
                      active={selected === "FleetDashboard"}
                      icon={
                        <i
                          className="fa fa-globe"
                          aria-hidden="true"
                          style={{
                            fontSize: "1.50em",
                            verticalAlign: "middle",
                          }}
                        />
                      }
                    >
                      <Link to="/FleetDashboard" />
                      Fleet Dashboard
                    </MenuItem>
                  )}

                  {ScreenMapping["Analytics"] && (
                    <MenuItem
                      title="Analytics_0"
                      active={selected === "DashboardPage"}
                      icon={
                        <i
                          className="fa fa-fw fa-line-chart"
                          style={{
                            fontSize: "1.50em",
                            verticalAlign: "middle",
                          }}
                        />
                      }
                    >
                      <Link to="/DashboardPage" />
                      Analytics_0
                    </MenuItem>
                  )}
                  {ScreenMapping["New_Analytics"] && (
                    <MenuItem
                      title="Analytics"
                      active={selected === "DashboardPage2"}
                      icon={
                        <i
                          className="fa fa-fw fa-bar-chart"
                          style={{
                            fontSize: "1.50em",
                            verticalAlign: "middle",
                          }}
                        />
                      }
                    >
                      <Link to="/DashboardPage2" />
                      Analytics
                    </MenuItem>
                  )}

                  {ScreenMapping["ReportPage"] && (
                    <MenuItem
                      title="Technical Advisory"
                      active={selected === "ReportPage"}
                      icon={
                        <i
                          className="fa fa-file-pdf-o"
                          style={{
                            fontSize: "1.50em",
                            verticalAlign: "middle",
                          }}
                        />
                      }
                    >
                      <Link to="/ReportPage" />
                      Technical Advisory
                    </MenuItem>
                  )}

                  <SubMenu
                    eventKey="settings"
                    title="Settings"
                    active={selected === "settings"}
                    icon={
                      <i
                        className="fa fa-cog"
                        style={{ fontSize: "1.5em", verticalAlign: "middle" }}
                      />
                    }
                  >
                    {getItemFromLocalStorage("role") ===
                      "Smart Ship Super User" && (
                      <MenuItem
                        icon={
                          <i
                            className="fa fa-home"
                            style={{
                              fontSize: "1.5em",
                              verticalAlign: "middle",
                              marginLeft: "8px",
                            }}
                            title="Company Entry"
                          />
                        }
                      >
                        <Link to="/CompanyEntryTable" />
                        Company Entry
                      </MenuItem>
                    )}
                    {deploymentType == "shore" &&
                      getItemFromLocalStorage("createShips") !== "false" && (
                        <MenuItem
                          icon={
                            <i
                              className="fa fa-ship"
                              style={{
                                fontSize: "1.2em",
                                verticalAlign: "middle",
                                marginLeft: "8px",
                              }}
                              title="Ship Management"
                            />
                          }
                        >
                          <Link to="/Ships" />
                          Ship Management
                        </MenuItem>
                      )}
                    {deploymentType == "shore" && (
                      <MenuItem
                        icon={
                          <i
                            className="fa fa-user"
                            style={{
                              fontSize: "1.5em",
                              verticalAlign: "middle",
                              marginLeft: "8px",
                            }}
                            title="User Management"
                          />
                        }
                      >
                        <Link to="/UserManagement" />
                        User Management
                      </MenuItem>
                    )}
                    {getItemFromLocalStorage("role") ===
                      "Smart Ship Super User" && (
                      <MenuItem
                        icon={
                          <i
                            className="fas fa-route"
                            style={{
                              fontSize: "1.5em",
                              verticalAlign: "middle",
                              marginLeft: "8px",
                            }}
                            title="Upload Ship Route"
                          />
                        }
                      >
                        <Link to="/ShipRoute" />
                        Ship Route
                      </MenuItem>
                    )}

                    {getItemFromLocalStorage("role") ===
                      "Smart Ship Super User" && (
                      <MenuItem
                        icon={
                          <i
                            className="fas fa-flag"
                            style={{
                              fontSize: "1.5em",
                              verticalAlign: "middle",
                              marginLeft: "8px",
                            }}
                            title="VoyageBannerEntry"
                          />
                        }
                      >
                        <Link to="/VoyageBannerEntry" />
                        VoyageBannerEntry
                      </MenuItem>
                    )}
                    {/* {
                                (getItemFromLocalStorage("role")==="Smart Ship Super User") && (
                                    <NavItem eventKey="VoyageBannerEntry">
                                        <NavText style={{ paddingRight: 32 , fontSize: 14}} title="Voyage Banner Entery">
                                            Voy.Banner Entry
                                        </NavText>
                                    </NavItem>
                                )
                            } */}
                  </SubMenu>

                  <div className="sc-gZMcBi fxGkLM" />

                  <MenuItem
                    title="Sign Out"
                    active={selected === "logout"}
                    icon={
                      <i
                        className="fa fa-fw fa-power-off"
                        style={{ fontSize: "1.50em", verticalAlign: "middle" }}
                      />
                    }
                  >
                    <Link to="/logout" />
                    Sign Out
                  </MenuItem>
                </Menu>
              </SidebarContent>
            </ProSidebar>
          </div>
        </div>

        <div
          style={{
            // marginLeft: expanded ? 240 : 64,
            //marginLeft: expanded ? 240 : 64,
            marginLeft: 64,
          }}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}
