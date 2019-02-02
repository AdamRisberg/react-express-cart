import axios from "axios";

function get(url, options, requireSession, admin) {
  const token = requireSession ? getToken(admin) : null;

  return axios.get(
    url,
    token ? Object.assign(options, { headers: { "Authorization": "Bearer " + token }}) : options
  );
}

function put(url, data, options, requireSession, admin) {
  const token = requireSession ? getToken(admin) : null;

  return axios.put(
    url,
    data,
    token ? Object.assign(options, { headers: { "Authorization": "Bearer " + token }}) : options
  );
}

function post(url, data, options, requireSession, admin) {
  const token = requireSession ? getToken(admin) : null;

  return axios.post(
    url,
    data,
    token ? Object.assign(options, { headers: { "Authorization": "Bearer " + token }}) : options
  );
}

function remove(url, options, requireSession, admin) {
  const token = requireSession ? getToken(admin) : null;

  return axios.delete(
    url,
    token ? Object.assign(options, { headers: { "Authorization": "Bearer " + token }}) : options
  );
}

function getToken(admin) {
  const sessionKey = admin ? "admin-session" : "session";
  return window.localStorage.getItem(sessionKey);
}

function getCancelTokenSource() {
  return axios.CancelToken.source();
}

function checkCancel(err) {
  return axios.isCancel(err);
}

export default {
  get,
  put,
  post,
  delete: remove,
  getCancelTokenSource,
  checkCancel
};