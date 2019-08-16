import cartActionTypes from "./cart-types";
import { getCartSize } from "./cart-utils";

const INITIAL_STATE = {
  cartItems: [],
  cartSize: 0,
  cartID: "",
  loadingCart: true,
  showCartAdded: false,
  cartItemAdded: null
};

const cartReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case cartActionTypes.FETCH_CART_SUCCESS:
      return {
        ...state,
        cartID: action.payload.cartID,
        cartItems: action.payload.cartItems,
        cartSize: getCartSize(action.payload.cartItems),
        loadingCart: false
      };
    case cartActionTypes.FETCH_CART_ERROR:
      return {
        ...state,
        loadingCart: false
      };
    case cartActionTypes.ITEM_ADDED:
      return {
        ...state,
        cartID: action.payload.cartID,
        cartItems: action.payload.cartItems,
        cartSize: getCartSize(action.payload.cartItems),
        cartItemAdded: action.payload.cartItemAdded,
        showCartAdded: action.payload.showCartAdded
      };
    case cartActionTypes.UPDATE_CART:
      return {
        ...state,
        cartItems: action.payload.cartItems,
        cartSize: getCartSize(action.payload.cartItems)
      };
    case cartActionTypes.CLOSE_CART_ADDED:
      return {
        ...state,
        showCartAdded: false,
        cartItemAdded: null
      };
    default:
      return state;
  }
};

export default cartReducer;
