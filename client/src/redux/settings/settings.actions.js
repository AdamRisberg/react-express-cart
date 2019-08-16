import settingsActionTypes from "./settings-types";
import api from "../../api";

const fetchSettingsSuccess = settings => ({
  type: settingsActionTypes.FETCH_SETTINGS_SUCCESS,
  payload: settings
});

export const fetchSettings = () => {
  return dispatch => {
    api
      .get("/api/settings/general", {}, false, false)
      .then(res => {
        dispatch(fetchSettingsSuccess(res.data));
      })
      .catch(err => {
        console.log(err);
      });
  };
};
