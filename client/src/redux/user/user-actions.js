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

export const editUserSuccess = user => ({
  type: userActionTypes.EDIT_USER_SUCCESS,
  payload: { user }
});

export const editUser = (data, propKey, cb, errorCb) => {
  return dispatch => {
    api
      .put(`/api/customers/${propKey}`, data, {}, true, false)
      .then(res => {
        dispatch(editUserSuccess(res.data));
        if (cb) cb();
      })
      .catch(err => {
        const message = err.response && err.response.data;
        if (errorCb) errorCb(message || "");
      });
  };
};

export const addAddress = (userID, address) => {
  return dispatch => {
    api
      .post("/api/addresses", { id: userID, address }, {}, true, false)
      .then(response => {
        dispatch(editUserSuccess(response.data));
      })
      .catch(err => {
        console.log(err.response);
      });
  };
};

export const editAddress = (userID, address, addressID) => {
  return dispatch => {
    api
      .put(
        "/api/addresses",
        { id: userID, address, addressID },
        {},
        true,
        false
      )
      .then(response => {
        dispatch(editUserSuccess(response.data));
      })
      .catch(err => {
        console.log(err.response);
      });
  };
};

export const deleteAddress = (userID, addressID) => {
  return dispatch => {
    api
      .post("/api/addresses/remove", { id: userID, addressID }, {}, true, false)
      .then(response => {
        dispatch(editUserSuccess(response.data));
      })
      .catch(err => {
        console.log(err.response);
      });
  };
};
