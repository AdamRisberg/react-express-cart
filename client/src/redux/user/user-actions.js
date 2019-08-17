import userActionTypes from "./user-types";
import api from "../../api";

const fetchUserSuccess = user => ({
  type: userActionTypes.FETCH_USER_SUCCESS,
  payload: { user }
});

const fetchUserFailure = () => ({
  type: userActionTypes.FETCH_USER_FAILURE
});

export const fetchUser = () => {
  return dispatch => {
    const token = window.localStorage.getItem("session");

    if (!token) return dispatch(fetchUserFailure());

    api
      .post("/api/auth/login", {}, {}, true, false)
      .then(response => {
        window.localStorage.setItem("session", response.data.token);
        dispatch(fetchUserSuccess(response.data.user));
      })
      .catch(err => {
        window.localStorage.removeItem("session");
        dispatch(fetchUserFailure());
        console.log(err.response);
      });
  };
};

export const setUser = user => ({
  type: userActionTypes.SET_USER,
  payload: { user }
});
