import cartActionTypes from "./cart-types";
import api from "../../api";

export const fetchCartSuccess = (cartID, cartItems) => ({
  type: cartActionTypes.FETCH_CART_SUCCESS,
  payload: { cartID, cartItems }
});

export const fetchCartError = () => ({
  type: cartActionTypes.FETCH_CART_ERROR
});

export const fetchCart = () => {
  return dispatch => {
    const cartID = window.localStorage.getItem("cartSession");

    if (!cartID) {
      return dispatch(fetchCartError());
    }

    api
      .get("/api/cart/" + cartID, {}, false, false)
      .then(response => {
        window.localStorage.setItem("cartSession", response.data.cartID);
        dispatch(fetchCartSuccess(response.data.cartID, response.data.cart));
      })
      .catch(err => {
        window.localStorage.removeItem("cartSession");
        dispatch(fetchCartError());
        // console.log(err.response);
      });
  };
};

const itemAdded = (cartID, cartItems, update, cartItemAdded) => ({
  type: cartActionTypes.ITEM_ADDED,
  payload: {
    cartID,
    cartItems,
    showCartAdded: !update,
    cartItemAdded: !update ? cartItemAdded : null
  }
});

const updateCart = cartItems => ({
  type: cartActionTypes.UPDATE_CART,
  payload: { cartItems }
});

export const closeCartAdded = () => ({
  type: cartActionTypes.CLOSE_CART_ADDED
});

export const addItem = (cartItem, update) => {
  return dispatch => {
    const cartID = window.localStorage.getItem("cartSession");

    api
      .post("/api/cart/add", { cartID, cartItem }, {}, false, false)
      .then(response => {
        window.localStorage.setItem("cartSession", response.data.cartID);
        dispatch(
          itemAdded(response.data.cartID, response.data.cart, update, cartItem)
        );
      })
      .catch(err => {
        console.log(err.response);
      });
  };
};

export const removeItem = (id, optionsKey) => {
  return dispatch => {
    const cartID = window.localStorage.getItem("cartSession");

    api
      .post("/api/cart/remove", { cartID, id, optionsKey }, {}, false, false)
      .then(response => {
        dispatch(updateCart(response.data));
      })
      .catch(err => {
        console.log(err.response);
      });
  };
};

export const updateItem = (id, optionsKey, quantity) => {
  return (dispatch, getState) => {
    const { cartItems } = getState().cart;
    let cartItem;

    for (let i = 0; i < cartItems.length; i++) {
      if (
        cartItems[i].productID === id &&
        cartItems[i].optionsKey === optionsKey
      ) {
        cartItem = cartItems[i];
        break;
      }
    }

    const quantityChange = quantity - cartItem.quantity;
    cartItem.quantity = quantityChange;

    dispatch(addItem(cartItem, true));
  };
};

export const clearCart = () => {
  return dispatch => {
    const cartID = window.localStorage.getItem("cartSession");

    api
      .post("/api/cart/clear", { cartID }, {}, false, false)
      .then(response => {
        dispatch(updateCart(response.data));
      })
      .catch(err => {
        window.localStorage.removeItem("cartSession");
        console.log(err.response);
      });
  };
};
