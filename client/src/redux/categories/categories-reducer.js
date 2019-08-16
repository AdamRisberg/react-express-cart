import categoriesActionTypes from "./categories-types";

const INITIAL_STATE = {
  categories: [],
  loadingCategories: true
};

const categoriesReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case categoriesActionTypes.FETCH_CATEGORIES_SUCCESS:
      return {
        ...state,
        categories: action.payload.categories,
        loadingCategories: false
      };
    default:
      return state;
  }
};

export default categoriesReducer;
