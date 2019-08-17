import userActionTypes from "./user-types";
import api from "../../api";

const loginSuccess = user => ({
  type: userActionTypes.LOGIN_SUCCESS,
  payload: { user }
});

const loginFailure = () => ({
  type: userActionTypes.LOGIN_FAILURE
});

const logoutSuccess = () => ({
  type: userActionTypes.LOGOUT_SUCCESS
});

export const fetchUser = () => {
  return dispatch => {
    const token = window.localStorage.getItem("session");

    if (!token) return dispatch(loginFailure());

    api
      .post("/api/auth/login", {}, {}, true, false)
      .then(response => {
        window.localStorage.setItem("session", response.data.token);
        dispatch(loginSuccess(response.data.user));
      })
      .catch(err => {
        window.localStorage.removeItem("session");
        dispatch(loginFailure());
        console.log(err.response);
      });
  };
};

export const login = (formData, cb, errorCb) => {
  return dispatch => {
    api
      .post("/api/auth/login", formData, {}, false, false)
      .then(response => {
        window.localStorage.setItem("session", response.data.token);
        dispatch(loginSuccess(response.data.user));
        if (cb) cb();
      })
      .catch(err => {
        if (errorCb) errorCb();
        console.log(err.response);
      });
  };
};

export const register = (formData, cb, errorCb) => {
  return dispatch => {
    api
      .post("/api/auth/register", formData, {}, false, false)
      .then(response => {
        window.localStorage.setItem("session", response.data.token);
        dispatch(loginSuccess(response.data.user));
        if (cb) cb();
      })
      .catch(err => {
        if (errorCb) errorCb();
        console.log(err.response);
      });
  };
};

export const logout = () => {
  return dispatch => {
    api
      .get("/api/auth/logout", {}, true, false)
      .then(() => {
        window.localStorage.removeItem("session");
        dispatch(logoutSuccess());
      })
      .catch(err => {
        console.log("Error on logout");
      });
  };
};

export const showLogin = () => ({
  type: userActionTypes.SHOW_LOGIN
});

export const showRegister = () => ({
  type: userActionTypes.SHOW_REGISTER
});

export const hideLogin = () => ({
  type: userActionTypes.HIDE_LOGIN
});

export const setUser = user => ({
  type: userActionTypes.SET_USER,
  payload: { user }
});
