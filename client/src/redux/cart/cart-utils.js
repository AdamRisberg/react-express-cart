export const getCartSize = cart => {
  return cart.reduce((acc, item) => {
    return acc + item.quantity;
  }, 0);
};
