import { combineReducers } from "redux";

import cartReducer from "./cart/cart-reducer";
import settingsReducer from "./settings/settings-reducer";

const rootReducer = combineReducers({
  cart: cartReducer,
  settings: settingsReducer
});

export default rootReducer;
