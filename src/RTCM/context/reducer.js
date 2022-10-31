const reducer = (state, action) => {
  switch (action.type) {
    case "SET_VOYAGE_FILTER":
      return {
        ...state,
        voyageFilter: action.payload,
      };
    case "SET_VOYAGE_TYPE":
      return {
        ...state,
        voyageType: action.payload,
      };
    case "SET_VOYAGE":
      return {
        ...state,
        selectedVoyage: action.payload,
      };

    case "SET_CII_TYPE":
      return {
        ...state,
        ciiType: action.payload,
      };

    default:
      break;
  }
};

export default reducer;
