import React, { useReducer, useContext } from "react";
import reducer from "./reducer";

export const AppContext = React.createContext();

const initialState = {
  // voyage states
  voyageFilter: "byVoyage", // it is either by voyage or by date
  voyageType: "L", // All for All , L for Laden, B for Ballast
  selectedVoyage: "",
  ciiType: "demand", // selected type of cii
};

const AppProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppProvider;
