import uiActionTypes from "./ui-types";

const INITIAL_STATE = {
  showSideNav: false
};

const uiReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case uiActionTypes.SHOW_SIDE_NAV:
      return {
        ...state,
        showSideNav: true
      };
    case uiActionTypes.HIDE_SIDE_NAV:
      return {
        ...state,
        showSideNav: false
      };
    default:
      return state;
  }
};

export default uiReducer;
