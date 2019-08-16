import categoriesActionTypes from "./categories-types";
import api from "../../api";

const fetchCategoriesSuccess = categories => ({
  type: categoriesActionTypes.FETCH_CATEGORIES_SUCCESS,
  payload: { categories }
});

export const fetchCategories = () => {
  return dispatch => {
    api
      .get("/api/categories", {}, false, false)
      .then(res => {
        dispatch(fetchCategoriesSuccess(res.data));
      })
      .catch(err => {
        console.log(err);
      });
  };
};
