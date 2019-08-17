import userActionTypes from "./user-types";

const INITIAL_STATE = {
  user: null,
  loadingUser: true
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case userActionTypes.FETCH_USER_SUCCESS:
      return {
        ...state,
        loadingUser: false,
        user: action.payload.user
      };
    case userActionTypes.FETCH_USER_FAILURE:
      return {
        ...state,
        loadingUser: false,
        user: null
      };
    case userActionTypes.SET_USER:
      return {
        ...state,
        user: action.payload.user
      };
    default:
      return state;
  }
};

export default userReducer;
