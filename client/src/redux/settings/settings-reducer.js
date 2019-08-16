import settingsActionTypes from "./settings-types";

const INITIAL_STATE = {};

const settingsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case settingsActionTypes.FETCH_SETTINGS_SUCCESS:
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
};

export default settingsReducer;
