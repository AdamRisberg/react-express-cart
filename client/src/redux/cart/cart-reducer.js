import cartActionTypes from "./cart-types";

const INITIAL_STATE = {
  cartItems: [],
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
        cart: action.payload.cart,
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
        cart: action.payload.cart,
        cartItemAdded: action.payload.cartItemAdded,
        showCartAdded: action.payload.showCartAdded
      };
    case cartActionTypes.UPDATE_CART:
      return {
        ...state,
        cart: action.payload.cart
      };
    case cartActionTypes.CLOSE_CART_ADDED:
      return {
        ...state,
        showCartAdded: false
      };
    default:
      return state;
  }
};

export default cartReducer;
