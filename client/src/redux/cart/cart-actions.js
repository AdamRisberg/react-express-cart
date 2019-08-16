import cartActionTypes from "./cart-types";
import api from "../../api";

export const fetchCartSuccess = (cartID, cart) => ({
  type: cartActionTypes.FETCH_CART_SUCCESS,
  payload: { cartID, cart }
});

export const fetchCartError = () => ({
  type: cartActionTypes.FETCH_CART_ERROR
});

export const fetchCart = () => {
  return dispatch => {
    const cartID = window.localStorage.getItem("cartSession");

    api
      .get("/api/cart/" + cartID, {}, false, false)
      .then(response => {
        window.localStorage.setItem("cartSession", response.data.cartID);
        dispatch(
          fetchCartSuccess({
            cartID: response.data.cartID,
            cart: response.data.cart
          })
        );
      })
      .catch(err => {
        window.localStorage.removeItem("cartSession");
        dispatch(fetchCartError());
        console.log(err.response);
      });
  };
};

const itemAdded = (cartID, cart, update, cartItemAdded) => ({
  type: cartActionTypes.CART_UPDATED,
  payload: {
    cartID,
    cart,
    showCartAdded: !update,
    cartItemAdded: !update ? cartItemAdded : null
  }
});

const updateCart = cart => ({
  type: cartActionTypes.UPDATE_CART,
  payload: { cart }
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
    const { cart } = getState().cart;
    let cartItem;

    for (let i = 0; i < cart.length; i++) {
      if (cart[i].productID === id && cart[i].optionsKey === optionsKey) {
        cartItem = cart[i];
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
