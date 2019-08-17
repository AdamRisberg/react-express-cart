import { combineReducers } from "redux";

import cartReducer from "./cart/cart-reducer";
import settingsReducer from "./settings/settings-reducer";
import categoriesReducer from "./categories/categories-reducer";
import userReducer from "./user/user-reducer";

const rootReducer = combineReducers({
  cart: cartReducer,
  settings: settingsReducer,
  categories: categoriesReducer,
  user: userReducer
});

export default rootReducer;
