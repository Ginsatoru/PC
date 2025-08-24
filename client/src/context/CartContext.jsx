import { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.cartItems.find(
        (item) => item._id === action.payload._id
      );

      if (existingItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((item) =>
            item._id === action.payload._id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, action.payload],
        };
      }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cartItems: state.cartItems.filter((item) => item._id !== action.payload),
      };

    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item._id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case 'CLEAR_CART':
      return {
        ...state,
        cartItems: [],
      };

    case 'SET_SHIPPING_ADDRESS':
      return {
        ...state,
        shippingAddress: action.payload,
      };

    case 'SET_PAYMENT_METHOD':
      return {
        ...state,
        paymentMethod: action.payload,
      };

    default:
      return state;
  }
};

const initialState = {
  cartItems: [],
  shippingAddress: {},
  paymentMethod: 'Cash on Delivery',
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      try {
        const parsedCart = JSON.parse(cartData);
        if (parsedCart.cartItems) {
          parsedCart.cartItems.forEach(item => {
            dispatch({ type: 'ADD_TO_CART', payload: item });
          });
        }
        if (parsedCart.shippingAddress) {
          dispatch({ type: 'SET_SHIPPING_ADDRESS', payload: parsedCart.shippingAddress });
        }
        if (parsedCart.paymentMethod) {
          dispatch({ type: 'SET_PAYMENT_METHOD', payload: parsedCart.paymentMethod });
        }
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever cart state changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  const addToCart = (product, quantity = 1) => {
    if (product.stock < quantity) {
      toast.error('Not enough stock available');
      return;
    }

    const cartItem = {
      _id: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      stock: product.stock,
      brand: product.brand,
      model: product.model,
      quantity,
    };

    dispatch({ type: 'ADD_TO_CART', payload: cartItem });
    toast.success('Item added to cart');
  };

  const removeFromCart = (id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    toast.success('Item removed from cart');
  };

  const updateCartQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    const item = state.cartItems.find(item => item._id === id);
    if (item && quantity > item.stock) {
      toast.error('Not enough stock available');
      return;
    }

    dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast.success('Cart cleared');
  };

  const setShippingAddress = (address) => {
    dispatch({ type: 'SET_SHIPPING_ADDRESS', payload: address });
  };

  const setPaymentMethod = (method) => {
    dispatch({ type: 'SET_PAYMENT_METHOD', payload: method });
  };

  // Computed values
  const cartItemsCount = state.cartItems.reduce((total, item) => total + item.quantity, 0);

  const cartSubtotal = state.cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const taxPrice = cartSubtotal * 0.08; // 8% tax rate

  const shippingPrice = cartSubtotal > 100 ? 0 : 10; // Free shipping over $100

  const totalPrice = cartSubtotal + taxPrice + shippingPrice;

  const value = {
    ...state,
    cartItemsCount,
    cartSubtotal,
    taxPrice,
    shippingPrice,
    totalPrice,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    setShippingAddress,
    setPaymentMethod,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export { CartContext };