import api from "../api";

export const handleRequestError = err => {
  if (api.checkCancel(err)) {
    return true;
  }
  console.log(err);
};

export const handleAdminRequestError = (flashErrorMessage, err) => {
  if (api.checkCancel(err)) {
    return true;
  }
  if (err.response && err.response.status === 401) {
    const shouldLogout = err.response.data && err.response.data.logout;
    flashErrorMessage && flashErrorMessage(shouldLogout);
    return true;
  }

  console.log(err);
};

export const handleAdminRequestErrorFull = flashErrorMessage => err => {
  if (api.checkCancel(err)) {
    return;
  }
  if (err.response && err.response.status === 401) {
    const shouldLogout = err.response.data && err.response.data.logout;
    return flashErrorMessage && flashErrorMessage(shouldLogout);
  }

  console.log(err);
};

const monthLookup = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

export const formatDate = dateString => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = date.getDate();
  const month = monthLookup[date.getMonth()];
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
};

export const formatDateShort = dateString => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

export const flattenCategories = (
  categories,
  prefix = "",
  level = 0,
  result = []
) => {
  categories.forEach(cat => {
    cat.htmlTitle = prefix ? `${prefix} > ${cat.name}` : cat.name;
    cat.level = level;
    result.push(cat);
    flattenCategories(cat.subcategories, cat.htmlTitle, level + 1, result);
  });

  return result;
};
