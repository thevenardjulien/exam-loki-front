import React, { createContext, useContext, useReducer, useEffect } from "react";
import Cookies from "js-cookie";

const CartContext = createContext();

const CART_COOKIE_NAME = "cart_state";

// Fonction pour charger l'état depuis le cookie
const loadStateFromCookie = () => {
  try {
    const cookieData = Cookies.get(CART_COOKIE_NAME);
    if (cookieData) {
      return JSON.parse(cookieData);
    }
  } catch (error) {
    console.error("Erreur lors du chargement du cookie:", error);
  }
  return null;
};

// Fonction pour sauvegarder l'état dans le cookie
const saveStateToCookie = (state) => {
  try {
    Cookies.set(CART_COOKIE_NAME, JSON.stringify(state), { expires: 7 }); // Expire dans 7 jours
  } catch (error) {
    console.error("Erreur lors de la sauvegarde du cookie:", error);
  }
};

// État initial par défaut
const initialState = {
  cart: [],
  shippingMethod: "colissimo", // Doit correspondre à la valeur dans ShippingMethodSelection
  paymentMethod: "Carte bancaire",
  shippingAddress: {
    street: "",
    city: "",
    postalCode: "",
    country: "",
  },
};

export const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const existingProductIndex = state.cart.findIndex(
        (item) => item.id === action.payload.id
      );

      if (existingProductIndex >= 0) {
        const updatedCart = [...state.cart];
        updatedCart[existingProductIndex].quantity +=
          action.payload.quantity || 1;
        return { ...state, cart: updatedCart };
      } else {
        return {
          ...state,
          cart: [...state.cart, { ...action.payload, quantity: 1 }],
        };
      }

    case "DECREMENT_QUANTITY":
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(item.quantity - 1, 1) } // Ne peut pas être inférieur à 1
            : item
        ),
      };

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload.id),
      };

    case "CLEAR_CART":
      return { ...state, cart: [] };

    case "SET_SHIPPING_METHOD":
      return { ...state, shippingMethod: action.payload };

    case "SET_PAYMENT_METHOD":
      return { ...state, paymentMethod: action.payload };
    case "SET_SHIPPING_ADDRESS":
      return { ...state, shippingAddress: action.payload };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  // Charger l'état initial depuis le cookie ou utiliser l'état par défaut
  const savedState = loadStateFromCookie();
  const [cartState, dispatch] = useReducer(
    cartReducer,
    savedState || initialState
  );

  // Sauvegarder l'état dans le cookie à chaque changement
  useEffect(() => {
    saveStateToCookie(cartState);
  }, [cartState]);

  return (
    <CartContext.Provider value={{ ...cartState, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
