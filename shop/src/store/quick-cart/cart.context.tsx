import React, { useCallback, useEffect } from 'react';
import { cartReducer, State, initialState } from './cart.reducer';
import { Item, getItem, inStock } from './cart.utils';
import { useLocalStorage } from '@/lib/use-local-storage';
import { AUTH_TOKEN_KEY, CART_KEY } from '@/lib/constants';
import { useAtom } from 'jotai';
import { verifiedResponseAtom } from '@/store/checkout';
import Cookies from 'js-cookie';
import { HttpClient2 } from '@/framework/client/http-client2';
import { Cart } from '@/types';
import { API_ENDPOINTS } from '@/framework/client/api-endpoints';

interface CartProviderState extends State {
  addItemsToCart: (items: Item[]) => void;
  addItemToCart: (item: Item, quantity: number) => void;
  removeItemFromCart: (id: Item['id']) => void;
  clearItemFromCart: (id: Item['id']) => void;
  getItemFromCart: (id: Item['id']) => any | undefined;
  isInCart: (id: Item['id']) => boolean;
  isInStock: (id: Item['id']) => boolean;
  resetCart: () => void;
  updateCartLanguage: (language: string) => void;
}
export const cartContext = React.createContext<CartProviderState | undefined>(
  undefined,
);

cartContext.displayName = 'CartContext';

export const useCart = () => {
  const context = React.useContext(cartContext);
  if (context === undefined) {
    throw new Error(`useCart must be used within a CartProvider`);
  }
  return React.useMemo(() => context, [context]);
};

const fetchCartData = async () => {
  const token = Cookies.get('AUTH_TOKEN_KEY');
  try {
    const response = await HttpClient2.get<Cart>(API_ENDPOINTS.ADD_TO_CART, {
      token,
    });
    return response;
  } catch (error) {
    console.error('Error fetching cart data:', error);
  }
};

export const CartProvider: React.FC<{ children?: React.ReactNode }> = (
  props,
) => {
  const [savedCart, saveCart] = useLocalStorage(
    CART_KEY,
    JSON.stringify(initialState),
  );
  const [state, dispatch] = React.useReducer(
    cartReducer,
    savedCart ? JSON.parse(savedCart) : initialState,
  );
  const [, emptyVerifiedResponse] = useAtom(verifiedResponseAtom);
  useEffect(() => {
    emptyVerifiedResponse(null);
  }, [emptyVerifiedResponse, state]);

  useEffect(() => {
    saveCart(JSON.stringify(state));
  }, [state, saveCart]);

  useEffect(() => {
    const initializeCart = async () => {
      try {
        const cartData = await fetchCartData();
        if (cartData && cartData.items) {
          saveCart(JSON.stringify(cartData));
          dispatch({ type: 'SET_CART', cart: cartData });
        } else {
          throw new Error('Invalid cart data');
        }
      } catch (error) {
        console.error('Failed to fetch cart data:', error);
      }
    };
    initializeCart();
  }, []);

  const addItemsToCart = (items: Item[]) =>
    dispatch({ type: 'ADD_ITEMS_WITH_QUANTITY', items });
  const addItemToCart = async (item: Item, quantity: number) => {
    const token = Cookies.get(AUTH_TOKEN_KEY);
    if (quantity > item.product.stock) {
      console.error('Requested quantity exceeds available stock.');
      return;
    }
    if (token) {
      try {
        const response = await HttpClient2.post<Item>(
          API_ENDPOINTS.ADD_TO_CART,
          {
            productId: item.product._id,
            quantity,
          },
        );
        dispatch({ type: 'ADD_ITEM_WITH_QUANTITY', item, quantity });
      } catch (error) {
        console.error('Error adding item to cart:', error);
      }
    } else {
      dispatch({ type: 'ADD_ITEM_WITH_QUANTITY', item, quantity });
    }
  };
  const removeItemFromCart = (id: Item['id']) =>
    dispatch({ type: 'REMOVE_ITEM_OR_QUANTITY', id });
  const clearItemFromCart = async (id: Item['id']) => {
    const token = Cookies.get(AUTH_TOKEN_KEY);
    if (token) {
      try {
        const response = await HttpClient2.delete(
          `${API_ENDPOINTS.ADD_TO_CART}/${id}`,
        );
        console.log(response, 'Item removed successfully');
      } catch (error) {
        console.error('Error removing item from cart:', error);
      }
    }
    dispatch({ type: 'REMOVE_ITEM', id });
  };
  const isInCart = useCallback(
    (id: Item['id']) => !!getItem(state.items, id),
    [state.items],
  );
  const getItemFromCart = useCallback(
    (id: Item['id']) => getItem(state.items, id),
    [state.items],
  );
  const isInStock = useCallback(
    (id: Item['id']) => inStock(state.items, id),
    [state.items],
  );
  const updateCartLanguage = (language: string) =>
    dispatch({ type: 'UPDATE_CART_LANGUAGE', language });
  const resetCart = () => dispatch({ type: 'RESET_CART' });
  const value = React.useMemo(
    () => ({
      ...state,
      addItemsToCart,
      addItemToCart,
      removeItemFromCart,
      clearItemFromCart,
      getItemFromCart,
      isInCart,
      isInStock,
      resetCart,
      updateCartLanguage,
    }),
    [getItemFromCart, isInCart, isInStock, state],
  );
  return <cartContext.Provider value={value} {...props} />;
};
