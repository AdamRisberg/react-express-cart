import axios from "axios";

function get(url, options, requireSession, admin) {
  return axios.get(url, addAuthHeader(options, requireSession, admin));
}

function put(url, data, options, requireSession, admin) {
  return axios.put(url, data, addAuthHeader(options, requireSession, admin));
}

function post(url, data, options, requireSession, admin) {
  return axios.post(url, data, addAuthHeader(options, requireSession, admin));
}

function remove(url, options, requireSession, admin) {
  return axios.delete(url, addAuthHeader(options, requireSession, admin));
}

function addAuthHeader(options, requireSession, admin) {
  return Object.assign(options, {
    headers: { Authorization: createAuthHeader(requireSession, admin) }
  });
}

function createAuthHeader(requireSession, admin) {
  const token = requireSession ? getToken(admin) : null;
  return token ? `Bearer ${token}` : "";
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
