import userActionTypes from "./user-types";

const INITIAL_STATE = {
  user: null,
  loadingUser: true,
  loginOpen: false,
  isRegister: false
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case userActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        loadingUser: false,
        user: action.payload.user,
        loginOpen: false
      };
    case userActionTypes.LOGIN_FAILURE:
    case userActionTypes.LOGOUT_SUCCESS:
      return {
        ...state,
        loadingUser: false,
        user: null
      };
    case userActionTypes.SHOW_LOGIN:
      return {
        ...state,
        loginOpen: true,
        isRegister: false
      };
    case userActionTypes.SHOW_REGISTER:
      return {
        ...state,
        loginOpen: true,
        isRegister: true
      };
    case userActionTypes.HIDE_LOGIN:
      return {
        ...state,
        loginOpen: false
      };
    case userActionTypes.EDIT_USER_SUCCESS:
      return {
        ...state,
        user: action.payload.user
      };
    default:
      return state;
  }
};

export default userReducer;
